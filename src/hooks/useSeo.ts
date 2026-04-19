import { useEffect } from 'react'

import { env } from '@/lib/env'

type UseSeoInput = {
  title: string
  description: string
}

export function useSeo({ title, description }: UseSeoInput) {
  useEffect(() => {
    document.title = `${title} | ${env.appName}`

    let metaDescription = document.querySelector('meta[name="description"]')

    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }

    metaDescription.setAttribute('content', description)
  }, [description, title])
}
