// api/chat.js

const { GoogleGenAI } = require("@google/genai");

module.exports = async (req, res) => {
    // Pastikan metode POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        // Ambil API key dari Environment Variable Vercel
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key is not set." });
        }
        
        const ai = new GoogleGenAI({ apiKey });

        // Perbaikan: Menggunakan models.generateContent dengan sintaks baru
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        // Tambahkan instruksi persona "Mat Assistant" ke prompt
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Anda adalah Mat Assistant, asisten AI yang ramah dan siap membantu. Jawab pertanyaan dengan singkat, jelas, dan selalu gunakan bahasa Indonesia.
                ---
                Pertanyaan: ${prompt}
            `
        });
        
        const text = response.text;

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to get response from Mat Assistant." });
    }
};