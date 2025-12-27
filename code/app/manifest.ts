import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'LocalMarket',
        short_name: 'LocalMarket',
        description: 'A local marketplace for your community',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#fe330a',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
        ],
    }
}
