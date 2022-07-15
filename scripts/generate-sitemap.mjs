import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient()
import path from 'path'

// const context = require.context('../public', true, /.json$/);


const BASE_URL = 'https://healthyfastfood.org';

import * as restaurants from '../public/restaurant_links.json' assert {type: "json"};

import * as mcdonalds from '../public/data/mcdonalds.json' assert {type: "json"};

const createSitemap = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${posts
          .map(( id ) => {
            return `
                <url>
                    <loc>${`${id}`}</loc>
                </url>
            `;
          })
          .join('')}
    </urlset>
    `;

async function generate() {
    const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
    const pages = await globby([
      'pages/*.tsx',
      'pages/*.jsx',
      'pages/*.ts',
      'pages/*.js',
      'data/**/*.mdx',
      '!pages/_app.jsx',
      '!pages/_document.jsx',
      '!data/*.mdx',
      '!pages/_*.js',
      '!pages/api',
      '!pages/404.tsx',
      '!pages/[restaurant].jsx'
    ]);

    const staticPaths =  pages.map((page) => {
      const path = page
        .replace('pages', '')
        .replace('data', '')
        .replace('.jsx', '')
        .replace('.mdx', '')
        .replace('.tsx', '');
      const route = path === '/index' ? '' : path;
        const completePath = `${BASE_URL}${route}`
      return completePath
    })
  
    const restaurantPaths = restaurants.default.map((e)=>(`${BASE_URL}/${e.slug}`))

    const mcdonaldsPaths = restaurants.default.map((e)=>(`${BASE_URL}/${e.restaurant_slug}/${e.slug}`))


    const allPaths = [...staticPaths, ...restaurantPaths, ...mcdonaldsPaths]

    const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${
            allPaths.map(( id ) => {
                return `
                    <url>
                        <loc>${`${id}`}</loc>
                    </url>
                `;
              })
              .join('')}
    </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html'
  });

  // eslint-disable-next-line no-sync
  writeFileSync('public/sitemap.xml', formatted);
}

generate();