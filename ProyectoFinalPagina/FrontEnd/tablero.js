// --- Estado global del juego y configuración ---
// Variables inyectadas desde PHP: NUM_PLAYERS y PLAYER_NAMES

let currentTurn = 1; // Comenzamos en turno 1
let activePlayerIndex = 0;
let sharedPool = []; // Pool compartido de dinosaurios
let placementsThisRound = new Set(); // Conjunto para rastrear jugadores que han colocado en esta ronda
let roundNumber = 1; // Número de ronda actual
let currentVisibleDinos = new Map(); // Dinosaurios visibles por jugador
let remainingDinosCount = 0; // Contador de dinosaurios restantes en el pool
let totalPlacements = new Map(); // Total de colocaciones por jugador
const DINOS_PER_DISTRIBUTION = 6; // Número de dinosaurios a repartir en cada distribución

// Lista de tipos y rutas de imagen
const DINO_TYPES = [
  { key: 'trex', img: '../Otros/fotos/dino_rojo.png' },
  { key: 'triceratops', img: '../Otros/fotos/dino_amarillo.png' },
  { key: 'stegosaurus', img: '../Otros/fotos/dino_azul.png' },
  { key: 'brontosaurus', img: '../Otros/fotos/dino_morado.png' },
  { key: 'parasaurus', img: '../Otros/fotos/dino_verde.png' },
  { key: 'spinosaurus', img: '../Otros/fotos/dino_naranja.png' }
];

