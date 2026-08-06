<script>
  import TopApp from '../components/organisms/TopApp.svelte'
  import BottomNav from '../components/organisms/BottomNav.svelte'
  export let route = 'home'
  export let title = 'DoctPrint'
  export let cartSize = 0
</script>

<TopApp {title} />

<div class="pt-16 pb-24 md:pb-12 relative z-0">
  <slot />
</div>

<BottomNav active={route} count={cartSize} />
