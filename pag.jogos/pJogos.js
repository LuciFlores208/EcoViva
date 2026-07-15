export function setupCounter(element) {
    let counter = 0
    const setCounter = (count) => {
      counter = count
      element.innerHTML = `count is ${counter}`
    }
    element.addEventListener('click', () => setCounter(counter + 1))
    setCounter(0)
  }

  let games = [];

fetch("pJogos.json")
  .then(response => response.json())
  .then(data => {
    games = data;
    renderGames("todos");
  });
  
  function badgeFor(status) {
    if (status === "jogados")   return '<span class="card-badge badge-jogado">Jogado</span>';
    if (status === "continuar") return '<span class="card-badge badge-continuar">Continuar</span>';
    if (status === "nao-jogados") return '<span class="card-badge badge-novo">Novo</span>';
    return '';
  }
  
  function renderGames(filter) {
    const grid = document.getElementById("games-grid");
    grid.innerHTML = "";
  
    const list = filter === "todos" ? games : games.filter(g => g.status === filter);
  
    if (list.length === 0) {
      grid.innerHTML = `<p style="font-family:var(--pixel-font);font-size:8px;color:var(--text-muted);grid-column:1/-1;padding:32px 0;">Nenhum jogo encontrado.</p>`;
      return;
    }
  
    list.forEach(game => {
      const imgContent = game.img
        ? `<img src="${game.img}" alt="${game.name}" loading="lazy" />`
        : `<div class="card-img-placeholder">SEM IMAGEM</div>`;
  
      const card = document.createElement("article");
      card.className = "game-card";
      card.dataset.status = game.status;
      card.innerHTML = `
        <div class="card-img">
          ${imgContent}
          ${badgeFor(game.status)}
        </div>
        <div class="card-body">
          <h3 class="card-name">${game.name}</h3>
          <p class="card-desc">${game.desc}</p>
        </div>
        <div class="card-footer">
          <span class="card-level">${game.level}</span>
        </div>
      `;
  
      card.addEventListener("click", () => openGame(game));
      grid.appendChild(card);
    });
  }
  
  function openGame(game) {
    window.location.href = game.page;
  }
  
  function initFilters() {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        btns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderGames(btn.dataset.filter);
      });
    });
  }
  
  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const links  = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderGames("todos");
    initFilters();
    initNavToggle();
  });
  