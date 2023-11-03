import { VariantProps, cva, cx } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, FC } from 'react'
import { cls } from '@/lib/utils'

export const buttonVariants = cva(
  [
    'active:scale-95',
    'inline-flex',
    'items-center',
    'justify-center',
    'text-sm',
    'font-medium',
    'transition-color',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-slate-400',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'transition',
  ],
  {
    variants: {
      variant: {
        default: ['bg-slate-900', 'text-white', 'hover:bg-slate-800'],
        ghost: ['bg-transparent', 'hover:text-slate-900', 'hover:bg-slate-200'],
        primary: ['bg-indigo-600', 'hover:bg-indigo-700', 'text-white'],
        error: ['bg-red-600', 'hover:bg-red-700', 'text-white'],
      },
      rounding: {
        md: 'rounded-md',
        full: 'rounded-full',
      },
      size: {
        sm: ['h-9', 'px-2'],
        md: ['h-10', 'py-2', 'px-4'],
        lg: ['h-11', 'px-8'],
        icon: ['py-0', 'px-0', 'w-8', 'h-8'],
      },
    },
    compoundVariants: [
      {
        variant: ['primary', 'error'],
        size: 'md',
        rounding: 'full',
        className: 'hover:shadow-md',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounding: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  loading,
  size,
  rounding,
  ...props
}) => {
  return (
    <button
      className={cls(buttonVariants({ variant, size, className, rounding }))}
      disabled={loading}
      {...props}
    >
      {loading && (
        <Loader2
          className={cls(
            size === 'icon' ? 'h-3/4 w-3/4' : 'h-4 w-4',
            size !== 'icon' && 'mr-2',
            'animate-spin',
          )}
        />
      )}
      {(size !== 'icon' || !loading) && children}
    </button>
  )
}

export default Button
