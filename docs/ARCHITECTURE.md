# DoctPrint — Arsitektur & Konvensi

## Struktur Folder

```
src/
  main.js             # Entry point: import CSS + mount router ke #app
  style.css           # @import "tailwindcss" + @theme (design tokens)
  router.js           # Hash router: parses #/path + kueri, lalu render view
  lib.js              # helper umum: icon(), formatRp(), placeholder(), toast(), field()
  data.js             # data mock (BRAND, categories, products, heroSlides, shippingOptions, provinces, user)
  state.js            # state keranjang + operasi & kalkulasi order
  components/         # komponen UI yang dipakai ulang (pure function → string HTML)
    Layout.js         #   shell halaman: TopApp + slot konten + BottomNav (opsional)
    TopApp.js         #   header atas (menu/back + brand + search)
    BottomNav.js      #   navigasi bawah (mobile), badge jumlah keranjang
    Button.js         #   tombol (variant primary/secondary/danger/outline/ghost, size sm/md/lg)
    ProductCard.js    #   kartu produk (mode horizontal & grid)
    OrderSummary.js   #   ringkasan pesanan (dipakai cart & checkout)
  views/              # satu file per screen (route)
    home.js
    product.js
    cart.js
    checkout.js
    profile.js
assets/               # aset yang diimport (hero.png, dst)
public/               # file statis (favicon, dst)
docs/                 # dokumentasi (README, DESIGN, file ini)
```

## Pola View

Setiap view mengekspor **default export** berupa objek dengan satu-dua method:

```js
export default {
  render(params) { /* params: URLSearchParams → kembalikan string HTML */ },
  mount(root)      { /* opsional; pasang event listener setelah innerHTML */ },
}
```

View hanya bertanggung jawab pada **konten**; shell halaman dikerjakan `Layout`:

```js
import { Layout } from '../components/Layout.js'

return Layout({
  top: { title, left, right, onBack }, // diteruskan ke TopApp
  active: 'home',                       // tab BottomNav yang aktif
  bottomNav: false,                     // opsional; false untuk halaman tanpa BottomNav
  children: `<main>…konten…</main>`,
})
```

`Layout` menyusun `TopApp` (fixed, `h-16`) + slot konten (dengan `pt-16` sebagai offset
header, dan `pb-24` mobile sebagai clearance BottomNav) + `BottomNav` bila `bottomNav`
tidak `false`. Router memanggil `view.render(params)` lalu `view.mount(root, params)`
setiap kali hash berubah. Untuk interaksi ringan, tandai elemen dengan `data-action` /
`data-id` di HTML, lalu hubungkan lewat `querySelector` di `mount`.

## Aliran Keranjang

- `state.js` menyimpan `state.cart` (array `{ id, qty, variant }`).
- Helper: `cartCount()`, `orderTotals()`, `addToCart()`, `changeQty()`, `removeItem()`,
  `cartProduct(id)` (memetakan id → objek produk dari `data.js`).
- `BottomNav` memanggil `cartCount()` untuk badge.
- Di `cart.js`, method `mount` me-render ulang dirinya sendiri setelah qty berubah sehingga
  total dan badge ikut terbarui.

## Menambah Screen Baru

1. Buat `src/views/<nama>.js` yang mengekspor `{ render, mount }`; bungkus HTML konten dengan `Layout` (lihat **Pola View**).
2. Daftarkan di **`src/main.js`** — tambahkan kunci baru pada objek yang diteruskan ke `start(...)`.
3. Route otomatis: `#/<nama>`; query tersedia via `params` (contoh `#/product?id=printer-ecotank-l3110`).
4. Opsional: tambahkan entry dari `BottomNav` / kartu.

## Menambah Komponen

Buat file di `src/components/`. Komponen adalah **pure function** yang mengembalikan string HTML
dan menerima data lewat argumen (mis. `ProductCard(product, { horizontal })`), tanpa state internal.

Contoh `Button`: `Button({ label, variant = 'primary', size = 'md', href, icon, full, extra, attrs })`.
`variant` mengatur warna (`primary | secondary | danger | outline | ghost`), `size` mengatur
ukuran (`sm | md | lg`); isi `href` untuk render `<a>`, `attrs` untuk `data-action`/`aria-label`.

## Menambah / Mengubah Data

Semua konten statis ada di **`src/data.js`**. Setiap produk wajib punya: `id, name, unit, price,
oldPrice, rating, badge, desc, specs[], colorOptions[], paperOptions[]` karena dipakai kartu
produk dan halaman detail.

## Menambah / Mengubah Warna

Baca **docs/DESIGN.md**. Cukup ubah nilai token di blok `@theme` pada `src/style.css`.

## Best Practices yang Dipakai

- **Mobile-first**: mulai dari susunan vertikal, lalu break `md:` untuk desktop.
- **HTML semantik**: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`.
- **Aksesibilitas**: `aria-label` pada tombol ikon, `for`/`id` pada label-input,
  target sentuh minimal 44px.
- **Bahasa**: label & teks tampil dalam Bahasa Indonesia (konteks DoctPrint).
- **Tanpa komentar berlebihan di kode**; penjelasan disimpan rapi di `docs/`.
- **Tanpa library tambahan** — router & helper dibuat sendiri agar ringan.

## Verifikasi

```bash
npm run build   # wajib sukses (mengompilasi seluruh @theme & utilitas)
npm run dev     # uji navigasi 5 rute hash
```
