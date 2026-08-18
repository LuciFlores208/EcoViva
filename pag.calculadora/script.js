document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    
    // Fatores de emissão (em kg CO₂ por unidade)
    const fatores = {
        carro: 0.21,        // kg CO₂ por km
        onibus: 0.09,       // kg CO₂ por km
        aviao: 60,          // kg CO₂ por hora
        energia: 0.45,      // kg CO₂ por kWh
        carne: 5,           // kg CO₂ por refeição
        vegetariano: 1.5,   // kg CO₂ por refeição
        roupa: 30,          // kg CO₂ por compra
        eletronico: 150     // kg CO₂ por compra
    };

    calculateBtn.addEventListener('click', calcularPegada);

    function calcularPegada() {
        // Pegar valores dos inputs
        const carKm = parseFloat(document.getElementById('carKm').value) || 0;
        const busKm = parseFloat(document.getElementById('busKm').value) || 0;
        const flightHr = parseFloat(document.getElementById('flightHr').value) || 0;
        const energyKwh = parseFloat(document.getElementById('energyKwh').value) || 0;
        const meatMeals = parseFloat(document.getElementById('meatMeals').value) || 0;
        const vegetarianMeals = parseFloat(document.getElementById('vegetarianMeals').value) || 0;
        const clothesPurchases = parseFloat(document.getElementById('clothesPurchases').value) || 0;
        const electronicsPurchases = parseFloat(document.getElementById('electronicsPurchases').value) || 0;

        // Calcular emissões mensais
        const transporte = (carKm * fatores.carro) + 
                          (busKm * fatores.onibus) + 
                          (flightHr * fatores.aviao);
        
        const energia = energyKwh * fatores.energia;
        
        // Alimentação (semanal para mensal: * 4.33 semanas por mês)
        const semanasMes = 4.33;
        const alimentacao = (meatMeals * fatores.carne + vegetarianMeals * fatores.vegetariano) * semanasMes;
        
        // Consumo (roupas mensal, eletrônicos anual convertido para mensal)
        const consumo = (clothesPurchases * fatores.roupa) + (electronicsPurchases * fatores.eletronico / 12);

        // Total mensal
        const totalMensal = transporte + energia + alimentacao + consumo;
        const totalAnual = totalMensal * 12;

        // Calcular árvores necessárias (média: 20 kg CO₂ por árvore por ano)
        const arvoresNecessarias = Math.ceil(totalAnual / 20);

        // Determinar impacto
        let impacto = '';
        let mensagemImpacto = '';
        if (totalMensal < 200) {
            impacto = 'Baixo';
            mensagemImpacto = '🌱 Excelente! Sua pegada de carbono é muito baixa. Continue assim!';
        } else if (totalMensal < 500) {
            impacto = 'Médio';
            mensagemImpacto = '🌿 Sua pegada de carbono está na média. Você pode melhorar com pequenas mudanças!';
        } else if (totalMensal < 1000) {
            impacto = 'Alto';
            mensagemImpacto = '🌳 Sua pegada de carbono é alta. Considere fazer mudanças significativas!';
        } else {
            impacto = 'Muito Alto';
            mensagemImpacto = '🌲 Sua pegada de carbono é muito alta. É urgente reduzir seu impacto ambiental!';
        }

        // Mostrar resultados
        document.getElementById('totalMensal').textContent = totalMensal.toFixed(1);
        document.getElementById('totalAnual').textContent = totalAnual.toFixed(1);
        document.getElementById('arvoresNecessarias').textContent = arvoresNecessarias;
        document.getElementById('impacto').textContent = impacto;
        
        // Adicionar classe para cor do impacto
        const impactoElement = document.getElementById('impacto');
        impactoElement.className = '';
        if (totalMensal < 200) {
            impactoElement.classList.add('impacto-baixo');
        } else if (totalMensal < 500) {
            impactoElement.classList.add('impacto-medio');
        } else {
            impactoElement.classList.add('impacto-alto');
        }

        // Mostrar recomendações personalizadas
        mostrarRecomendacoes(transporte, energia, alimentacao, consumo);

        // Mostrar div de resultados
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function mostrarRecomendacoes(transporte, energia, alimentacao, consumo) {
        const recomendacoesDiv = document.getElementById('recomendacoes');
        let recomendacoes = [];

        // Análise por categoria
        const total = transporte + energia + alimentacao + consumo;
        
        if (total > 0) {
            const percTransporte = (transporte / total * 100).toFixed(0);
            const percEnergia = (energia / total * 100).toFixed(0);
            const percAlimentacao = (alimentacao / total * 100).toFixed(0);
            const percConsumo = (consumo / total * 100).toFixed(0);

            let recomendacoesHtml = `<h3>💡 Recomendações Personalizadas</h3><ul>`;

            // Recomendações baseadas nas porcentagens
            if (percTransporte > 30) {
                recomendacoes.push('🚲 Considere usar mais transporte público, bicicleta ou caminhar para reduzir emissões do transporte.');
            }
            if (percEnergia > 30) {
                recomendacoes.push('💡 Reduza o consumo de energia: apague luzes, use lâmpadas LED e eletrodomésticos eficientes.');
            }
            if (percAlimentacao > 30) {
                recomendacoes.push('🥗 Reduza o consumo de carne e aumente refeições vegetarianas para diminuir sua pegada alimentar.');
            }
            if (percConsumo > 20) {
                recomendacoes.push('🛍️ Reduza o consumo desnecessário: compre apenas o necessário e opte por produtos duráveis.');
            }

            // Recomendações adicionais
            if (transporte > 0) {
                recomendacoes.push('🚗 Considere caronas solidárias ou veículos elétricos para reduzir emissões.');
            }
            if (energia > 0) {
                recomendacoes.push('🔌 Invista em energia solar ou mude para fornecedores de energia renovável.');
            }
            if (alimentacao > 0) {
                recomendacoes.push('🌽 Prefira alimentos locais e da estação para reduzir a pegada de carbono da sua alimentação.');
            }

            // Remover duplicatas e adicionar à lista
            const recomendacoesUnicas = [...new Set(recomendacoes)];
            recomendacoesUnicas.forEach(rec => {
                recomendacoesHtml += `<li>${rec}</li>`;
            });

            // Recomendação geral
            recomendacoesHtml += `<li>🌳 Plante árvores! Cada árvore absorve cerca de 20 kg de CO₂ por ano.</li>`;
            recomendacoesHtml += `<li>📱 Acompanhe seu consumo mensalmente para ver seu progresso.</li>`;
            recomendacoesHtml += `</ul>`;

            recomendacoesDiv.innerHTML = recomendacoesHtml;
        }
    }

    // Adicionar validação nos inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
});