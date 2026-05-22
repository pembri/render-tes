document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const urlInput = document.getElementById('youtube-url');
    const inputContainer = document.getElementById('input-container');
    const loadingContainer = document.getElementById('loading-container');
    const resultContainer = document.getElementById('result-container');
    const downloadOptions = document.getElementById('download-options');
    const resetBtn = document.getElementById('reset-btn');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitle = document.getElementById('video-title');

    const API_URL = 'https://python-varcel.vercel.app/api';

    async function pollProgress(progressUrl, title, baseApiUrl) {
        const maxAttempts = 60;
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise(r => setTimeout(r, 2000));
            try {
                const encoded = encodeURIComponent(progressUrl);
                const resp = await fetch(`${API_URL}?action=progress&url=${encoded}`);
                const data = await resp.json();

                // Cek berbagai kemungkinan field download URL
                const downloadUrl = data.download_url || data.url || data.result || data.link;
                if (downloadUrl) {
                    return downloadUrl;
                }
                // Kalau error stop
                if (data.status === 'failed' || data.error) {
                    return null;
                }
            } catch (e) {
                // lanjut coba lagi
            }
        }
        return null;
    }

    generateBtn.addEventListener('click', async () => {
        const urlValue = urlInput.value.trim();
        if (!urlValue) {
            alert('Silakan masukkan URL YouTube terlebih dahulu!');
            return;
        }

        inputContainer.classList.add('hidden');
        loadingContainer.classList.remove('hidden');

        try {
            const response = await fetch(`${API_URL}?url=${encodeURIComponent(urlValue)}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Terjadi kesalahan pada server.');
            }

            // Tampilkan info video dulu
            videoThumbnail.src = data.thumbnail;
            videoTitle.textContent = data.title;

            // Poll progress URL sampai dapat download link
            const finalUrl = await pollProgress(data.progress_url, data.title, data.base_api_url);

            if (!finalUrl) {
                throw new Error('Timeout memproses audio. Coba lagi.');
            }

            // Sembunyikan loading, tampilkan hasil
            loadingContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');

            downloadOptions.innerHTML = '';

            const formats = [
                { ext: 'mp3', label: 'MP3 (Audio Populer)' },
                { ext: 'm4a', label: 'M4A (Original AAC)' },
                { ext: 'wav', label: 'WAV (Kualitas Tinggi)' },
            ];

            formats.forEach(format => {
                const btn = document.createElement('button');
                btn.className = 'download-btn';
                btn.textContent = `Download ${format.label}`;
                btn.addEventListener('click', () => {
                    const encodedTitle = encodeURIComponent(data.title);
                    const encodedUrl = encodeURIComponent(finalUrl);
                    const dlLink = `${data.base_api_url}?action=download&ext=${format.ext}&title=${encodedTitle}&url=${encodedUrl}`;
                    window.location.href = dlLink;
                    setTimeout(() => { window.location.reload(); }, 3000);
                });
                downloadOptions.appendChild(btn);
            });

        } catch (error) {
            alert(`Error: ${error.message}`);
            loadingContainer.classList.add('hidden');
            inputContainer.classList.remove('hidden');
        }
    });

    resetBtn.addEventListener('click', () => {
        window.location.reload();
    });
});
