import { authenticate } from "../shopify.server";
import { markRecoveredFromOrder } from "../models/saved-cart.server";

export const action = async ({ request }) => {
  const { payload, shop } = await authenticate.webhook(request);
  await markRecoveredFromOrder({ shop, order: payload });
  return new Response();
};
