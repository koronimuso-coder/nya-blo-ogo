import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOHeadProps {
    title?: string
    description?: string
    image?: string
    type?: string
}

const defaults = {
    siteName: 'NYA BLO — L\'Univers Digital Africain',
    description: 'Nya Blo — L\'Univers Digital Africain. Créer, Apprendre, Vivre. Une cité numérique bâtie sur les piliers de l\'Héritage Ancestral.',
    image: '/kanaga.svg',
    url: 'https://nyablo.com',
}

export default function SEOHead({ title, description, image, type = 'website' }: SEOHeadProps) {
    const location = useLocation()

    useEffect(() => {
        const fullTitle = title ? `${title} — NYA BLO` : defaults.siteName
        const desc = description || defaults.description
        const img = image || defaults.image
        const url = `${defaults.url}${location.pathname}`

        // Title
        document.title = fullTitle

        // Helper to set/create meta tag
        const setMeta = (attr: string, key: string, value: string) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
            if (!el) {
                el = document.createElement('meta')
                el.setAttribute(attr, key)
                document.head.appendChild(el)
            }
            el.setAttribute('content', value)
        }

        // Standard meta
        setMeta('name', 'description', desc)

        // Open Graph
        setMeta('property', 'og:title', fullTitle)
        setMeta('property', 'og:description', desc)
        setMeta('property', 'og:image', img)
        setMeta('property', 'og:url', url)
        setMeta('property', 'og:type', type)
        setMeta('property', 'og:site_name', 'NYA BLO')
        setMeta('property', 'og:locale', 'fr_FR')

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image')
        setMeta('name', 'twitter:title', fullTitle)
        setMeta('name', 'twitter:description', desc)
        setMeta('name', 'twitter:image', img)

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
        if (!canonical) {
            canonical = document.createElement('link')
            canonical.setAttribute('rel', 'canonical')
            document.head.appendChild(canonical)
        }
        canonical.setAttribute('href', url)
    }, [title, description, image, type, location.pathname])

    return null
}
