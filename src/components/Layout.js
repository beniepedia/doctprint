import { TopApp } from './TopApp.js'
import { BottomNav } from './BottomNav.js'

export function Layout({ top = {}, bottomNav = true, active = '', children }) {
  return `
    ${TopApp(top)}
    <div class="pt-16 ${bottomNav ? 'pb-24 md:pb-12' : 'pb-12'}">
      ${children}
    </div>
    ${bottomNav ? BottomNav(active) : ''}
  `
}
