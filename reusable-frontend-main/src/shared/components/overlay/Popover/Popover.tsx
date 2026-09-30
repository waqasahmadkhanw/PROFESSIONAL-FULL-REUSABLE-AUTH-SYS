'use client';

import {
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  side?: Side;
  align?: Align;
}

const sideStyles: Record<Side, string> = {
  top: 'bottom-full mb-2',
  right: 'left-full ml-2',
  bottom: 'top-full mt-2',
  left: 'right-full mr-2',
};

const alignStyles: Record<Align, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'center',
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="focus:outline-none"
      >
        {trigger}
      </button>

      {open && (
        <div
          className={`
            absolute
            z-50
            min-w-[160px]
            rounded-lg
            border
            border-slate-200
            bg-white
            text-slate-900
            dark:border-slate-800
            dark:bg-slate-900
            dark:text-slate-100
            p-2
            shadow-lg
            ${sideStyles[side]}
            ${alignStyles[align]}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
}

