# Marketing Swarm AI 🚀

**Bot AI untuk Generasi Konten Pemasaran (Proyek AI Hackathon)**

---

## 📝 Gambaran Umum

**Marketing Swarm AI** adalah sebuah sistem cerdas yang dirancang untuk mengotomatisasi dan mempercepat proses pembuatan konten pemasaran. Proyek ini dibangun sebagai bagian dari sebuah AI Hackathon untuk menunjukkan bagaimana sekelompok "agen" AI dapat bekerja sama untuk menghasilkan konten berkualitas tinggi, mulai dari tulisan untuk media sosial hingga artikel blog lengkap.

Aplikasi ini dapat dijalankan dalam dua mode:
1.  **Mode CLI Interaktif**: Pengguna dapat memberikan perintah langsung melalui terminal untuk meminta pembuatan konten.
2.  **Mode Server/API**: Berjalan sebagai *background service* yang siap menerima permintaan pembuatan konten dari platform lain seperti [n8n](https://n8n.io/), Zapier, atau aplikasi custom lainnya.

## ✨ Fitur Utama

- **Generasi Konten Multi-Platform**: Mampu membuat konten yang disesuaikan untuk berbagai platform seperti Instagram, Facebook, dan blog.
- **Pemrosesan Bahasa Alami (NLP)**: Menggunakan parser sederhana untuk memahami perintah dalam bahasa natural.
- **Arsitektur Berbasis Agen**:
    - `ContentGeneratorAgent`: Bertugas untuk menghasilkan teks/copywriting.
    - `ImageGeneratorAgent`: Bertugas untuk membuat gambar (fitur dalam pengembangan).
    - `PostReceiverAgent`: Berfungsi sebagai *endpoint* API untuk menerima tugas dari sistem eksternal.
- **Integrasi Mudah**: Dirancang untuk dapat diintegrasikan dengan *workflow automation tools* seperti n8n.
- **CLI Interaktif**: Dilengkapi dengan antarmuka baris perintah (CLI) untuk kemudahan pengujian dan penggunaan langsung.

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Bahasa**: Node.js
- **Framework AI**: LangChain.js
- **Model Bahasa (LLM)**: Menggunakan Fireworks AI (misalnya, model Llama).
- **Dependensi Utama**:
    - `@langchain/openai` & `@langchain/community` untuk interaksi dengan LLM.
    - `readline` untuk antarmuka CLI.

## 🏗️ Arsitektur

Proyek ini terdiri dari beberapa komponen utama:

1.  **`index.js` (Entry Point)**: Menginisialisasi `AIContentBot` dan menjalankan mode CLI interaktif serta `PostReceiverAgent`.
2.  **`AIContentBot` Class**: Kelas utama yang mengelola logika aplikasi, memproses perintah, dan berinteraksi dengan pengguna.
3.  **`ContentService`**: Layanan yang menjadi jembatan antara bot dan agen-agen AI, mengorkestrasi tugas pembuatan konten.
4.  **Agents**:
    - **`ContentGeneratorAgent`**: Memanggil LLM (Fireworks AI) melalui LangChain untuk menghasilkan teks berdasarkan topik dan platform yang diberikan.
    - **`PostReceiverAgent`**: Menjalankan server HTTP kecil untuk mendengarkan *webhook* atau panggilan API, memungkinkan integrasi dengan layanan pihak ketiga.

## 🚀 Panduan Memulai

### 1. Prasyarat

- Node.js (v18 atau lebih baru direkomendasikan).
- NPM atau Yarn.
- API Key dari Fireworks AI.

### 2. Instalasi

Clone repositori ini dan install semua dependensi yang dibutuhkan.

```bash
git clone <URL_REPOSITORI_ANDA>
cd marketing_swarm_api
npm install
```

### 3. Konfigurasi

Buat file `.env` di direktori root proyek dan tambahkan API key Anda.

```.env
FIREWORKS_API_KEY="YOUR_FIREWORKS_AI_API_KEY"
```

### 4. Menjalankan Aplikasi

Untuk menjalankan bot dalam mode CLI interaktif dan sekaligus mengaktifkan API receiver, jalankan perintah berikut:

```bash
node ai-generate-content/src/index.js
```

Anda akan melihat pesan selamat datang dan siap memberikan perintah.

##  usage Penggunaan

### Mode CLI Interaktif

Setelah aplikasi berjalan, Anda bisa langsung mengetikkan perintah di terminal.

**Contoh Perintah:**
```
🤖 Apa yang bisa saya bantu? buat konten instagram tentang kopi
```
```
🤖 Apa yang bisa saya bantu? buat artikel blog tentang manfaat teh hijau
```
```
🤖 Apa yang bisa saya bantu? exit
```

### Mode API (Integrasi n8n)

`PostReceiverAgent` akan berjalan di port tertentu (misalnya 3000) dan siap menerima permintaan `POST`. Anda dapat mengonfigurasi n8n untuk mengirim HTTP POST Request ke endpoint ini dengan body JSON yang berisi detail tugas.

