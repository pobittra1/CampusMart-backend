-- DropIndex
DROP INDEX "seller_application_userId_idx";

-- CreateIndex
CREATE INDEX "seller_application_userId_status_idx" ON "seller_application"("userId", "status");

-- AddForeignKey
ALTER TABLE "seller_application" ADD CONSTRAINT "seller_application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
