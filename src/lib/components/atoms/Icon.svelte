<script>
  export let name = ''
  export let className = ''
  export let filled = false
</script>

<span class={`material-symbols-outlined inline-flex items-center justify-center leading-none align-middle ${className}`} style={filled ? "font-variation-settings:'FILL' 1" : ''}>{name}</span>
