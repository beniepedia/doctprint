<script>
  import TopApp from '../components/organisms/TopApp.svelte'
  import BottomNav from '../components/organisms/BottomNav.svelte'
  export let route = 'home'
  export let title = 'DoctPrint'
  export let cartSize = 0
  export let onBack = false
  export let showBottomNav = true
</script>

<TopApp {title} {onBack} />

<div class="pt-16 pb-24 md:pb-12 relative z-0">
  <slot />
</div>

{#if showBottomNav}
  <BottomNav active={route} count={cartSize} />
{/if}
