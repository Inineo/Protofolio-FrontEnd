# Figriaone — Personal Portfolio & Showcase

Portofolio digital interaktif bertema retro-futuristik / cyberpunk-minimalis untuk **Figriaone (Digital Craftsman)**. Proyek ini dibangun dengan fokus pada performa, estetika visual modern (scanline, custom cursor, terminal visual, layout responsif), serta terintegrasi dengan backend Neonly API untuk manajemen proyek dan EmailJS untuk form kontak langsung.

---

## 🌟 Fitur Utama

- **Interactive UI & Motion Effects**:
  - Custom fluid cursor & trail effect.
  - Scanline overlay & visual terminal retro.
  - Smooth scroll & section highlight navigation.
  - Micro-animations dan transisi interaktif.
- **Dynamic Projects Gallery (`all-projects.html`)**:
  - Filter kategori proyek secara dinamis.
  - Kartu proyek dengan mockup visual responsif (phone, desktop, branding) atau custom cover.
  - Pagination / Load More proyek.
- **Detailed Project Showcase (`project-detail.html`)**:
  - Tampilan mendalam mencakup *Overview*, *Problem Statement*, *Design Process*, *Results & Impact*, hingga *Reflection*.
  - Showcase grid & sidebar informasi teknis, tools, dan metadata.
  - Navigasi Previous/Next project dinamis.
- **Contact Form Terintegrasi**:
  - Mengirim email langsung dari sisi client menggunakan **EmailJS**.
  - Dilengkapi feedback visual status pengiriman (sukses/gagal).
- **Admin & CMS Ready (`/neonly`)**:
  - Panel admin untuk manajemen konten proyek (CRUD, upload gambar, status publikasi).

---

## 📁 Struktur Direktori

```text
├── index.html              # Halaman beranda utama (Splash, Hero, About, Services, Portfolio, Contact)
├── all-projects.html       # Katalog semua proyek dengan fitur filter dan pagination
├── project-detail.html     # Halaman rincian detail masing-masing proyek
├── css/
│   ├── style.css           # Styling utama halaman index & komponen global
│   ├── projects.css        # Styling halaman All Projects
│   └── detail.css          # Styling halaman Project Detail
├── js/
│   ├── script.js           # Logika interaksi halaman beranda & EmailJS handler
│   ├── projects.js         # Logika filter katalog, cursor, dan fetching proyek
│   ├── detail.js           # Dynamic loader konten detail proyek berdasarkan ID query string
│   ├── config.example.js   # Template konfigurasi EmailJS
│   └── config.js           # (Local only) Konfigurasi kredensial EmailJS
└── images/                 # Asset gambar profil, mockup, dan ikon
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5 Semantik, Vanilla CSS3 (Custom Properties / Variables, Grid, Flexbox), Vanilla JavaScript (ES6+ Modules & Async/Await).
- **Tipografi & Ikon**: Google Fonts (*Poppins*, *Share Tech Mono*).
- **Integrasi Pihak Ketiga**:
  - [EmailJS Browser SDK](https://www.emailjs.com/) untuk pengiriman pesan formulir kontak.
- **Backend API**: REST API berbasis PHP & MySQL (`/neonly/api/`).

---

## 🚀 Setup & Instalasi Lokal

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Inineo/Protofolio-FrontEnd.git
   cd Protofolio-FrontEnd
   ```

2. **Konfigurasi EmailJS (Form Kontak)**:
   - Duplikasi file `js/config.example.js` menjadi `js/config.js`:
     ```bash
     cp js/config.example.js js/config.js
     ```
   - Buka `js/config.js` dan sesuaikan kredensial EmailJS Anda:
     ```javascript
     const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
     const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
     const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
     ```
   *(Catatan: `js/config.js` sudah dimasukkan ke dalam `.gitignore` agar kredensial pribadi tidak terunggah ke repositori publik).*

3. **Menjalankan Project**:
   - Anda dapat menjalankan file langsung dengan membuka `index.html` di browser, atau menggunakan local development server seperti **Live Server** (VS Code) atau melalui lingkungan XAMPP / WampServer.

---

## 📄 Lisensi & Hak Cipta

© 2025–2026 **Figriaone**. Seluruh hak cipta dilindungi undang-undang.
Dibuat dengan dedikasi dan perhatian terhadap setiap detail piksel.
