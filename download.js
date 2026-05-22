document.addEventListener('DOMContentLoaded', () => {
    // Definisi Elemen DOM
    const generateBtn = document.getElementById('generate-btn');
    const urlInput = document.getElementById('youtube-url');
    const inputContainer = document.getElementById('input-container');
    const loadingContainer = document.getElementById('loading-container');
    const resultContainer = document.getElementById('result-container');
    const downloadOptions = document.getElementById('download-options');
    const resetBtn = document.getElementById('reset-btn');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');

    // URL Vercel Python API Anda
    const API_URL = 'https://project-7oswp.vercel.app/api';

    // Aksi ketika tombol "Generate" diklik
    generateBtn.addEventListener('click', async () => {
        const urlValue = urlInput.value.trim();
        
        if (!urlValue) {
            alert('Silakan masukkan URL YouTube terlebih dahulu!');
            return;
        }

        // Sembunyikan Input, Tampilkan Loading
        inputContainer.classList.add('hidden');
        loadingContainer.classList.remove('hidden');

        try {
            // Tembak API Python di Vercel
            const response = await fetch(`${API_URL}?url=${encodeURIComponent(urlValue)}`);
            const data = await response.json();

            if (data.success) {
                // Sembunyikan Loading, Tampilkan Hasil
                loadingContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');

                // Isi Metadata Video
                videoThumbnail.src = data.thumbnail;
                videoTitle.textContent = data.title;

                // Kosongkan container tombol sebelum diisi ulang
                downloadOptions.innerHTML = '';

                // Buat tombol download dinamis berdasarkan respons API
                data.formats.forEach(format => {
                    const btn = document.createElement('button');
                    btn.className = 'download-btn';
                    btn.textContent = `Download ${format.label}`;
                    
                    // Aksi ketika tombol download format diklik
                    btn.addEventListener('click', () => {
                        // Buka link proxy download di tab/jendela tersembunyi
                        window.location.href = format.url;
                        
                        // Jeda 3 detik agar download jalan, lalu refresh halaman
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    });

                    downloadOptions.appendChild(btn);
                });
            } else {
                throw new Error(data.error || 'Terjadi kesalahan pada server.');
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
            // Jika error, kembalikan tampilan ke awal
            loadingContainer.classList.add('hidden');
            inputContainer.classList.remove('hidden');
        }
    });

    // Aksi ketika tombol "Generate Ulang" diklik
    resetBtn.addEventListener('click', () => {
        // Langsung refresh halaman untuk kembali ke state awal
        window.location.reload();
    });
});
