import crypto from "node:crypto";
import prisma from "../db.server";

export const SAVED_CART_STATUS = {
  notRecovered: "Not recovered",
  recovered: "Recovered",
};

export function generateToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function moneyFromCents(cents, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format((Number(cents) || 0) / 100);
}

export function normalizeCartItem(item) {
  return {
    productId: item.product_id ? String(item.product_id) : null,
    variantId: item.variant_id ? String(item.variant_id) : String(item.id || ""),
    title: item.product_title || item.title || "Untitled product",
    variantTitle: item.variant_title || null,
    sku: item.sku || null,
    quantity: Number(item.quantity) || 0,
    price: Number(item.final_price ?? item.price ?? 0) || 0,
    propertiesJson: JSON.stringify(item.properties || {}),
    imageUrl: item.image || item.featured_image?.url || null,
  };
}

export async function createSavedCart({ shop, cart, customer }) {
  const token = generateToken();
  const items = Array.isArray(cart.items) ? cart.items.map(normalizeCartItem) : [];
  const subtotal = Number(cart.items_subtotal_price ?? cart.original_total_price ?? cart.total_price ?? 0) || 0;
  const total = Number(cart.total_price ?? subtotal) || 0;

  return prisma.savedCart.create({
    data: {
      shop,
      token,
      status: SAVED_CART_STATUS.notRecovered,
      customerName: customer?.name || null,
      customerEmail: customer?.email || null,
      region: customer?.region || null,
      subtotal,
      total,
      cartJson: JSON.stringify(cart),
      items: {
        create: items,
      },
    },
    include: { items: true },
  });
}

export async function getSavedCart(shop, token) {
  return prisma.savedCart.findFirst({
    where: { shop, token },
    include: { items: true },
  });
}

export async function deleteSavedCart({ shop, token }) {
  return prisma.savedCart.deleteMany({
    where: { shop, token },
  });
}

export async function listSavedCarts({ shop, query = "", status = "", page = 1, pageSize = 20 }) {
  const where = {
    shop,
    ...(status ? { status } : {}),
    ...(query
      ? {
          OR: [
            { token: { contains: query } },
            { customerName: { contains: query } },
            { customerEmail: { contains: query } },
            { region: { contains: query } },
          ],
        }
      : {}),
  };
  const safePageSize = Math.max(Number(pageSize) || 20, 1);
  const requestedPage = Math.max(Number(page) || 1, 1);
  const count = await prisma.savedCart.count({ where });
  const totalPages = Math.max(Math.ceil(count / safePageSize), 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const skip = (currentPage - 1) * safePageSize;
  const carts = await prisma.savedCart.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: safePageSize,
    include: { items: true },
  });

  return {
    carts,
    count,
    page: currentPage,
    pageSize: safePageSize,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}

export async function createMerchantStorefrontSession({ shop, email }) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  return prisma.merchantStorefrontSession.create({
    data: { shop, token, email: email || null, expiresAt },
  });
}

export async function validateMerchantStorefrontSession({ shop, token }) {
  if (!token) return null;

  const session = await prisma.merchantStorefrontSession.findFirst({
    where: {
      shop,
      token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!session) return null;
  return session;
}

export async function getAuthorizedCustomer({ admin, customerId }) {
  if (!customerId || !admin) return null;

  const gid = `gid://shopify/Customer/${customerId}`;
  const response = await admin.graphql(
    `#graphql
    query SavedCartCustomer($id: ID!) {
      customer(id: $id) {
        displayName
        email
        tags
        defaultAddress {
          country
          province
        }
      }
    }`,
    { variables: { id: gid } },
  );
  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join(" "));
  }

  const customer = json.data?.customer;

  if (!customer?.tags?.includes("cart-link-merchant")) return null;

  return {
    name: customer.displayName,
    email: customer.email,
    region: [customer.defaultAddress?.province, customer.defaultAddress?.country].filter(Boolean).join(", ") || null,
  };
}

export async function markRecoveredFromOrder({ shop, order }) {
  const token = order.note_attributes?.find((attribute) => attribute.name === "_saved_cart_token")?.value;
  if (!token) return null;

  return prisma.savedCart.updateMany({
    where: { shop, token, status: SAVED_CART_STATUS.notRecovered },
    data: {
      status: SAVED_CART_STATUS.recovered,
      recoveredOrderId: String(order.admin_graphql_api_id || order.id),
    },
  });
}

export function parseCartJson(cartJson) {
  try {
    return JSON.parse(cartJson);
  } catch (_error) {
    return {};
  }
}





