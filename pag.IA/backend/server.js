require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
    const { pergunta } = req.body;

    if (!pergunta || pergunta.trim() === '') {
        return res.status(400).json({ erro: 'Digite uma pergunta válida.' });
    }

    try {
        const response = await ai.models.generateContent({
            model:'gemini-2.0-flash',
            contents: [{ role: 'user', parts: [{ text: pergunta }] }],
        });

        const resposta = response.candidates?.[0]?.content?.parts?.[0]?.text ||
                         'Desculpe, não consegui gerar uma resposta.';
        res.json({ resposta });
    } catch (error) {
        console.error('Erro na API Gemini:', error);
        res.status(500).json({ erro: 'Erro ao processar sua pergunta.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});