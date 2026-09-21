import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui-components/react/navigation-menu'
import type { ComponentProps } from 'react'

import { cn } from '../../lib/utils'

function NavigationMenu({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn('relative z-10 flex max-w-max flex-none items-center justify-center', className)}
      {...props}
    />
  )
}

function NavigationMenuList({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    />
  )
}

function NavigationMenuItem({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('relative', className)}
      {...props}
    />
  )
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn('group inline-flex items-center justify-center gap-1', className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({ className, ...props }: ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn('w-full', className)}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  popupClassName,
  popupStyle,
  align = 'center',
  sideOffset = 8,
  ...props
}: ComponentProps<typeof NavigationMenuPrimitive.Viewport> & {
  align?: ComponentProps<typeof NavigationMenuPrimitive.Positioner>['align']
  sideOffset?: number
  popupClassName?: string
  popupStyle?: ComponentProps<typeof NavigationMenuPrimitive.Popup>['style']
}) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <NavigationMenuPrimitive.Popup
          style={popupStyle}
          className={cn(
            'origin-top overflow-hidden rounded-2xl border border-white/50 bg-white/70 text-neutral-900 shadow-2xl backdrop-blur-[32px]',
            'transition-all duration-200 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            popupClassName,
          )}
        >
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport"
            className={cn('relative', className)}
            {...props}
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({ ...props }: ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" {...props} />
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
}
