<script>
  export let count = 0
</script>

{#if count}
  <span class="absolute -top-1 -right-2 bg-accent-container text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
{/if}
