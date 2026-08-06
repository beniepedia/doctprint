import { icon } from '../lib.js'

const SIZES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3.5 text-base',
  lg: 'px-6 py-4 text-lg',
}

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface border border-primary text-primary hover:bg-surface-low',
  danger: 'bg-surface border border-error text-error hover:bg-error-container hover:border-error',
  outline: 'border border-border-input text-text-primary hover:bg-surface-low',
  ghost: 'text-accent-deep hover:bg-surface-low',
}

const BASE = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95'

export function Button({
  label = '',
  variant = 'primary',
  size = 'md',
  href = '',
  icon: iconName = '',
  full = false,
  extra = '',
  attrs = '',
}) {
  const cls = [BASE, SIZES[size], VARIANTS[variant], full ? 'w-full' : '', extra].filter(Boolean).join(' ').trim()
  const content = `${iconName ? icon(iconName) : ''}${label}`
  return href
    ? `<a href="${href}" class="${cls}" ${attrs}>${content}</a>`
    : `<button class="${cls}" ${attrs}>${content}</button>`
}
