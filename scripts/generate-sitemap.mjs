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

let numberOfSitemaps = 0

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

  const meals = await prisma.meal.findMany({
    include: {
      restaurant: true,
    },
  });

  const restaurantPaths = restaurants.map(
    (restaurant) => `${BASE_URL}/${restaurant.slug}`
  );

  const mealPaths = meals.map(
    (meal) => `${BASE_URL}/${meal.restaurant.slug}/${meal.slug}`
  );

  const allPaths = [...staticPaths, ...restaurantPaths, ...mealPaths];

  const chunkSize = 10000;

  let chunkedPaths = [];

  for (let i = 0; i < allPaths.length; i += chunkSize) {
    const chunk = allPaths.slice(i, i + chunkSize);
    chunkedPaths.push(chunk);
    numberOfSitemaps++;
  }

  chunkedPaths.forEach((value, i) => {
    const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${value
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

    const formatted = prettier.format(sitemap, {
      ...prettierConfig,
      parser: "html",
    });

    let index = i + 1;
    // eslint-disable-next-line no-sync
    writeFileSync("public/sitemap" + index + ".xml", formatted);
  });

  const masterSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${chunkedPaths.map((chunk, index)=>{
            return `
                    <sitemap>
                        <loc>https://www.minerlist.com/sitemap${`${index + 1}`}.xml</loc>
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
