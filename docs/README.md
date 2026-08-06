# DoctPrint — Prototipe Desain Frontend

Prototipe web e-commerce toko online alat kantor bernama **DoctPrint**, dibangun mulai dari desain
**"ShopEase"** yang dibuat di Stitch Design. Layout, struktur, dan komponen berikut mengikuti desain aslinya;
hanya branding dan konten teks yang disesuaikan ke konteks toko alat kantor (printer, tinta, toner, kertas, aksesori).

## Teknologi

| Bidang | Teknologi |
|---|---|
| Build tool | [Vite](https://vitejs.dev) |
| Styling | **Tailwind CSS v4** (via `@tailwindcss/vite`) |
| Logika | Vanilla JavaScript (ES Modules) |
| Router | Hash router ringan buatan sendiri (tanpa library) |
| Font & Ikon | Inter + Material Symbols Outlined (Google Fonts) |

## Menjalankan

```bash
npm install
npm run dev      # development, buka URL yang tampil di terminal
npm run build    # build produksi ke /dist
npm run preview  # pratinjau hasil build
```

## Rute (Hash Router)

| Hash | Screen | File |
|---|---|---|
| `#/` atau `#/home` | Halaman Utama | `src/views/home.js` |
| `#/product?id=<id>` | Detail Produk | `src/views/product.js` |
| `#/cart` | Keranjang Belanja | `src/views/cart.js` |
| `#/checkout` | Checkout | `src/views/checkout.js` |
| `#/profile` | Profil Pengguna | `src/views/profile.js` |

Contoh: `#/product?id=printer-ecotank-l3110`.

## Ringkasan Struktur

```
index.html
src/
  main.js             # bootstrap + mount router
  style.css           # Tailwind import + design tokens (@theme)
  router.js           # hash router kecil
  lib.js              # helper: icon, formatRp, placeholder, toast, field, btnClass
  data.js             # data mock (produk, kategori, menu, hero, ongkir, profil)
  state.js            # state keranjang + kalkulasi order
  components/         # TopApp, BottomNav, ProductCard, OrderSummary
  views/              # home, product, cart, checkout, profile
docs/
  DESIGN.md           # design system & token warna + cara mengubah
  ARCHITECTURE.md     # arsitektur, konvensi, cara menambah screen/komponen
```

## Dokumentasi lain

- **Desain & warna** → [docs/DESIGN.md](DESIGN.md)
- **Arsitektur & konvensi** → [docs/ARCHITECTURE.md](ARCHITECTURE.md)