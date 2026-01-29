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
                src: '/api/icons/192',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/api/icons/512',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/api/icons/512',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
