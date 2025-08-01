import {Logger} from './logger.ts'
import type {LoggerConfig} from '../types'
import path from 'node:path'

function serviceLogger(logger_config: LoggerConfig) {
    return new Logger(logger_config)
}

function loggerTransports(logger_config: LoggerConfig, type: 'cli' | 'service') {
    if (type === 'cli') {
        // CLI mode: console only, no timestamps, colors enabled
        return new Logger({
            ...logger_config,
            colors: true,
            file: undefined,
            level: logger_config.level || 'info',
            timestamp: false,
        })
    }if (type === 'service') {
        // Service mode: console + file, timestamps enabled, colors enabled for console
        return new Logger({
            ...logger_config,
            colors: true,
            level: logger_config.level || 'info',
            timestamp: true,
        })
    }
    return new Logger(logger_config)
}

interface StaticFileServerOptions {
    /** Base directory for the service */
    baseDir: string
    /** Logger instance for debug output */
    logger?: Logger
    /** Enable SPA fallback (serve index.html for unmatched routes) */
    spaFallback?: boolean
    /** Additional static directories to check (e.g., ['src'] for development) */
    fallbackDirs?: string[]
}

/**
 * Creates a static file server handler for Bun.serve
 * Handles serving files from public directory with optional fallbacks and SPA routing
 */
function createStaticFileHandler(options: StaticFileServerOptions) {
    const { baseDir, logger, spaFallback = true, fallbackDirs = [] } = options

    return async (request: Request, pathname: string): Promise<Response | null> => {
        // Default to index.html for root
        if (pathname === '/') {
            pathname = '/index.html'
        }

        // Try public directory first (built files)
        const publicPath = path.join(baseDir, 'public', pathname)
        const publicFile = Bun.file(publicPath)

        if (await publicFile.exists()) {
            logger?.debug(`[Static] Serving from public: ${publicPath}`)
            return new Response(publicFile)
        }

        // Try fallback directories (e.g., src for development)
        for (const fallbackDir of fallbackDirs) {
            const fallbackPath = path.join(baseDir, fallbackDir, pathname)
            const fallbackFile = Bun.file(fallbackPath)

            if (await fallbackFile.exists()) {
                logger?.debug(`[Static] Serving from ${fallbackDir}: ${fallbackPath}`)
                return new Response(fallbackFile)
            }
        }

        // SPA fallback - serve index.html for unmatched routes (except API calls)
        if (spaFallback && !pathname.startsWith('/api') && !pathname.includes('.')) {
            const indexPath = path.join(baseDir, 'public', 'index.html')
            const indexFile = Bun.file(indexPath)

            if (await indexFile.exists()) {
                logger?.debug(`[Static] SPA fallback for: ${pathname}`)
                return new Response(indexFile, {
                    headers: { 'Content-Type': 'text/html' }
                })
            }
        }

        // No match found
        return null
    }
}

/**
 * Adds SPA fallback to a file serving response
 * If the original response is 404 and the request looks like a page route, serve index.html instead
 */
async function withSpaFallback(originalResponse: Response, request: Request, baseDir: string): Promise<Response> {
    // If we got a successful response, return it as-is
    if (originalResponse.status !== 404) {
        return originalResponse
    }

    const url = new URL(request.url)
    const pathname = url.pathname

    // Don't apply SPA fallback to:
    // - API routes
    // - File extensions (assets)
    // - WebSocket endpoints
    if (pathname.startsWith('/api') ||
        pathname.includes('.') ||
        pathname.startsWith('/bunchy') ||
        pathname.startsWith('/ws')) {
        return originalResponse
    }

    // Try to serve index.html for SPA routing
    const indexPath = path.join(baseDir, 'public', 'index.html')
    const indexFile = Bun.file(indexPath)

    if (await indexFile.exists()) {
        return new Response(indexFile, {
            headers: { 'Content-Type': 'text/html' }
        })
    }

    // No index.html found, return original 404
    return originalResponse
}

export {
    createStaticFileHandler,
    loggerTransports,
    serviceLogger,
    withSpaFallback,
}