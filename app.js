// app.js

// Fungsi untuk mengupdate jam setiap detik
function updateClock() {
    const dateElement = document.getElementById('date-display');
    const timeElement = document.getElementById('time-display');
    const now = new Date();
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const formattedDate = now.toLocaleDateString('id-ID', dateOptions);
    const formattedTime = now.toLocaleTimeString('id-ID', timeOptions);
    
    dateElement.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formattedDate}`;
    timeElement.innerHTML = `<i class="fas fa-clock"></i> ${formattedTime}`;
}
setInterval(updateClock, 1000);
updateClock();

// Fungsi untuk menampilkan tampilan kalkulator
function showCalculator() {
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('calculator-screen').style.display = 'block';
}

// Fungsi untuk kembali ke tampilan dashboard
function showDashboard() {
    document.getElementById('calculator-screen').style.display = 'none';
    document.getElementById('dashboard-screen').style.display = 'block';
}

// Fungsi untuk menghasilkan teks langkah-langkah perhitungan
function generateCaraPengerjaan(angkaArray) {
    let caraPengerjaan = '<h2><i class="fas fa-stream"></i> Cara Pengerjaan</h2>';

    // --- Rata-rata ---
    const sum = angkaArray.reduce((acc, curr) => acc + curr, 0);
    const unroundedMean = sum / angkaArray.length;
    const roundedMean = unroundedMean.toFixed(2);
    caraPengerjaan += `
        <h3><i class="fas fa-equals"></i> Rata-rata (Mean)</h3>
        <p>Penjumlahan: ${angkaArray.join(' + ')} = ${sum}</p>
        <p>Pembagian: ${sum} / ${angkaArray.length} = ${unroundedMean} (dibulatkan menjadi ${roundedMean})</p>
    `;

    // --- Median ---
    const sortedArr = [...angkaArray].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    const median = sortedArr.length % 2 === 0 ? (sortedArr[mid - 1] + sortedArr[mid]) / 2 : sortedArr[mid];
    caraPengerjaan += `
        <h3><i class="fas fa-balance-scale"></i> Median</h3>
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
        <h3><i class="fas fa-chart-bar"></i> Modus</h3>
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
        hasilDiv.innerHTML = '<p id="error-message"><i class="fas fa-exclamation-triangle"></i> Mohon masukkan angka yang valid.</p>';
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
            <h2><i class="fas fa-check-circle"></i> Hasil Akhir</h2>
            <div class="result-item">
                <i class="fas fa-equals icon"></i>
                <p>Rata-rata (Mean): <strong>${hasil.mean}</strong></p>
            </div>
            <div class="result-item">
                <i class="fas fa-balance-scale icon"></i>
                <p>Median: <strong>${hasil.median}</strong></p>
            </div>
            <div class="result-item">
                <i class="fas fa-chart-bar icon"></i>
                <p>Modus: <strong>${modusDisplay}</strong></p>
            </div>
        `;
        
        const caraPengerjaan = generateCaraPengerjaan(angkaArray);
        hasilDiv.innerHTML = hasilAkhir + caraPengerjaan;

    } catch (error) {
        hasilDiv.innerHTML = '<p id="error-message"><i class="fas fa-exclamation-triangle"></i> Terjadi kesalahan saat berkomunikasi dengan server.</p>';
        console.error('Error:', error);
    }
}