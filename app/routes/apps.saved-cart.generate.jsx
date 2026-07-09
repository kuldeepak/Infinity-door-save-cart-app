import { authenticate } from "../shopify.server";
import {
  createSavedCart,
  getAuthorizedCustomer,
  validateMerchantStorefrontSession,
} from "../models/saved-cart.server";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}

export const action = async ({ request }) => {
  let context;

  try {
    context = await authenticate.public.appProxy(request);
  } catch (_error) {
    return json(
      { error: "App proxy authentication failed. Restart Shopify dev preview and make sure the app proxy points to this app URL." },
      { status: 401 },
    );
  }

  const { admin, session } = context;
  if (!session) return json({ error: "App is not installed for this shop." }, { status: 401 });

  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));
  const cart = body.cart;
  const merchantToken = body.merchantToken;

  if (!cart?.items?.length) {
    return json({ error: "Add products to the cart before generating a link." }, { status: 400 });
  }

  let customer;

  try {
    customer = await getAuthorizedCustomer({
      admin,
      customerId: url.searchParams.get("logged_in_customer_id"),
    });
  } catch (error) {
    return json(
      {
        error: `Could not verify the customer tag. Reauthorize the app so the read_customers scope is active, then try again. ${error.message || ""}`.trim(),
      },
      { status: 403 },
    );
  }

  if (!customer) {
    const merchantSession = await validateMerchantStorefrontSession({
      shop: session.shop,
      token: merchantToken,
    });
    if (merchantSession) {
      customer = { name: "Store merchant", email: merchantSession.email, region: null };
    }
  }

  if (!customer) {
    return json({ error: "Only authorized merchant or staff users can generate saved cart links." }, { status: 403 });
  }

  try {
    const savedCart = await createSavedCart({ shop: session.shop, cart, customer });
    const shareUrl = `/apps/saved-cart/${savedCart.token}/`;

    return json({ token: savedCart.token, url: shareUrl });
  } catch (error) {
    return json({ error: `Could not save cart data. ${error.message || ""}`.trim() }, { status: 500 });
  }
};

export const loader = async () => json({ error: "Method not allowed" }, { status: 405 });

