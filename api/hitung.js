// hitung.js

// Fungsi untuk menghitung Mean
function hitungMean(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
}

// Fungsi untuk menghitung Median
function hitungMedian(arr) {
    const sortedArr = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 === 0) {
        return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    } else {
        return sortedArr[mid];
    }
}

// Fungsi untuk menghitung Modus
function hitungModus(arr) {
    const counts = {};
    arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    let modus = null;
    let maxCount = 0;
    for (const num in counts) {
        if (counts[num] > maxCount) {
            maxCount = counts[num];
            modus = Number(num);
        }
    }
    return modus;
}

// Handler utama yang akan dijalankan oleh Vercel
module.exports = (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { data } = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0 || data.some(isNaN)) {
        res.status(400).json({ error: 'Data tidak valid. Mohon kirimkan array angka.' });
        return;
    }

    const mean = hitungMean(data);
    const median = hitungMedian(data);
    const modus = hitungModus(data);

    res.status(200).json({
        mean: mean.toFixed(2),
        median: median,
        mode: modus
    });
};