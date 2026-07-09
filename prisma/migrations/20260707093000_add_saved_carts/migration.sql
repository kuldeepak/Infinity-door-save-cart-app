CREATE TABLE "SavedCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not recovered',
    "customerName" TEXT,
    "customerEmail" TEXT,
    "region" TEXT,
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "cartJson" TEXT NOT NULL,
    "recoveredOrderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "SavedCartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "savedCartId" INTEGER NOT NULL,
    "productId" TEXT,
    "variantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "variantTitle" TEXT,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "propertiesJson" TEXT,
    "imageUrl" TEXT,
    CONSTRAINT "SavedCartItem_savedCartId_fkey" FOREIGN KEY ("savedCartId") REFERENCES "SavedCart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MerchantStorefrontSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "SavedCart_token_key" ON "SavedCart"("token");
CREATE INDEX "SavedCart_shop_createdAt_idx" ON "SavedCart"("shop", "createdAt");
CREATE INDEX "SavedCart_shop_status_idx" ON "SavedCart"("shop", "status");
CREATE INDEX "SavedCartItem_savedCartId_idx" ON "SavedCartItem"("savedCartId");
CREATE INDEX "SavedCartItem_variantId_idx" ON "SavedCartItem"("variantId");
CREATE UNIQUE INDEX "MerchantStorefrontSession_token_key" ON "MerchantStorefrontSession"("token");
CREATE INDEX "MerchantStorefrontSession_shop_expiresAt_idx" ON "MerchantStorefrontSession"("shop", "expiresAt");
