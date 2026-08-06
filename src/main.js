import './style.css'
import { start } from './router.js'
import home from './views/home.js'
import product from './views/product.js'
import cart from './views/cart.js'
import checkout from './views/checkout.js'
import profile from './views/profile.js'

start(document.querySelector('#app'), { home, product, cart, checkout, profile })