function countPerTypeForPlayers(n) {
  switch (parseInt(n)) {
    case 5: return 10; // 60 total
    case 4: return 8;  // 48 total
    case 3: return 6;  // 36 total
    case 2: return 8;  // 48 total
    default: return 6;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Actualizar UI con el estado actual
function updateGameState() {
  console.log('Actualizando estado del juego:', { currentTurn, activePlayerIndex });
  document.getElementById('turno-num').textContent = currentTurn;
  document.getElementById('jugador-activo').textContent = PLAYER_NAMES[activePlayerIndex];
  
  // Actualizar indicador visual del turno actual
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const tab = document.querySelector(`#player${i}-tab`);
    const panel = document.querySelector(`#player${i}-pane`);
    const dinoPool = document.getElementById(`player${i}-dinoPool`);
    
    if (tab) {
      if (i === activePlayerIndex) {
        tab.classList.add('active-player');
        if (panel) panel.classList.add('active-player-content');
        if (dinoPool) dinoPool.classList.remove('disabled-pool');
      } else {
        tab.classList.remove('active-player');
        if (panel) panel.classList.remove('active-player-content');
        if (dinoPool) dinoPool.classList.add('disabled-pool');
      }
    }
  }
}

// Manejar cambio de turno
function nextTurn() {
  activePlayerIndex = (activePlayerIndex + 1) % NUM_PLAYERS;
  if (activePlayerIndex === 0) {
    currentTurn++;
  }
  updateGameState();
}

function updateRemainingDinosIndicator() {
  const indicator = document.getElementById('remaining-dinos-count');
  if (indicator) {
    indicator.textContent = remainingDinosCount;
  }
}

function initializeSharedPool() {
  console.log('Iniciando pool compartido. NUM_PLAYERS:', NUM_PLAYERS);
  const countPerType = countPerTypeForPlayers(NUM_PLAYERS);
  console.log('Dinosaurios por tipo:', countPerType);
  
  sharedPool = [];
  DINO_TYPES.forEach(type => {
    for (let i = 0; i < countPerType; i++) {
      sharedPool.push({ key: type.key, img: type.img });
    }
  });
  
  shuffle(sharedPool);
  remainingDinosCount = sharedPool.length;
  console.log('Pool inicial creado. Total dinosaurios:', remainingDinosCount);
  
  // Inicializar contadores de colocación para cada jugador
  totalPlacements = new Map();
  for (let i = 0; i < NUM_PLAYERS; i++) {
    totalPlacements.set(i, 0);
  }
  
  updateRemainingDinosIndicator();
}

function generatePoolAndRenderForPlayer(playerId, visibleCount = 6) {
  console.log(`Generando pool para jugador ${playerId}`);
  
  // Asignar dinosaurios del pool compartido si no tiene
  if (!currentVisibleDinos.has(playerId)) {
    console.log('Asignando dinosaurios iniciales al jugador');
    const playerDinos = sharedPool.splice(0, visibleCount);
    console.log('Dinos asignados:', playerDinos.length);
    currentVisibleDinos.set(playerId, playerDinos);
    remainingDinosCount = sharedPool.length;
    updateRemainingDinosIndicator();
  }

  const visible = currentVisibleDinos.get(playerId) || [];
  console.log(`Dinosaurios visibles para jugador ${playerId}:`, visible.length);
  
  const container = document.getElementById(`player${playerId}-dinoPool`);
  console.log('Contenedor encontrado:', !!container, `player${playerId}-dinoPool`);
  
  if (!container) return;
  container.innerHTML = '';

  visible.forEach((dino, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'dino';
    wrapper.setAttribute('draggable', 'true');
    wrapper.id = `player${playerId}-${dino.key}-${idx}`;
    
    const img = document.createElement('img');
    img.src = dino.img;
    img.alt = dino.key;
    img.className = 'img-fluid';
    wrapper.appendChild(img);
    container.appendChild(wrapper);

    wrapper.addEventListener('dragstart', e => {
      console.log('Iniciando drag desde jugador', playerId, 'turno actual:', activePlayerIndex);
      // Solo permitir arrastre si es el turno del jugador
      if (activePlayerIndex !== playerId) {
        console.log('Drag bloqueado - no es el turno del jugador');
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', wrapper.id);
      wrapper.classList.add('dragging');
      console.log('Drag iniciado, ID:', wrapper.id);
    });

    wrapper.addEventListener('dragend', () => {
      wrapper.classList.remove('dragging');
    });
  });

  // Actualizar contador de dinosaurios
  updatePlayerStats(playerId);
}

// Funciones de actualización de estado del jugador
function updatePlayerStats(playerId) {
  const playerBoard = document.querySelector(`.mapa[data-player-id="${playerId}"]`);
  if (!playerBoard) return;

  const dinosPlaced = playerBoard.querySelectorAll('.zona .dino').length;
  document.getElementById(`player${playerId}-dinos-count`).textContent = dinosPlaced;
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, iniciando juego');
  try {
    console.log('Comprobando variables globales:', { NUM_PLAYERS, PLAYER_NAMES });
    
    // Inicializar el pool compartido
    initializeSharedPool();

    // Distribuir 6 dinosaurios iniciales a cada jugador
    console.log('Distribuyendo dinosaurios iniciales');
    for (let i = 0; i < NUM_PLAYERS; i++) {
      generatePoolAndRenderForPlayer(i);
    }

    // Configurar zonas para cada jugador
    for (let playerId = 0; playerId < NUM_PLAYERS; playerId++) {
      const zonas = document.querySelectorAll(`[id^="player${playerId}-zona"]`);
      zonas.forEach(zona => {
        zona.addEventListener('dragover', e => {
          e.preventDefault(); // Necesario para permitir el drop
          e.stopPropagation();
          console.log('Dragover en zona del jugador', playerId);
          
          if (activePlayerIndex === playerId) {
            // Verificar si la zona permite más dinosaurios
            const isSingleOccupancy = zona.id.endsWith('-zona2') || zona.id.endsWith('-zona3'); // Bosque o Río
            const currentCount = zona.querySelectorAll('.dino').length;
            const isPraderaFull = zona.id.endsWith('-zona1') && currentCount >= 6; // Pradera capacidad 6

            const invalidBecauseSingle = isSingleOccupancy && currentCount > 0;
            const invalidBecausePradera = isPraderaFull;

            if (invalidBecauseSingle || invalidBecausePradera) {
              e.dataTransfer.dropEffect = 'none';
              zona.classList.add('zona-invalida');
              console.log('Zona no permite más dinos o ya ocupada:', zona.id, 'count=', currentCount);
            } else {
              e.dataTransfer.dropEffect = 'move';
              zona.classList.add('zona-valida');
            }
          } else {
            e.dataTransfer.dropEffect = 'none';
          }
        });

        zona.addEventListener('dragenter', e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Dragenter en zona del jugador', playerId);
          
          if (activePlayerIndex === playerId) {
            const isSingleOccupancy = zona.id.endsWith('-zona2') || zona.id.endsWith('-zona3'); // Bosque o Río
            const currentCount = zona.querySelectorAll('.dino').length;
            const isPraderaFull = zona.id.endsWith('-zona1') && currentCount >= 6;

            if ((isSingleOccupancy && currentCount > 0) || isPraderaFull) {
              zona.classList.add('zona-invalida');
            } else {
              zona.classList.add('zona-valida');
            }
          }
        });

        zona.addEventListener('dragleave', () => {
          zona.classList.remove('zona-valida');
          zona.classList.remove('zona-invalida');
        });

        zona.addEventListener('drop', e => {
          e.preventDefault();
          console.log('Intento de drop en zona del jugador', playerId);
          
          if (activePlayerIndex !== playerId) {
            console.log('Drop cancelado - no es el turno del jugador');
            return;
          }

          // Verificar si la zona está restringida y ya tiene un dinosaurio o si Pradera está llena
          const isSingleOccupancy = zona.id.endsWith('-zona2') || zona.id.endsWith('-zona3');
          const currentCount = zona.querySelectorAll('.dino').length;
          const isPraderaFull = zona.id.endsWith('-zona1') && currentCount >= 6;

          if ((isSingleOccupancy && currentCount > 0) || isPraderaFull) {
            console.log('Drop cancelado - zona restringida o llena:', zona.id, 'count=', currentCount);
            return;
          }
          
          const dinoId = e.dataTransfer.getData('text/plain');
          console.log('Drop aceptado, dinosaurio:', dinoId);
          const dino = document.getElementById(dinoId);
          if (!dino) {
            console.log('Dinosaurio no encontrado');
            return;
          }

          // Colocar el dinosaurio
          zona.appendChild(dino);
          zona.classList.remove('zona-valida');

          // Una vez colocado, el dinosaurio ya no debe poder moverse: quitar draggable y ajustar estilo
          try {
            // Evitar que el elemento o cualquiera de sus hijos (ej. <img>) sean arrastrables
            dino.setAttribute('draggable', 'false');
            dino.classList.add('placed');
            dino.classList.remove('dragging');
            dino.style.cursor = 'default';

            // Marcar imágenes internas como no arrastrables (por defecto las <img> lo son)
            const imgs = dino.querySelectorAll('img');
            imgs.forEach(img => img.setAttribute('draggable', 'false'));

            // Añadir un listener defensivo para bloquear cualquier dragstart futuro
            const blockDrag = e => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            };
            dino.addEventListener('dragstart', blockDrag);
            imgs.forEach(img => img.addEventListener('dragstart', blockDrag));
          } catch (err) {
            console.warn('No se pudo marcar el dino como colocado:', err);
          }

          if (zona.dataset.autoPosition === 'true') {
            if (getComputedStyle(zona).position === 'static') {
              zona.style.position = 'relative';
            }

            const hijos = zona.querySelectorAll('.dino');
            const index = Array.from(hijos).indexOf(dino);
            const cols = parseInt(zona.dataset.cols) || 3;
            const gap = parseInt(zona.dataset.gap) || 110;

            const offsetX = (index % cols) * gap;
            const offsetY = Math.floor(index / cols) * gap;

            dino.style.position = 'absolute';
            dino.style.top = offsetY + 'px';
            dino.style.left = offsetX + 'px';
          } else {
            if (getComputedStyle(zona).position === 'static') {
              zona.style.position = 'relative';
            }

            const rect = zona.getBoundingClientRect();
            const dinoWidth = dino.offsetWidth || dino.getBoundingClientRect().width;
            const dinoHeight = dino.offsetHeight || dino.getBoundingClientRect().height;
            let x = e.clientX - rect.left - dinoWidth / 2;
            let y = e.clientY - rect.top - dinoHeight / 2;

            x = Math.max(0, Math.min(x, zona.clientWidth - dinoWidth));
            y = Math.max(0, Math.min(y, zona.clientHeight - dinoHeight));

            dino.style.position = 'absolute';
            dino.style.left = x + 'px';
            dino.style.top = y + 'px';
          }

          // Actualizar estadísticas del jugador
          updatePlayerStats(playerId);

          // Eliminar el dinosaurio colocado de los visibles del jugador
          const playerDinos = currentVisibleDinos.get(playerId) || [];
          const dinoIndex = playerDinos.findIndex(d => `player${playerId}-${d.key}-${playerDinos.indexOf(d)}` === dinoId);
          if (dinoIndex !== -1) {
            playerDinos.splice(dinoIndex, 1);
            currentVisibleDinos.set(playerId, playerDinos);

            // Incrementar contador de colocaciones del jugador
            const currentPlacements = totalPlacements.get(playerId) || 0;
            totalPlacements.set(playerId, currentPlacements + 1);

            // Registrar que este jugador ha colocado en esta ronda
            placementsThisRound.add(playerId);
            console.log(`Jugador ${playerId} colocó. Colocaciones en esta ronda:`, placementsThisRound.size);
            console.log(`Total de colocaciones del jugador ${playerId}:`, currentPlacements + 1);

            // Comprobar si todos los jugadores han colocado en esta ronda
            if (placementsThisRound.size === NUM_PLAYERS) {
              console.log('Todos los jugadores han colocado. Rotando dinosaurios...');
              rotateDinosaurs();
              placementsThisRound.clear(); // Reiniciar para la siguiente ronda
              roundNumber++;

              // Comprobar si todos los jugadores han colocado sus 6 dinosaurios
              let allPlayersFinished = true;
              for (let i = 0; i < NUM_PLAYERS; i++) {
                if ((totalPlacements.get(i) || 0) < DINOS_PER_DISTRIBUTION) {
                  allPlayersFinished = false;
                  break;
                }
              }

              // Si todos completaron sus 6 dinosaurios y quedan dinosaurios en el pool, repartir nuevos
              if (allPlayersFinished && sharedPool.length > 0) {
                distributeNewDinosaurs();
              }
            }
          }

          // Recalcular puntuaciones para el jugador que acaba de colocar
          try {
            computeScoresForPlayer(playerId);
          } catch (err) {
            console.warn('Error al calcular puntuación del jugador', playerId, err);
          }

          // Pasar automáticamente al siguiente jugador después de colocar
          setTimeout(() => {
            nextTurn();
            const tabElement = document.querySelector(`#player${activePlayerIndex}-tab`);
            if (tabElement) {
              const tab = new bootstrap.Tab(tabElement);
              tab.show();
            }
          }, 500);
        });
      });
    }

    // Ocultar el botón de siguiente turno ya que ahora es automático
    const btnSiguienteTurno = document.getElementById('btn-siguiente-turno');
    if (btnSiguienteTurno) {
      btnSiguienteTurno.style.display = 'none';
    }

    // Configurar botones específicos de cada jugador
    for (let i = 0; i < NUM_PLAYERS; i++) {
      const btnStart = document.getElementById(`player${i}-btn-start`);
      const btnEnd = document.getElementById(`player${i}-btn-end`);
      const btnReset = document.getElementById(`player${i}-btn-reset`);

      if (btnStart) {
        btnStart.addEventListener('click', () => {
          if (activePlayerIndex === i) {
            generatePoolAndRenderForPlayer(i);
          }
        });
      }

      if (btnEnd) {
        btnEnd.addEventListener('click', () => {
          if (activePlayerIndex === i) {
            nextTurn();
          }
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (confirm(`¿Seguro que quieres reiniciar el tablero de ${PLAYER_NAMES[i]}?`)) {
            const zonas = document.querySelectorAll(`[id^="player${i}-zona"]`);
            zonas.forEach(zona => zona.innerHTML = '');
            generatePoolAndRenderForPlayer(i);
            updatePlayerStats(i);
          }
        });
      }
    }

    // Inicializar estado del juego
    updateGameState();

  } catch (e) {
    console.error('Error al inicializar el juego:', e);
  }
});

