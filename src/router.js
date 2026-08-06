function parseHash() {
  const hash = location.hash.replace(/^#\/?/, '')
  const [path, query = ''] = hash.split('?')
  return { path: path || 'home', params: new URLSearchParams(query) }
}

export function start(root, views) {
  const render = () => {
    const { path, params } = parseHash()
    const view = views[path] || views.home
    root.innerHTML = view.render(params)
    if (view.mount) view.mount(root, params)
    window.scrollTo(0, 0)
  }
  window.addEventListener('hashchange', render)
  render()
}
