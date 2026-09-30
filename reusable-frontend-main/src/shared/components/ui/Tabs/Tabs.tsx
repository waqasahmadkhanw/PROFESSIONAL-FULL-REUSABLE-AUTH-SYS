'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { forwardRef } from 'react';

export const Tabs = RadixTabs.Root;

export const TabsList = forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className = '', ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={`
      inline-flex
      h-10
      items-center
      rounded-lg
      bg-slate-200/80
      border
      border-slate-300/60
      dark:border-transparent
      dark:bg-slate-800
      p-1
      ${className}
    `}
    {...props}
  />
));

TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className = '', ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={`
      inline-flex
      items-center
      justify-center
      rounded-md
      px-4
      py-2
      text-sm
      font-medium
      text-slate-700
      hover:text-slate-900
      dark:text-slate-400
      dark:hover:text-white
      transition-all
      data-[state=active]:bg-white
      data-[state=active]:shadow-sm
      data-[state=active]:text-slate-900
      dark:data-[state=active]:bg-slate-900
      dark:data-[state=active]:text-white
      ${className}
    `}
    {...props}
  />
));

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className = '', ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={`
      mt-4
      focus:outline-none
      ${className}
    `}
    {...props}
  />
));

TabsContent.displayName = 'TabsContent';