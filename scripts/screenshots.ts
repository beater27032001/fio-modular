// Gera os prints do README: npm run build && npm run screenshots
import { spawn } from 'node:child_process'

import { chromium } from 'playwright'

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, full: false },
  { name: 'tablet', width: 820, height: 1180, full: false },
  { name: 'mobile-full', width: 390, height: 844, full: true },
]

const server = spawn('node_modules/.bin/next', ['start', '-p', '4173'])
await new Promise((resolve, reject) => {
  server.stdout.on('data', (d) => String(d).includes('Ready') && resolve(null))
  server.on('exit', (code) =>
    reject(new Error(`next start saiu com código ${code}`)),
  )
})
const browser = await chromium.launch()
const errors: string[] = []

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  })
  page.on('pageerror', (e) => errors.push(`${vp.name}: ${e.message}`))
  page.on(
    'console',
    (m) => m.type() === 'error' && errors.push(`${vp.name}: ${m.text()}`),
  )
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  if (!vp.full) {
    await page.screenshot({ path: `docs/${vp.name}.png` })
    await page.close()
    continue
  }
  // Rola a página inteira para disparar as animações de entrada antes do print completo.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `docs/${vp.name}.png`, fullPage: true })
  await page.close()
}

await browser.close()
server.kill()
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('prints salvos em docs/')
