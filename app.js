// app.js

// Fungsi untuk menghasilkan teks langkah-langkah perhitungan
function generateCaraPengerjaan(angkaArray) {
    let caraPengerjaan = '<h2>Cara Pengerjaan</h2>';

    // --- Rata-rata ---
    const sum = angkaArray.reduce((acc, curr) => acc + curr, 0);
    const unroundedMean = sum / angkaArray.length;
    const roundedMean = unroundedMean.toFixed(2);

    caraPengerjaan += `
        <h3>1. Rata-rata (Mean)</h3>
        <p>Penjumlahan: ${angkaArray.join(' + ')} = ${sum}</p>
        <p>Pembagian: ${sum} / ${angkaArray.length} = ${unroundedMean} (dibulatkan menjadi ${roundedMean})</p>
    `;

    // --- Median ---
    const sortedArr = [...angkaArray].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    const median = sortedArr.length % 2 === 0 ? (sortedArr[mid - 1] + sortedArr[mid]) / 2 : sortedArr[mid];
    caraPengerjaan += `
        <h3>2. Median</h3>
        <p>Urutkan data: ${sortedArr.join(', ')}</p>
        <p>Nilai tengah: <strong>${median}</strong></p>
    `;

    // --- Modus ---
    const counts = {};
    sortedArr.forEach(num => counts[num] = (counts[num] || 0) + 1);
    
    let maxCount = 0;
    for (const num in counts) {
        if (counts[num] > maxCount) {
            maxCount = counts[num];
        }
    }
    
    const modus = [];
    for (const num in counts) {
        if (counts[num] === maxCount) {
            modus.push(Number(num));
        }
    }
    
    const modusDisplay = modus.length === Object.keys(counts).length && modus.length > 1 
        ? 'Tidak ada modus' 
        : modus.join(', ');

    caraPengerjaan += `
        <h3>3. Modus</h3>
        <p>Frekuensi setiap angka:</p>
        <ul>
            ${Object.keys(counts).map(num => `<li>Angka ${num}: ${counts[num]} kali</li>`).join('')}
        </ul>
        <p>Angka dengan frekuensi terbanyak adalah <strong>${modusDisplay}</strong>.</p>
    `;

    return caraPengerjaan;
}

// Fungsi utama yang dipanggil saat tombol "Hitung" diklik
async function hitungStatistik() {
    const dataInput = document.getElementById('dataInput').value;
    const hasilDiv = document.getElementById('hasil');

    hasilDiv.innerHTML = '';

    const angkaArray = dataInput
        .split(/[ ,]+/)
        .filter(n => n)
        .map(Number);

    if (angkaArray.some(isNaN) || angkaArray.length === 0) {
        hasilDiv.innerHTML = '<p style="color: red;">Mohon masukkan angka yang valid.</p>';
        return;
    }

    try {
        const response = await fetch('/api/hitung', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: angkaArray })
        });

        if (!response.ok) {
            throw new Error('Terjadi kesalahan pada server.');
        }

        const hasil = await response.json();
        
        const modusDisplay = Array.isArray(hasil.mode) ? hasil.mode.join(', ') : hasil.mode;

        let hasilAkhir = `
            <h2>Hasil:</h2>
            <p>Rata-rata (Mean): <strong>${hasil.mean}</strong></p>
            <p>Median: <strong>${hasil.median}</strong></p>
            <p>Modus: <strong>${modusDisplay}</strong></p>
        `;
        
        const caraPengerjaan = generateCaraPengerjaan(angkaArray);
        hasilDiv.innerHTML = hasilAkhir + caraPengerjaan;

    } catch (error) {
        hasilDiv.innerHTML = '<p style="color: red;">Terjadi kesalahan saat berkomunikasi dengan server.</p>';
        console.error('Error:', error);
    }
}