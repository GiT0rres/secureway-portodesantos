window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
  }, 9000);
});
document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  content.classList.add("fade-in");
});
