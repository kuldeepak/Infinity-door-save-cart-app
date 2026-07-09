import { authenticate } from "../shopify.server";
import { createMerchantStorefrontSession } from "../models/saved-cart.server";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
}

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const merchantSession = await createMerchantStorefrontSession({
    shop: session.shop,
    email: session.email,
  });

  return json({
    storefrontUrl: `https://${session.shop}/apps/saved-cart/merchant/${merchantSession.token}/`,
    expiresAt: merchantSession.expiresAt,
  });
};
