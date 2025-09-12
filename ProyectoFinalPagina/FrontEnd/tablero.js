// --- Preparar dinosaurios para ser arrastrados ---
const dinos = document.querySelectorAll(".dino");
dinos.forEach(dino => {
  dino.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", dino.id); // guardar el id
  });
});

// --- Preparar las zonas ---
const zonas = document.querySelectorAll(".zona");
zonas.forEach(zona => {
  zona.addEventListener("dragover", e => {
    e.preventDefault(); // necesario para permitir drop
    zona.style.background = "rgba(0,255,0,0.2)"; // cambia color al pasar encima
  });

  zona.addEventListener("dragleave", () => {
    zona.style.background = "";
  });

  zona.addEventListener("drop", e => {
    e.preventDefault();
    const dinoId = e.dataTransfer.getData("text/plain");
    const dino = document.getElementById(dinoId);
    zona.appendChild(dino); // mover dino dentro de la zona
    zona.style.background = "";
  });
});

zona.addEventListener("drop", e => {
  e.preventDefault();
  const dinoId = e.dataTransfer.getData("text/plain");
  const dino = document.getElementById(dinoId);
  zona.appendChild(dino);

  // Obtener cuántos dinos ya hay en la zona
  const hijos = zona.querySelectorAll(".dino");
  const index = hijos.length - 1; // índice del que acabamos de añadir

  // Distribuir en cuadrícula simple
  const offsetX = (index % 3) * 110; // 3 dinos por fila, 110px de separación
  const offsetY = Math.floor(index / 3) * 110;

  dino.style.position = "absolute";
  dino.style.top = offsetY + "px";
  dino.style.left = offsetX + "px";
});