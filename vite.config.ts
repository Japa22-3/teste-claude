import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

import siteConfiguration from './site.json'

// Configuracao para deploy no GitHub Pages do repositorio teste-claude.
export default defineConfig(({ mode }) => {
  const emitSourcemaps = mode === 'development'

  return {
    base: mode === 'development' ? '/' : '/teste-claude/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
      react(),
      tailwindcss(),
      figmaSiteConfiguration(siteConfiguration),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/**/*.stories.{ts,tsx,js,jsx}' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '5173'),
      strictPort: true,
      watch: { ignored: ['**/.figma/**'] },
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '5173'),
    },
  }
})

type FigmaSiteConfiguration = {
  title?: string
  description?: string
  language?: string
  robots?: { index?: boolean }
  icons?: { icon?: string }
  openGraph?: { image?: string }
  analytics?: { googleAnalyticsId?: string }
  customScripts?: { headStart?: string; headEnd?: string; bodyStart?: string; bodyEnd?: string }
  accessibility?: { addBypassLinks?: boolean }
}

function figmaSiteConfiguration(config: FigmaSiteConfiguration): Plugin {
  const sanitizeHtmlValue = (value: string | undefined) => value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
  const escapeHtmlText = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const replaceHtmlCommentSlot = (html: string, slotName: string, content: string) => html.replace(`<!--figma:${slotName}-->`, content)
  const title = config.title ?? 'VanFacil'
  const description = config.description ?? ''
  const favicon = config.icons?.icon ?? ''
  const socialImage = config.openGraph?.image ?? ''
  const language = sanitizeHtmlValue(config.language) || 'pt-BR'
  const googleAnalyticsId = sanitizeHtmlValue(config.analytics?.googleAnalyticsId)
  const robotsTxt = config.robots?.index === false ? 'User-agent: *\nDisallow: /\n' : ''

  return {
    name: 'figma-site-configuration',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!robotsTxt || req.url?.split('?')[0] !== '/robots.txt') return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })
    },
    generateBundle() {
      if (robotsTxt) this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html
        result = replaceHtmlCommentSlot(result, 'lang', language)
        result = replaceHtmlCommentSlot(result, 'title', escapeHtmlText(title))
        result = replaceHtmlCommentSlot(result, 'head-start', config.customScripts?.headStart ?? '')
        result = replaceHtmlCommentSlot(result, 'head-end', config.customScripts?.headEnd ?? '')
        result = replaceHtmlCommentSlot(result, 'body-start', config.customScripts?.bodyStart ?? '')
        result = replaceHtmlCommentSlot(result, 'body-end', config.customScripts?.bodyEnd ?? '')
        const tags: HtmlTagDescriptor[] = []
        if (description) tags.push({ tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' })
        if (config.robots?.index === false) tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
        if (favicon) tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' })
        if (title) tags.push({ tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' })
        if (description) tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' })
        if (socialImage) tags.push({ tag: 'meta', attrs: { property: 'og:image', content: socialImage }, injectTo: 'head' })
        if (googleAnalyticsId) {
          tags.push({ tag: 'script', attrs: { async: true, src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}` }, injectTo: 'head' })
          tags.push({ tag: 'script', children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(googleAnalyticsId)});`, injectTo: 'head' })
        }
        if (config.accessibility?.addBypassLinks) {
          tags.push({ tag: 'a', attrs: { class: 'figma-bypass-link', href: '#root' }, children: 'Pular para o conteudo', injectTo: 'body-prepend' })
        }
        return { html: result, tags }
      },
    },
  }
}

function figmaErrorOverlayReplay(): Plugin {
  return {
    name: 'figma-error-overlay-replay',
    apply: 'serve',
    configureServer(server) {
      let lastError: object | null = null
      const originalSend = server.ws.send.bind(server.ws) as (...args: unknown[]) => void
      server.ws.send = ((...args: unknown[]) => {
        const payload = args[0]
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          const type = (payload as { type?: string }).type
          if (type === 'error') lastError = payload
          if (type === 'update' || type === 'full-reload') lastError = null
        }
        return originalSend(...args)
      }) as typeof server.ws.send
      server.ws.on('connection', (socket) => {
        if (lastError) socket.send(JSON.stringify(lastError))
      })
    },
  }
}

function figmaReactRefreshBoundaryFallback(): Plugin {
  return {
    name: 'figma-react-refresh-boundary-fallback',
    apply: 'serve',
  }
}

function figmaMakeKitPlugin(options: { storiesGlob: string | string[] }): Plugin {
  return {
    name: 'figma-make-kit',
    apply: 'serve',
    config() {
      return { define: { __FIGMA_STORIES_GLOB__: JSON.stringify(options.storiesGlob) } }
    },
  }
}
