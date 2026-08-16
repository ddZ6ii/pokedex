// Generates public/sitemap.xml from src/data/db.json before each build, so
// Vite copies it into dist/ verbatim alongside the rest of public/. Not
// committed to git (public/sitemap.xml is gitignored) — it's derived data,
// regenerated on every build so it never drifts from db.json.

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const SITE_URL = 'https://pokedex.ddz6ii.io'

const { pokemons } = JSON.parse(
  readFileSync(path.join(ROOT, 'src/data/db.json'), 'utf-8'),
)

const today = new Date().toISOString().slice(0, 10)

const staticUrls = [
  { loc: '/', changefreq: 'monthly', priority: '1.0' },
  { loc: '/pokemons', changefreq: 'weekly', priority: '0.8' },
]

const pokemonUrls = pokemons.map(({ id }) => ({
  loc: `/pokemons/${id}`,
  changefreq: 'monthly',
  priority: '0.6',
}))

const urlEntries = [...staticUrls, ...pokemonUrls]
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

writeFileSync(path.join(ROOT, 'public/sitemap.xml'), sitemap)

const urlCount = staticUrls.length + pokemonUrls.length
console.log(`Generated public/sitemap.xml with ${urlCount} URLs`)
