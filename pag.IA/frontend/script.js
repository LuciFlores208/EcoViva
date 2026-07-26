const inputPergunta = document.getElementById('pergunta');
const btnEnviar = document.getElementById('enviar');
const areaResposta = document.getElementById('resposta');

async function enviarPergunta() {
    const pergunta = inputPergunta.value.trim();

    if (!pergunta) {
        areaResposta.innerHTML = '<span class="erro">❌ Por favor, digite uma pergunta.</span>';
        return;
    }

    btnEnviar.disabled = true;
    areaResposta.innerHTML = '<span class="loading">⏳ Pensando...</span>';

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pergunta }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro desconhecido');
        }

        areaResposta.innerHTML = data.resposta;
    } catch (error) {
        areaResposta.innerHTML = `<span class="erro">❌ Erro: ${error.message}</span>`;
        console.error('Erro no chat:', error);
    } finally {
        btnEnviar.disabled = false;
        inputPergunta.value = '';
        inputPergunta.focus();
    }
}

btnEnviar.addEventListener('click', enviarPergunta);

inputPergunta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarPergunta();
    }
});