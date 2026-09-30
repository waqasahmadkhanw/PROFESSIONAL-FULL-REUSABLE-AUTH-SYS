'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';

export const Dropdown = DropdownMenu.Root;

export const DropdownTrigger = DropdownMenu.Trigger;

export const DropdownContent = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>(({ className = '', sideOffset = 6, ...props }, ref) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`
        z-50
        min-w-[180px]
        rounded-lg
        border
        border-slate-200
        bg-white
        text-slate-900
        dark:border-slate-800
        dark:bg-slate-900
        dark:text-slate-100
        p-1
        shadow-lg
        outline-none
        ${className}
      `}
      {...props}
    />
  </DropdownMenu.Portal>
));

DropdownContent.displayName = 'DropdownContent';

export const DropdownItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Item>
>(({ className = '', ...props }, ref) => (
  <DropdownMenu.Item
    ref={ref}
    className={`
      flex
      cursor-pointer
      select-none
      items-center
      rounded-md
      px-3
      py-2
      text-sm
      text-slate-800
      hover:bg-slate-100
      hover:text-slate-900
      focus:bg-slate-100
      dark:text-slate-200
      dark:hover:bg-slate-800
      dark:hover:text-white
      dark:focus:bg-slate-800
      outline-none
      transition-colors
      data-[disabled]:pointer-events-none
      data-[disabled]:opacity-50
      ${className}
    `}
    {...props}
  />
));

DropdownItem.displayName = 'DropdownItem';

export const DropdownSeparator = () => (
  <DropdownMenu.Separator className="my-1 h-px bg-slate-200 dark:bg-slate-800" />
);

export const DropdownLabel = forwardRef<
  React.ElementRef<typeof DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>(({ className = '', ...props }, ref) => (
  <DropdownMenu.Label
    ref={ref}
    className={`px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white ${className}`}
    {...props}
  />
));

DropdownLabel.displayName = 'DropdownLabel';