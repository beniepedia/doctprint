export const BRAND = 'DoctPrint'

export const categories = [
  { id: 'printer', label: 'Printer', icon: 'print' },
  { id: 'tinta', label: 'Tinta & Toner', icon: 'ink_pen' },
  { id: 'kertas', label: 'Kertas', icon: 'description' },
  { id: 'aksesori', label: 'Aksesori', icon: 'mouse' },
]

export const profileMenu = [
  { label: 'Pesanan Saya', icon: 'receipt_long' },
  { label: 'Metode Pembayaran', icon: 'credit_card' },
  { label: 'Alamat Pengiriman', icon: 'location_on' },
  { label: 'Keamanan & Sandi', icon: 'lock' },
  { label: 'Pengaturan Notifikasi', icon: 'notifications' },
  { label: 'Pusat Bantuan', icon: 'help' },
]

export const heroSlides = [
  {
    eyebrow: 'Promo Spesial',
    title: 'Diskon Alat Kantor 20%',
    desc: 'Printer, tinta, toner, kertas, dan aksesori kantor dengan harga bersahabat.',
    cta: 'Pesan Sekarang',
    href: '#/cart',
    bg: 'linear-gradient(120deg, #0f172a 0%, #1e293b 50%, #f97316 125%)',
  },
  {
    eyebrow: 'Koleksi Printer',
    title: 'Printer Terbaik untuk Kantor Anda',
    desc: 'EcoTank hemat tinta, PIXMA serbaguna, hingga kebutuhan cetak harian lainnya.',
    cta: 'Lihat Produk',
    href: '#/product?id=printer-ecotank-l3110',
    bg: 'linear-gradient(120deg, #f97316 0%, #fd761a 55%, #ea580c 110%)',
  },
  {
    eyebrow: 'Tinta & Toner Original',
    title: 'Hasil Cetak Selalu Tajam',
    desc: 'Cartridge dan toner original untuk performa terbaik setiap printer Anda.',
    cta: 'Belanja Sekarang',
    href: '#/product?id=toner-hp-85a',
    bg: 'linear-gradient(120deg, #131b2e 0%, #0f172a 100%)',
  },
]

export const shippingOptions = [
  { id: 'standard', label: 'Pengiriman Standar', desc: '3-5 Hari Kerja', price: 0 },
  { id: 'express', label: 'Pengiriman Ekspres', desc: '1-2 Hari Kerja', price: 15000 },
]

export const provinces = ['Jawa Barat', 'DKI Jakarta', 'Jawa Timur']

export const user = {
  name: 'Budi Santoso',
  email: 'budi.santoso@email.com',
  stats: [
    { icon: 'local_shipping', value: '2', label: 'Pesanan Aktif' },
    { icon: 'favorite', value: '14', label: 'Wishlist' },
    { icon: 'confirmation_number', value: '5', label: 'Kupon' },
  ],
}
