import { writeFileSync } from "fs";
import { globby } from "globby";
import prettier from "prettier";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import path from "path";

// const context = require.context('../public', true, /.json$/);

const BASE_URL = "https://healthyfastfood.org";

const createSitemap = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${posts
          .map((id) => {
            return `
                <url>
                    <loc>${`${id}`}</loc>
                </url>
            `;
          })
          .join("")}
    </urlset>
    `;

let numberOfSitemaps = 2;

async function generate() {
  const prettierConfig = await prettier.resolveConfig("./.prettierrc.js");
  const pages = await globby([
    "pages/*.tsx",
    "pages/*.jsx",
    "pages/*.ts",
    "pages/*.js",
    "data/**/*.mdx",
    "!pages/_app.jsx",
    "!pages/_document.jsx",
    "!data/*.mdx",
    "!pages/_*.js",
    "!pages/api",
    "!pages/404.tsx",
    "!pages/[restaurant].jsx",
  ]);

  const staticPaths = pages.map((page) => {
    const path = page
      .replace("pages", "")
      .replace("data", "")
      .replace(".jsx", "")
      .replace(".mdx", "")
      .replace(".tsx", "");
    const route = path === "/index" ? "" : path;
    const completePath = `${BASE_URL}${route}`;
    return completePath;
  });

  const restaurants = await prisma.restaurant.findMany();
  const categories = await prisma.restaurantType.findMany();
  const meals = await prisma.meal.findMany({
    include: {
      restaurant: true,
    },
  });

  const restaurantPaths = restaurants.map(
    (restaurant) => `${BASE_URL}/${restaurant.slug}`
  );

  const ketoPaths = restaurants.map(
    (restaurant) => `${BASE_URL}/${restaurant.slug}/keto-low-carb`
  );

  const categoryPaths = categories.map(
    (category) => `${BASE_URL}/category/${category.slug}`
  );

  const mealPaths = meals.map(
    (meal) => `${BASE_URL}/${meal.restaurant.slug}/${meal.slug}`
  );

  const sitemap1Paths = [...staticPaths, ...restaurantPaths];

  const sitemap2Paths = [...ketoPaths, ...categoryPaths];

  const sitemap1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap1Paths
        .map((path) => {
          return `
                  <url>
                      <loc>${`${path}`}</loc>
                  </url>
              `;
        })
        .join("")}
  </urlset>
  `;

  const formattedSitemap1 = prettier.format(sitemap1, {
    ...prettierConfig,
    parser: "html",
  });

  writeFileSync("public/sitemap1.xml", formattedSitemap1);

  
  const sitemap2 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap2Paths
        .map((path) => {
          return `
                  <url>
                      <loc>${`${path}`}</loc>
                  </url>
              `;
        })
        .join("")}
  </urlset>
  `;

  const formattedSitemap2 = prettier.format(sitemap2, {
    ...prettierConfig,
    parser: "html",
  });

  writeFileSync("public/sitemap2.xml", formattedSitemap2);

   // meals get chunked into sitemaps of 10000 links
   const chunkSize = 10000;

   let chunkedPaths = [];
 
   for (let i = 0; i < mealPaths.length; i += chunkSize) {
     const chunk = mealPaths.slice(i, i + chunkSize);
     chunkedPaths.push(chunk);
     numberOfSitemaps++;
   }

  chunkedPaths.forEach((value, i) => {
    const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${value
          .map((path) => {
            return `
                    <url>
                        <loc>${`${path}`}</loc>
                    </url>
                `;
          })
          .join("")}
    </urlset>
    `;

    const formatted = prettier.format(sitemap, {
      ...prettierConfig,
      parser: "html",
    });

    let index = i + 3;
    // eslint-disable-next-line no-sync
    writeFileSync("public/sitemap" + index + ".xml", formatted);
  });

  const masterSitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://www.minerlist.com/sitemap1.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://www.minerlist.com/sitemap2.xml</loc>
      </sitemap>
      ${chunkedPaths
        .map((chunk, index) => {
          return `
            <sitemap>
                <loc>https://www.minerlist.com/sitemap${`${
                  index + 3
                }`}.xml</loc>
            </sitemap>
          `;
        })
        .join("")}
    </sitemapindex>
    `;

  writeFileSync("public/sitemap.xml", masterSitemap);

  // writeFileSync("public/allurls.json", JSON.stringify(allPaths));
}

generate();
