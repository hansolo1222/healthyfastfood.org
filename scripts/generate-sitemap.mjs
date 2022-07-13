import { writeFileSync } from 'fs';
import { globby } from 'globby';
import prettier from 'prettier';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient()
import path from 'path'

const BASE_URL = 'https://healthfastfood.org';

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
      '!pages/_app.tsx',
      '!pages/_document.tsx',
      '!data/*.mdx',
      '!pages/_*.js',
      '!pages/api',
      '!pages/404.tsx',
    ]);

    const staticPaths =  pages.map((page) => {
      const path = page
        .replace('pages', '')
        .replace('data', '')
        .replace('.js', '')
        .replace('.mdx', '')
        .replace('.tsx', '');
      const route = path === '/index' ? '' : path;
        const completePath = `${BASE_URL}${route}`
      return completePath
    })

  
    // const brands = await prisma.manufacturer.findMany()

    // const minerPaths = miners.map((entry)=>(`${BASE_URL}/miner/${entry.slug}`))

    // const gpuPaths = gpus.map((entry)=>(`${BASE_URL}/gpu/${entry.slug}`))

    // const brandPaths = brands.map((entry)=>(`${BASE_URL}/brand/${entry.slug}`))


    const allPaths = [...staticPaths]

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