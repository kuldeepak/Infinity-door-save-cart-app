import { authenticate } from "../shopify.server";
import { validateMerchantStorefrontSession } from "../models/saved-cart.server";

export const loader = async ({ request, params }) => {
  const { liquid, session } = await authenticate.public.appProxy(request);
  if (!session) {
    return liquid("<p>Unable to open storefront merchant session.</p>");
  }

  const merchantSession = await validateMerchantStorefrontSession({
    shop: session.shop,
    token: params.token,
  });

  if (!merchantSession) {
    return liquid("<p>This storefront merchant session has expired. Open a new session from the embedded app.</p>");
  }

  return liquid(`
    <main style="max-width: 640px; margin: 48px auto; padding: 0 20px;">
      <h1>Opening storefront</h1>
      <p>You can now generate saved cart links from the cart page.</p>
    </main>
    <script>
      sessionStorage.setItem("shareCartProMerchantToken", ${JSON.stringify(params.token)});
      sessionStorage.setItem("shareCartProMerchantTokenExpiresAt", ${JSON.stringify(merchantSession.expiresAt.toISOString())});
      window.location.href = "/cart";
    </script>
  `);
};