// Función para distribuir nuevos dinosaurios a todos los jugadores
function distributeNewDinosaurs() {
  console.log('Distribuyendo nueva ronda de dinosaurios...');
  
  // Reiniciar contadores de colocación
  for (let i = 0; i < NUM_PLAYERS; i++) {
    totalPlacements.set(i, 0);
  }

  // Distribuir nuevos dinosaurios a cada jugador
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const newDinos = sharedPool.splice(0, Math.min(DINOS_PER_DISTRIBUTION, sharedPool.length));
    if (newDinos.length > 0) {
      currentVisibleDinos.set(i, newDinos);
      generatePoolAndRenderForPlayer(i, newDinos.length);
    }
  }

  // Actualizar contador de dinosaurios restantes
  remainingDinosCount = sharedPool.length;
  updateRemainingDinosIndicator();

  // Mostrar mensaje de nueva distribución
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '11';
  
  const toastElement = document.createElement('div');
  toastElement.className = 'toast align-items-center text-white bg-primary';
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  
  const remainingMsg = sharedPool.length > 0 ? 
    `Quedan ${sharedPool.length} dinosaurios en el pool.` : 
    '¡Esta es la última ronda!';
  
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ¡Nueva ronda! Se han distribuido nuevos dinosaurios. ${remainingMsg}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toastElement);
  document.body.appendChild(toastContainer);
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  
  setTimeout(() => {
    toastContainer.remove();
  }, 5000);
}

