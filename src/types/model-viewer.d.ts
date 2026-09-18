import type * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        poster?: string
        loading?: 'auto' | 'lazy' | 'eager'
        'environment-image'?: string
        'shadow-intensity'?: string | number
        'shadow-softness'?: string | number
        exposure?: string | number
        'camera-controls'?: boolean
        'touch-action'?: string
      }
    }
  }
}

export {}
