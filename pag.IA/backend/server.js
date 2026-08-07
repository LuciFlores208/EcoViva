// server.js - EcoViva Chat com Capy 🐹
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// ===== CHAVE DE API =====
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ ERRO: API_KEY não encontrada no arquivo .env');
    console.log('💡 Crie um arquivo .env com: API_KEY=sua_chave_aqui');
    process.exit(1);
}

// ===== INICIALIZA O GEMINI =====
const genAI = new GoogleGenerativeAI(apiKey);

// ===== ROTA DE TESTE =====
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        message: '🐹 Capy está pronta para ajudar!',
        timestamp: new Date().toISOString()
    });
});

// ===== ROTA PRINCIPAL DO CHAT =====
app.post('/api/chat', async (req, res) => {
    const { pergunta } = req.body;

    // Validação
    if (!pergunta || pergunta.trim() === '') {
        return res.status(400).json({ 
            erro: 'Por favor, digite uma pergunta válida.' 
        });
    }

    try {
        // 👇 CONTEXTO DA CAPY (personalidade)
        const contexto = `Você é a Capy, uma capivara muito simpática e inteligente que trabalha no projeto EcoViva. 
        Você é especialista em sustentabilidade, meio ambiente, ecologia, preservação da natureza e mudanças climáticas.
        
        CARACTERÍSTICAS:
        - Fale de forma carinhosa e divertida, como uma capivara amigável
        - Use emojis 🐹🌿🌍 para tornar a conversa mais leve
        - Sempre comece com um cumprimento amigável
        - Dê respostas educativas e informativas
        - Ofereça dicas práticas de sustentabilidade quando possível
        - Seja positiva e encorajadora
        - Responda em português brasileiro
        
        REGRAS:
        1. Mantenha o foco em sustentabilidade e meio ambiente
        2. Se perguntarem sobre algo fora do tema, redirecione educadamente para sustentabilidade
        3. Use exemplos práticos do dia a dia
        4. Incentive ações positivas para o planeta
        
        Pergunta do usuário: ${pergunta}`;

        // 👇 GEMINI 2.0 FLASH
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash', // ✅ MODELO GEMINI 2.0
            generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });

        // Gera a resposta
        const result = await model.generateContent(contexto);
        const response = await result.response;
        const texto = response.text();
        
        // Formata a resposta com quebras de linha
        const respostaFormatada = texto.replace(/\n/g, '<br>');

        res.json({ 
            resposta: respostaFormatada,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro na API Gemini:', error);
        
        // 👇 TRATAMENTO DE ERROS AMIGÁVEL
        let mensagemErro = 'Desculpe, tive um probleminha técnico! 😅 Tente novamente.';
        
        if (error.message.includes('API_KEY')) {
            mensagemErro = '❌ Erro de configuração: Chave API inválida. Verifique o arquivo .env';
        } else if (error.message.includes('quota') || error.message.includes('429')) {
            mensagemErro = '🔄 Atingi meu limite de respostas hoje! Volte amanhã para mais conversas 🌱';
        } else if (error.message.includes('model') || error.status === 404) {
            mensagemErro = '🤖 Modelo temporariamente indisponível. Tente novamente em alguns instantes.';
        } else if (error.message.includes('permission')) {
            mensagemErro = '🔒 Permissão negada. Verifique se a API Generative Language está ativada no Google Cloud.';
        }

        res.status(500).json({ 
            erro: mensagemErro,
            detalhe: error.message 
        });
    }
});

// ===== ROTA 404 =====
app.use((req, res) => {
    res.status(404).json({ 
        erro: 'Rota não encontrada. Use /api/chat para enviar mensagens.' 
    });
});

// ===== INICIA O SERVIDOR =====
app.listen(PORT, () => {
    console.log('\n🐹 ==================================');
    console.log('  EcoViva - Capy está online!');
    console.log('==================================');
    console.log(`📍 Servidor: http://localhost:${PORT}`);
    console.log(`💬 Chat: http://localhost:${PORT}`);
    console.log(`📡 Health: http://localhost:${PORT}/api/health`);
    console.log('==================================\n');
});