// Función para rotar los dinosaurios entre jugadores
function rotateDinosaurs() {
  console.log('Iniciando rotación de dinosaurios');
  const tempDinos = new Map();

  // Guardar los dinosaurios actuales en un mapa temporal
  for (let i = 0; i < NUM_PLAYERS; i++) {
    tempDinos.set(i, currentVisibleDinos.get(i) || []);
  }

  // Rotar los dinosaurios: cada jugador recibe los dinos del siguiente jugador
  // (el último jugador recibe los del primero)
  for (let i = 0; i < NUM_PLAYERS; i++) {
    const sourcePlayer = (i + 1) % NUM_PLAYERS; // El jugador del que tomaremos los dinos
    const targetPlayer = i; // El jugador que recibirá los dinos
    const dinosToPass = tempDinos.get(sourcePlayer);
    
    console.log(`Pasando ${dinosToPass.length} dinos del jugador ${sourcePlayer} al jugador ${targetPlayer}`);
    currentVisibleDinos.set(targetPlayer, dinosToPass);
    
    // Regenerar el pool visual para el jugador que recibe
    generatePoolAndRenderForPlayer(targetPlayer, dinosToPass.length);
  }

  // Mostrar mensaje de rotación
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '11';
  
  const toastElement = document.createElement('div');
  toastElement.className = 'toast align-items-center text-white bg-success';
  toastElement.setAttribute('role', 'alert');
  toastElement.setAttribute('aria-live', 'assertive');
  toastElement.setAttribute('aria-atomic', 'true');
  
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ¡Ronda ${roundNumber} completada! Los dinosaurios han rotado.
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  toastContainer.appendChild(toastElement);
  document.body.appendChild(toastContainer);
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  
  setTimeout(() => {
    toastContainer.remove();
  }, 5000);
}

