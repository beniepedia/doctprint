<script>
  export let label = ''
  export let variant = 'primary'
  export let size = 'md'
  export let href = ''
  export let icon = ''
  export let full = false
  export let extra = ''
  export let disabled = false

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3.5 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-surface border border-primary text-primary hover:bg-surface-low',
    danger: 'bg-surface border border-error text-error hover:bg-error-container hover:border-error',
    outline: 'border border-border-input text-text-primary hover:bg-surface-low',
    ghost: 'text-accent-deep hover:bg-surface-low',
  }

  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95'
  $: cls = [base, sizes[size], variants[variant], full ? 'w-full' : '', extra].filter(Boolean).join(' ')
</script>

{#if href}
  <a href={href} class={cls} aria-disabled={disabled}>
    {#if icon}<span class="material-symbols-outlined">{icon}</span>{/if}
    {label}
  </a>
{:else}
  <button class={cls} {disabled}>
    {#if icon}<span class="material-symbols-outlined">{icon}</span>{/if}
    {label}
  </button>
{/if}
