-- CreateTable
CREATE TABLE "meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "restaurantSlug" TEXT NOT NULL,
    "calories" INTEGER,
    "sodium" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "protein" DECIMAL(65,30),
    "vitaminA" INTEGER,
    "vitaminC" INTEGER,
    "calcium" INTEGER,
    "iron" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "categoryName" TEXT NOT NULL,
    "allergensFalse" TEXT[],
    "allergensTrue" TEXT[],
    "ingredients" TEXT,
    "combinedSlug" TEXT NOT NULL,
    "totalFat" DECIMAL(65,30),
    "saturatedFat" DECIMAL(65,30),
    "transFat" DECIMAL(65,30),
    "cholesterol" DECIMAL(65,30),
    "totalCarbohydrates" DECIMAL(65,30),
    "dietaryFiber" DECIMAL(65,30),
    "proteinCarbRatio" DECIMAL(65,30),
    "proteinPerCalorie" DECIMAL(65,30),
    "sodiumPerCalorie" DECIMAL(65,30),
    "sodiumPerProtein" DECIMAL(65,30),
    "menuRestaurantAndCountry" TEXT,
    "allergen_eggs" BOOLEAN DEFAULT false,
    "allergen_fish" BOOLEAN DEFAULT false,
    "allergen_gluten" BOOLEAN DEFAULT false,
    "allergen_peanuts" BOOLEAN DEFAULT false,
    "allergen_shellfish" BOOLEAN DEFAULT false,
    "allergen_soy" BOOLEAN DEFAULT false,
    "allergen_tree_nuts" BOOLEAN DEFAULT false,
    "allergen_wheat" BOOLEAN DEFAULT false,
    "allergen_milk" BOOLEAN DEFAULT false,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "restaurantSlug" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "restaurantAndCountry" TEXT NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant" (
    "id" TEXT NOT NULL,
    "variantName" TEXT NOT NULL,
    "calories" INTEGER,
    "sodium" DECIMAL(65,30),
    "protein" DECIMAL(65,30),
    "vitaminA" INTEGER,
    "vitaminC" INTEGER,
    "calcium" INTEGER,
    "iron" INTEGER,
    "allergensFalse" TEXT[],
    "allergensTrue" TEXT[],
    "ingredients" TEXT,
    "mealCombinedSlug" TEXT NOT NULL,
    "totalFat" DECIMAL(65,30),
    "saturatedFat" DECIMAL(65,30),
    "transFat" DECIMAL(65,30),
    "cholesterol" DECIMAL(65,30),
    "totalCarbohydrates" DECIMAL(65,30),
    "dietaryFiber" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "proteinCarbRatio" DECIMAL(65,30),
    "proteinPerCalorie" DECIMAL(65,30),
    "sodiumPerCalorie" DECIMAL(65,30),
    "sodiumPerProtein" DECIMAL(65,30),
    "mealVariantCombinedSlug" TEXT NOT NULL,
    "variantSlug" TEXT NOT NULL,

    CONSTRAINT "variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subvariant" (
    "id" TEXT NOT NULL,
    "subvariantName" TEXT NOT NULL,
    "subvariantSlug" TEXT NOT NULL,
    "mealVariantCombinedSlug" TEXT NOT NULL,
    "fullSlug" TEXT NOT NULL,
    "calories" INTEGER,
    "totalFat" DECIMAL(65,30),
    "saturatedFat" DECIMAL(65,30),
    "transFat" DECIMAL(65,30),
    "cholesterol" DECIMAL(65,30),
    "sodium" DECIMAL(65,30),
    "totalCarbohydrates" DECIMAL(65,30),
    "dietaryFiber" DECIMAL(65,30),
    "sugar" DECIMAL(65,30),
    "protein" DECIMAL(65,30),
    "proteinPerCalorie" DECIMAL(65,30),
    "proteinCarbRatio" DECIMAL(65,30),
    "sodiumPerCalorie" DECIMAL(65,30),
    "sodiumPerProtein" DECIMAL(65,30),
    "vitaminA" INTEGER,
    "vitaminC" INTEGER,
    "calcium" INTEGER,
    "iron" INTEGER,
    "allergensFalse" TEXT[],
    "allergensTrue" TEXT[],
    "ingredients" TEXT,

    CONSTRAINT "subvariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rank" INTEGER,
    "difficulty" INTEGER,
    "globalVolume" INTEGER,
    "usVolume" INTEGER,
    "locations" INTEGER,
    "salesMillions" INTEGER,
    "segmentSlug" TEXT,
    "areasServed" TEXT[],
    "founded" TEXT,
    "headquarters" TEXT,
    "originalLocation" TEXT,
    "keyword" TEXT,
    "originalCountry" TEXT,
    "trafficPotential" INTEGER,
    "website" TEXT,
    "restaurantTypeSlug" TEXT,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "segment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurantType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT DEFAULT '',

    CONSTRAINT "restaurantType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentCategorySlug" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parentCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_restaurantTorestaurantType" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "meal_combinedSlug_key" ON "meal"("combinedSlug");

-- CreateIndex
CREATE UNIQUE INDEX "meal_restaurantSlug_slug_key" ON "meal"("restaurantSlug", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "menu_restaurantAndCountry_key" ON "menu"("restaurantAndCountry");

-- CreateIndex
CREATE UNIQUE INDEX "menu_restaurantSlug_countryCode_key" ON "menu"("restaurantSlug", "countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "country_code_key" ON "country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "variant_mealVariantCombinedSlug_key" ON "variant"("mealVariantCombinedSlug");

-- CreateIndex
CREATE UNIQUE INDEX "subvariant_fullSlug_key" ON "subvariant"("fullSlug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_slug_key" ON "restaurant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "segment_name_key" ON "segment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "segment_slug_key" ON "segment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "restaurantType_name_key" ON "restaurantType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "restaurantType_slug_key" ON "restaurantType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "parentCategory_name_key" ON "parentCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "parentCategory_slug_key" ON "parentCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_restaurantTorestaurantType_AB_unique" ON "_restaurantTorestaurantType"("A", "B");

-- CreateIndex
CREATE INDEX "_restaurantTorestaurantType_B_index" ON "_restaurantTorestaurantType"("B");

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_menuRestaurantAndCountry_fkey" FOREIGN KEY ("menuRestaurantAndCountry") REFERENCES "menu"("restaurantAndCountry") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_restaurantSlug_fkey" FOREIGN KEY ("restaurantSlug") REFERENCES "restaurant"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_restaurantSlug_fkey" FOREIGN KEY ("restaurantSlug") REFERENCES "restaurant"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant" ADD CONSTRAINT "variant_mealCombinedSlug_fkey" FOREIGN KEY ("mealCombinedSlug") REFERENCES "meal"("combinedSlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subvariant" ADD CONSTRAINT "subvariant_mealVariantCombinedSlug_fkey" FOREIGN KEY ("mealVariantCombinedSlug") REFERENCES "variant"("mealVariantCombinedSlug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_segmentSlug_fkey" FOREIGN KEY ("segmentSlug") REFERENCES "segment"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentCategorySlug_fkey" FOREIGN KEY ("parentCategorySlug") REFERENCES "parentCategory"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_restaurantTorestaurantType" ADD CONSTRAINT "_restaurantTorestaurantType_A_fkey" FOREIGN KEY ("A") REFERENCES "restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_restaurantTorestaurantType" ADD CONSTRAINT "_restaurantTorestaurantType_B_fkey" FOREIGN KEY ("B") REFERENCES "restaurantType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
