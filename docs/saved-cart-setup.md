# Saved cart setup

1. Run `npm run setup` or `npx prisma migrate deploy && npx prisma generate` after pulling this change.
2. Deploy the app config with `npm run deploy` so the added `read_customers` scope and app proxy configuration are registered. The `orders/create` webhook is intentionally not subscribed in dev config because Shopify rejects protected-customer-data webhook topics until the app is approved for protected customer data.
3. In Shopify admin, enable the `SaveCart` theme app embed on the storefront theme.
4. Add the customer tag `cart-link-merchant` to merchant/customer accounts that should see the cart page `Generate Link` button.
5. Staff who are not storefront customers can open the embedded app and click `Open storefront as merchant`. This creates a 15-minute temporary storefront session and opens `/cart`.
6. App proxy should point to prefix `apps`, subpath `saved-cart`, and the app URL `/apps` path. Generated links use `/apps/saved-cart/{token}`.

## Test checklist

- Tagged merchant customer sees `Generate Link` on `/cart`.
- Normal customer does not see the button.
- Embedded app `Open storefront as merchant` opens a temporary authorized storefront session.
- Generated link copies to the clipboard and creates a `SavedCart` plus `SavedCartItem` rows.
- Opening `/apps/saved-cart/{token}` clears the current cart, restores variants, quantities, line item properties, cart attributes, and cart note, then redirects to `/cart`.
- Unavailable variants surface the Ajax Cart API error on the restore page.
- `/app/saved-carts` search, status filter, pagination, and CSV export work.
- `/app/saved-carts/{token}` shows line items, totals, customer details, and recovered order data.
- After Shopify approves protected customer data access, add the `orders/create` subscription back to `shopify.app.toml`; the existing `/webhooks/orders/create` route will update restored carts to `Recovered`.

