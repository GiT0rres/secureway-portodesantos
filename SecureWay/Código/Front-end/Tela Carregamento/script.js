// Simula o carregamento do site
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
  }, 3000); // tempo em ms (3 segundos)
});
// Adiciona um efeito de fade-in ao conteúdo após o carregamento
document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  content.classList.add("fade-in");
});