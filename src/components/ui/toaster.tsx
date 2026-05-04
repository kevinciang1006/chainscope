import { forwardRef } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const ToastProvider = RadixToast.Provider;

export const ToastViewport = forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Viewport>
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 right-0 z-[100] flex flex-col gap-2 p-6 max-w-[380px] pointer-events-none',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = 'ToastViewport';

export const toastVariants = cva(
  [
    'pointer-events-auto group relative flex w-full items-start gap-3 overflow-hidden',
    'rounded-md border border-border bg-surface p-4 pr-8 shadow-md',
    'animate-slide-up',
    'data-[state=closed]:opacity-0 data-[state=closed]:animate-fade-in',
  ],
  {
    variants: {
      variant: {
        default: '',
        success: 'border-l-4 border-l-success',
        error: 'border-l-4 border-l-error',
        info: 'border-l-4 border-l-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof RadixToast.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = forwardRef<React.ElementRef<typeof RadixToast.Root>, ToastProps>(
  ({ className, variant, ...props }, ref) => (
    <RadixToast.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
);
Toast.displayName = 'Toast';

export const ToastTitle = forwardRef<
  React.ElementRef<typeof RadixToast.Title>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Title>
>(({ className, ...props }, ref) => (
  <RadixToast.Title
    ref={ref}
    className={cn('text-sm font-semibold text-text-1', className)}
    {...props}
  />
));
ToastTitle.displayName = 'ToastTitle';

export const ToastDescription = forwardRef<
  React.ElementRef<typeof RadixToast.Description>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Description>
>(({ className, ...props }, ref) => (
  <RadixToast.Description
    ref={ref}
    className={cn('text-sm text-text-2 mt-0.5', className)}
    {...props}
  />
));
ToastDescription.displayName = 'ToastDescription';

export const ToastAction = forwardRef<
  React.ElementRef<typeof RadixToast.Action>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Action>
>(({ className, ...props }, ref) => (
  <RadixToast.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border',
      'bg-transparent px-3 text-xs font-medium text-text-1',
      'transition-colors duration-150 hover:bg-surface-2',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = 'ToastAction';

export const ToastClose = forwardRef<
  React.ElementRef<typeof RadixToast.Close>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Close>
>(({ className, ...props }, ref) => (
  <RadixToast.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-sm p-1',
      'text-text-3 hover:text-text-1',
      'transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </RadixToast.Close>
));
ToastClose.displayName = 'ToastClose';

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}
