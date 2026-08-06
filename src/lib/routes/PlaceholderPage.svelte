<script>
  import DefaultLayout from '../layouts/DefaultLayout.svelte'
  export let title = 'DoctPrint'
  export let route = 'home'
</script>

<DefaultLayout {route}>
  <div class="rounded-2xl border border-border bg-surface p-6 text-text-muted">{title}</div>
</DefaultLayout>
