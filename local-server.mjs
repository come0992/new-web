import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.join(projectRoot, 'dist')
const host = '127.0.0.1'
const port = 4173

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${host}:${port}`)
    const relativePath = decodeURIComponent(requestUrl.pathname)
      .replace(/^\/+/, '')
      .replaceAll('\\', '/')
    const requestedPath = relativePath || 'index.html'
    let filePath = path.resolve(siteRoot, requestedPath)

    if (!filePath.startsWith(`${siteRoot}${path.sep}`) && filePath !== siteRoot) {
      response.writeHead(403)
      response.end('Forbidden')
      return
    }

    try {
      const fileStats = await stat(filePath)
      if (fileStats.isDirectory()) filePath = path.join(filePath, 'index.html')
    } catch {
      filePath = path.join(siteRoot, 'index.html')
    }

    const body = await readFile(filePath)
    const extension = path.extname(filePath).toLowerCase()
    const isAsset = extension !== '.html'

    response.writeHead(200, {
      'Content-Type': contentTypes[extension] ?? 'application/octet-stream',
      'Cache-Control': isAsset ? 'public, max-age=3600' : 'no-cache',
    })
    response.end(body)
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Local site error')
    console.error(error)
  }
})

server.listen(port, host, () => {
  console.log(`Lithos local site: http://${host}:${port}/`)
})
