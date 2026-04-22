import { useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type TabsItem = {
  value: string
  label: string
  content: ReactNode
}

type TabsProps = {
  items: TabsItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  listClassName?: string
  panelClassName?: string
}

export function Tabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
  panelClassName,
}: TabsProps) {
  const generatedId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const fallbackValue = defaultValue ?? items[0]?.value ?? ''
  const [internalValue, setInternalValue] = useState(fallbackValue)
  const currentValue = value ?? internalValue

  const selectedItem = useMemo(
    () => items.find((item) => item.value === currentValue) ?? items[0] ?? null,
    [currentValue, items],
  )

  const setValue = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return
      }

      event.preventDefault()

      if (items.length === 0) {
        return
      }

      let nextIndex = index

      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % items.length
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + items.length) % items.length
      } else if (event.key === 'Home') {
        nextIndex = 0
      } else if (event.key === 'End') {
        nextIndex = items.length - 1
      }

      const nextItem = items[nextIndex]

      if (!nextItem) {
        return
      }

      setValue(nextItem.value)
      tabRefs.current[nextIndex]?.focus()
    }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div role="tablist" aria-label="Tabs" className={cn('ui-tabs-list', listClassName)}>
        {items.map((item, index) => {
          const isSelected = item.value === selectedItem?.value
          const tabId = `${generatedId}-tab-${item.value}`
          const panelId = `${generatedId}-panel-${item.value}`

          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[index] = node
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              data-state={isSelected ? 'active' : 'inactive'}
              className="ui-tab-trigger"
              onClick={() => setValue(item.value)}
              onKeyDown={handleKeyDown(index)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {selectedItem ? (
        <div
          id={`${generatedId}-panel-${selectedItem.value}`}
          role="tabpanel"
          aria-labelledby={`${generatedId}-tab-${selectedItem.value}`}
          className={cn('ui-tab-panel', panelClassName)}
        >
          {selectedItem.content}
        </div>
      ) : null}
    </div>
  )
}
