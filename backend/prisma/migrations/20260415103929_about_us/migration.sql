-- CreateTable
CREATE TABLE "AboutUs" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUsCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUsCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AboutUs" ADD CONSTRAINT "AboutUs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AboutUsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