// ---------------------- Puntuación por zonas ----------------------
// Calcula la puntuación de la zona Pradera (zona1)
function calculatePraderaScore(zonaElem) {
  if (!zonaElem) return 0;
  // Contar tipos por clave (se asume que el elemento .dino img.alt contiene la key)
  const dinos = zonaElem.querySelectorAll('.dino');
  const counts = {};
  dinos.forEach(d => {
    const img = d.querySelector('img');
    const key = img ? img.alt : d.dataset.type || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });

  // Si no hay dinosaurios
  if (Object.keys(counts).length === 0) return 0;

  // Obtener el mayor grupo
  let maxCount = 0;
  Object.values(counts).forEach(c => { if (c > maxCount) maxCount = c; });

  // Tabla de puntos
  const scoreTable = {
    1: 2,
    2: 4,
    3: 8,
    4: 12,
    5: 18,
    6: 24
  };

  return scoreTable[maxCount] || 0;
}

// Calcular puntuaciones por zonas para un jugador y actualizar el DOM
function computeScoresForPlayer(playerId) {
  const scores = {};
  // Zona 1: Pradera
  const zona1 = document.getElementById(`player${playerId}-zona1`);
  scores.pradera = calculatePraderaScore(zona1);

  // (Otras zonas se implementarán más adelante)
  scores.total = Object.values(scores).reduce((s, v) => s + (v || 0), 0);

  // Actualizar la interfaz
  const scoreEl = document.getElementById(`player${playerId}-puntuacion`);
  if (scoreEl) scoreEl.textContent = scores.total;

  console.log(`Puntuaciones jugador ${playerId}:`, scores);
  return scores;
}

