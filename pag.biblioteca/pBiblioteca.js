let biblioteca = [];

let tipoSelecionado = "Todos";
let statusSelecionado = "Todos";

// Carrega o JSON
fetch("pBiblioteca.json")
    .then(response => response.json())
    .then(dados => {
        biblioteca = dados;
        renderizarCards();
    });

// Busca em tempo real
document.addEventListener("DOMContentLoaded", () => {

    const campoBusca = document.getElementById("busca");

    campoBusca.addEventListener("input", () => {
        renderizarCards();
    });

});

// Filtrar por tipo
function filtrarTipo(tipo) {
    tipoSelecionado = tipo;
    renderizarCards();
}

// Filtrar por status
function filtrarStatus(status) {
    statusSelecionado = status;
    renderizarCards();
}

// Criar os cards
function renderizarCards() {

    const container = document.getElementById("cards");

    const textoBusca = document
        .getElementById("busca")
        .value
        .toLowerCase();

    container.innerHTML = "";

    const resultados = biblioteca.filter(item => {

        const buscaValida =
            item.titulo.toLowerCase().includes(textoBusca);

        const tipoValido =
            tipoSelecionado === "Todos" ||
            item.tipo === tipoSelecionado;

        const statusValido =
            statusSelecionado === "Todos" ||
            (item.status && item.status === statusSelecionado);

        return buscaValida && tipoValido && statusValido;
    });

    if (resultados.length === 0) {

        container.innerHTML = `
            <p class="sem-resultados">
                Nenhum resultado encontrado.
            </p>
        `;

        return;
    }

    resultados.forEach(item => {

        container.innerHTML += `

            <div class="card">

                <img
                    src="${item.imagem}"
                    alt="${item.titulo}"
                >

                <div class="card-conteudo">

                    <h3>${item.titulo}</h3>

                    <p>${item.descricao}</p>

                    <div class="tipo">
                        ${item.tipo}
                    </div>

                    <div class="status-card">

                        <label>Status:</label>

                        <select onchange="alterarStatus(${item.id}, this)">

                            <option value=""
                                ${!item.status ? "selected" : ""}
                                disabled>
                                Selecione...
                            </option>

                            <option value="Quero ler"
                                ${item.status === "Quero ler" ? "selected" : ""}>
                                Quero ler
                            </option>

                            <option value="Lendo"
                                ${item.status === "Lendo" ? "selected" : ""}>
                                Lendo
                            </option>

                            <option value="Lido"
                                ${item.status === "Lido" ? "selected" : ""}>
                                Lido
                            </option>

                        </select>

                    </div>

                    <button
                        class="btn-abrir"
                        onclick="window.open('${item.arquivo}','_blank')">

                        Abrir arquivo

                    </button>

                </div>

            </div>

        `;
    });
}

function alterarStatus(idLivro, select) {

    const livro = biblioteca.find(
        item => item.id === idLivro
    );

    livro.status = select.value;

    if (select.value === "Lido") {
        select.style.background = "#D8F3DC";
    }
    else if (select.value === "Lendo") {
        select.style.background = "#FFF3BF";
    }
    else {
        select.style.background = "#E9ECEF";
    }

}