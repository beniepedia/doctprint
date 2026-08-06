# DoctPrint — Design System

Dokumen ini menjadi sumber referensi tampilan (visual) seluruh aplikasi, termasuk kumpulan **design tokens**.
Semua token didefinisikan dalam blok `@theme` di **`src/style.css`**.

> Desain asal: **"Professional Commerce Core"** (dari Stitch), di-rebrand ke konteks DoctPrint.
> Prinsip: **Modern Corporate** — profesional, tepercaya, mobile-first.

## Cara Mengubah Warna (Penting)

Semua warna aplikasi dikendalikan oleh CSS **custom properties** di satu tempat:

```css
/* src/style.css */
@theme {
  --color-primary: #0f172a;   /* ← ubah nilai hex di sini */
  --color-accent:  #f97316;
}
```

Setelah mengubah nilai, seluruh utilitas yang memakainya (contoh `bg-primary`, `text-accent`,
`border-accent`) ikut berubah otomatis di seluruh app. Tidak perlu mencari satu per satu.

## Variabel Warna

### Brand

| Token | Nilai | Ringkasan peran |
|---|---|---|
| `--color-primary` | `#0f172a` | Warna utama (navy). Header, border aktif, overlay gradasi. |
| `--color-primary-container` | `#131b2e` | Objek "dark" (progress bar). |
| `--color-on-primary` | `#ffffff` | Teks di atas `primary`. |

### Aksen (CTA)

| Token |             | Peran |
|---|---|---|
| `--color-accent` | `#f97316` | Tombol utama/CTA (Beli, Checkout, Lanjut). |
| `--color-accent-container` | `#fd761a` | Badge, jumlah(qty), bintang rating, ikon. |
| `--color-accent-soft` | `#ffdbca` | Latar pill pada navigasi aktif. |
| `--color-accent-hover` | `#ea580c` | Hover tombol utama. |
| `--color-accent-deep` | `#9d4300` | Teks brand & harga detail (turunan orange tua). |
| `--color-on-accent` | `#ffffff` | Teks di atas `accent`. |
| `--color-on-accent-container` | `#5c2400` | Teks di atas `accent-container`. |

### Permukaan (Surface)

| Token | Nilai | Peran |
|---|---|---|
| `--color-bg` | `#f7f9fb` | Latar halaman. |
| `--color-surface` | `#ffffff` | Kartu / dasar konten. |
| `--color-surface-low` | `#f2f4f6` | Area section / hover ringan. |
| `--color-surface-mid` | `#eceef0` | Bulat ikon, input, latar kategori. |
| `--color-surface-high` | `#e6e8ea` | Track progress. |
| `--color-surface-top` | `#e0e3e5` | level tertinggi (avatar). |

### Teks

| Token | Nilai | Peran |
|---|---|---|
| `--color-text-primary` | `#191c1e` | Teks utama. |
| `--color-text-muted` | `#45464d` | Teks sekunder / keterangan. |

### Garis / Outline

| Token | Nilai | Peran |
|---|---|---|
| `--color-border` | `#e2e8f0` | Border kartu. |
| `--color-border-input` | `#cbd5e1` | Border input. |
| `--color-outline` | `#76777d` | Outline (ikon chevron, dsb). |
| `--color-outline-variant` | `#c6c6cd` | Outline variant. |

### Fungsional

| Token | Nilai | Peran |
|---|---|---|
| `--color-error` | `#ba1a1a` | Error / logout. |
| `--color-error-container` | `#ffdad6` | Latar error ringan. |
| `--color-on-error-container` | `#93000a` | Teks di dalam error-container. |
| `--color-success` | `#22c55e` | Feedback positif. |

## Tipografi

- **Body/Heading:** Inter (`--font-sans`).
- Skala bobot: **400** (body), **600** (label/button), **700** (heading/CTA).
- Headsif besar mengecil di layar kecil untuk menghindari baris terlalu panjang (mobile-first).

## Shape (Radius)

- **--radius-md / lg** = `8px` — komponen standar (kartu, tombol, input).
- **--radius-xl** = `12px` — hero/banner besar.
- **--radius-2xl** = `16px` — kontainer besar/modal.
- **pill (rounded-full)** — tag status ("Baru", "Sale", badge qty).

## Spacing

Skala berbasis **8px** (kelipatan `--spacing` bawaan Tailwind: `4`→`p-4`=16px, `2`→`gap-2`=8px, dst).
Margin halaman mobile `px-4` (16px), desktop `px-8` (32px).

## Komponen & Aturan Visual

- **Tombol utama:** latar `accent`, teks putih, radius `rounded-lg`, hover `opacity-90`.
- **Tombol sekunder:** latar `surface`, border `primary`, teks `primary`.
- **Kartu produk:** background `surface`, border `border`, karakter persegi image, radius `rounded-lg`,
  elevasi hanya saat hover (shadow halus).
- **Input:** radius `rounded-lg`, border `border-input`, padding `p-4`; saat fokus border jadi `primary` + glow ring.
- **Navigasi bawah (mobile):** item aktif memakai pill `accent-soft` + ikon `accent`; badge qty `accent-container`.
- **Adapatif:** mobile-first. Bagian navigasi bawah **hilang** di `md:` ke atas; grid & kolom berubah responsif.

Komponen yang dipakai ulang: `TopApp` (header), `BottomNav` (nav bawah), `ProductCard` (kartu produk).