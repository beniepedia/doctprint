<script>
  import { profileMenu, user } from '../../data/site.js'
  import Icon from '../../components/atoms/Icon.svelte'

  const placeholder =
    'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600"%3E%3Crect width="600" height="600" fill="%23eef1f5"/%3E%3Ccircle cx="300" cy="240" r="110" fill="%23d7dde5"/%3E%3Crect x="150" y="380" width="300" height="130" rx="65" fill="%23d7dde5"/%3E%3C/svg%3E'
</script>

<section class="w-full max-w-3xl mx-auto px-4 md:px-8 flex flex-col gap-6 py-6">
  <section class="flex flex-col items-center text-center mt-4">
    <div class="w-24 h-24 rounded-full bg-surface-top border-2 border-border mb-4 overflow-hidden relative shadow-sm flex items-center justify-center">
      <img class="w-full h-full object-cover" src={placeholder} alt="Foto profil" />
    </div>
    <h1 class="text-xl md:text-2xl font-bold text-primary">{user.name}</h1>
    <p class="text-base text-text-muted">{user.email}</p>
    <button class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-4 py-3.5 text-base border border-border-input text-text-primary hover:bg-surface-low mt-4 shadow-sm">Edit Profil</button>
  </section>

  <section class="grid grid-cols-3 gap-2 md:gap-4 mt-4">
    {#each user.stats as s}
      <div class="bg-surface border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
        <Icon name={s.icon} className="text-accent-container text-2xl mb-2" filled={true} />
        <span class="text-lg md:text-xl font-semibold text-primary">{s.value}</span>
        <span class="text-sm text-text-muted text-center mt-1">{s.label}</span>
      </div>
    {/each}
  </section>

  <section class="bg-surface border border-border rounded-lg shadow-sm overflow-hidden flex flex-col mt-4">
    {#each profileMenu as m, i}
      <button class={`w-full flex items-center justify-between p-4 ${i < profileMenu.length - 1 ? 'border-b border-border' : ''} hover:bg-surface-low transition-colors group`}>
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full bg-surface-mid flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
            <Icon name={m.icon} />
          </div>
          <span class="text-base text-text-primary">{m.label}</span>
        </div>
        <Icon name="chevron_right" className="text-outline" />
      </button>
    {/each}
  </section>

  <section class="mt-6 mb-8">
    <button class="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 px-4 py-3.5 text-base w-full bg-surface border border-error text-error hover:bg-error-container hover:border-error shadow-sm">
      <Icon name="logout" />
      Keluar
    </button>
  </section>
</section>
