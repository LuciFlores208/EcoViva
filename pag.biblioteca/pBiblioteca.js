let biblioteca = [];

let tipoSelecionado = "Todos";
let statusSelecionado = "Todos";

// Carrega o JSON
Promise.all([
    fetch("pBiblioteca.json").then(r => r.json()),
    fetch("pNoticias.json").then(r => r.json()),
    fetch("pTutoriais.json").then(r => r.json())
])
.then(([bibliotecaDados, noticiasDados, tutoriaisDados]) => {

    biblioteca = [
        ...bibliotecaDados,
        ...noticiasDados,
        ...tutoriaisDados
    ];

    renderizarCards();

})
.catch(erro => console.log(erro));
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

    // Altera o layout conforme o tipo selecionado
    if (tipoSelecionado === "Tutorial") {
        container.classList.add("tutoriais");
    } else {
        container.classList.remove("tutoriais");
    }

    const textoBusca = document
        .getElementById("busca")
        .value
        .toLowerCase();

    container.innerHTML = "";

    const resultados = biblioteca.filter(item => {

        const buscaValida =
            item.titulo.toLowerCase().includes(textoBusca);

            const tipoValido =
            tipoSelecionado === "Todos"
                ? item.tipo !== "Noticia"
                : item.tipo === tipoSelecionado;

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

        if (item.tipo === "Noticia") {
    
            container.innerHTML += `
                <a
                    class="card-noticia"
                    href="${item.link}"
                    target="_blank"
                >
    
                    <img src="${item.imagem}" alt="${item.titulo}">
    
                    <h3>${item.titulo}</h3>
    
                    <p>Clique para acessar o portal</p>
    
                </a>
            `;
    
        } else if (item.tipo === "Tutorial") {
    
            container.innerHTML += `
            <div class="card-tutorial">
    
                <a
                    class="tutorial-link"
                    href="${item.link}"
                    target="_blank"
                >
    
                    <div class="video-circle">
                        <span>▶</span>
                    </div>
    
                    <h3>${item.titulo}</h3>
    
                </a>
    
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
    
            </div>
        `;
    
        } else {
    
            // ARTIGOS E LIVROS
            container.innerHTML += `
    
                <div class="card">
    
                    ${item.imagem
                        ? `<img src="${item.imagem}" alt="${item.titulo}">`
                        : `<div class="sem-imagem">📄</div>`
                    }
    
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
        }
    
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