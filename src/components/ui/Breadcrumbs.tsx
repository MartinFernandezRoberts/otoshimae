import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

export type BreadcrumbItem = {
  label: string
  to?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn('ui-breadcrumbs', className)}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1 || !item.to

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-3">
              {index > 0 ? (
                <span aria-hidden="true" className="ui-breadcrumb-separator">
                  /
                </span>
              ) : null}

              {isCurrent ? (
                <span aria-current="page" className="ui-breadcrumb-current">
                  {item.label}
                </span>
              ) : (
                <Link to={item.to ?? ''} className="ui-breadcrumb-link">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
