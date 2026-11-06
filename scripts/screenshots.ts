// Gera os prints do README: npm run build && npm run screenshots
import { chromium } from 'playwright'
import { preview } from 'vite'

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
]

const server = await preview({ preview: { port: 4173, strictPort: true } })
const browser = await chromium.launch()
const errors: string[] = []

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2 })
  page.on('pageerror', e => errors.push(`${vp.name}: ${e.message}`))
  page.on('console', m => m.type() === 'error' && errors.push(`${vp.name}: ${m.text()}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await page.screenshot({ path: `docs/${vp.name}.png` })
  // Rola a página inteira para disparar as animações de entrada antes do print completo.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise(r => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `docs/${vp.name}-full.png`, fullPage: true })
  await page.close()
}

await browser.close()
server.httpServer.close()
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log('prints salvos em docs/')
