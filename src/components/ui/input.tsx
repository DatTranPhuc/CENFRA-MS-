import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, errorMessage, ...props }: React.ComponentProps<'input'> & { errorMessage?: string }) {
  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary/20 selection:text-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-lg border bg-transparent px-3.5 py-2 text-sm shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'bg-card focus-visible:border-primary/80 focus-visible:ring-primary/20 focus-visible:ring-[3.5px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
      {errorMessage ? <div className="min-h-[1.25rem] text-sm text-red-600 font-medium mt-1">{errorMessage}</div> : null}
    </>
  );
}

export { Input };
