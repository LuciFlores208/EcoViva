const imagens = [
    "./africaEco1.jpg",
    "./asiaEco1.jpg",
    "./europaEco1.jpg",
    "./amazonia1.jpg",
    "./foto1.jpg",
    "./ods1.jpg",
    "./paises1.jpg"
]

let atual = 0

function atualizarGaleria() {

    foto1.src = imagens[(atual - 1 + imagens.length) % imagens.length]
    foto2.src = imagens[atual]
    foto3.src = imagens[(atual + 1) % imagens.length]

    foto1.classList.remove("ativa")
    foto2.classList.add("ativa")
    foto3.classList.remove("ativa")
}

proximo.onclick = () => {
    atual = (atual + 1) % imagens.length
    atualizarGaleria()
}

anterior.onclick = () => {
    atual = (atual - 1 + imagens.length) % imagens.length
    atualizarGaleria()
}

atualizarGaleria()