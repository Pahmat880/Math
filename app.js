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

        hasilDiv.innerHTML = `
            <h2>Hasil:</h2>
            <p>Rata-rata (Mean): <strong>${hasil.mean}</strong></p>
            <p>Median: <strong>${hasil.median}</strong></p>
            <p>Modus: <strong>${hasil.mode}</strong></p>
        `;
    } catch (error) {
        hasilDiv.innerHTML = '<p style="color: red;">Terjadi kesalahan saat berkomunikasi dengan server.</p>';
        console.error('Error:', error);
    }
}