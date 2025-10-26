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
  // Recalcular puntuaciones para mantener la UI consistente
  try { computeScoresForPlayer(playerId); } catch (e) { console.warn('computeScoresForPlayer falló en updatePlayerStats', e); }
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
            const isMontanaFull = zona.id.endsWith('-zona4') && currentCount >= 3; // Montaña capacidad 3
            const isCostaFull = zona.id.endsWith('-zona6') && currentCount >= 6; // Costa capacidad 6

            const invalidBecauseSingle = isSingleOccupancy && currentCount > 0;
            const invalidBecausePradera = isPraderaFull;
            const invalidBecauseMontana = isMontanaFull;
            const invalidBecauseCosta = isCostaFull;

            if (invalidBecauseSingle || invalidBecausePradera || invalidBecauseMontana || invalidBecauseCosta) {
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
            const isMontanaFull = zona.id.endsWith('-zona4') && currentCount >= 3; // Montaña capacidad 3
            const isCostaFull = zona.id.endsWith('-zona6') && currentCount >= 6; // Costa capacidad 6

            if ((isSingleOccupancy && currentCount > 0) || isPraderaFull || isMontanaFull || isCostaFull) {
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
          const isMontanaFull = zona.id.endsWith('-zona4') && currentCount >= 3; // Montaña capacidad 3
          const isCostaFull = zona.id.endsWith('-zona6') && currentCount >= 6; // Costa capacidad 6

          if ((isSingleOccupancy && currentCount > 0) || isPraderaFull || isMontanaFull || isCostaFull) {
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

          // Intentar parsear player e index desde el id: formato esperado player{playerId}-{key}-{idx}
          const idParts = dinoId.split('-');
          const parsedPlayer = parseInt(idParts[0].replace('player', ''), 10);
          const parsedIdx = parseInt(idParts[idParts.length - 1], 10);
          const playerDinos = currentVisibleDinos.get(parsedPlayer) || [];

          // Clonar el dinosaurio para la zona (el original permanece en el pool hasta que lo removamos de la estructura de datos)
          const clone = dino.cloneNode(true);
          clone.id = `${dinoId}-placed-${Date.now()}`;
          clone.setAttribute('draggable', 'false');
          clone.classList.add('placed');
          clone.classList.remove('dragging');
          clone.style.cursor = 'default';
          // Marcar imágenes internas como no arrastrables
          const cloneImgs = clone.querySelectorAll('img');
          cloneImgs.forEach(img => img.setAttribute('draggable', 'false'));
          // Bloquear futuros dragstart
          const blockDrag = ev => { ev.preventDefault(); ev.stopPropagation(); return false; };
          clone.addEventListener('dragstart', blockDrag);
          cloneImgs.forEach(img => img.addEventListener('dragstart', blockDrag));

          // Posicionar y añadir a la zona
          if (zona.dataset.autoPosition === 'true') {
            if (getComputedStyle(zona).position === 'static') zona.style.position = 'relative';
            zona.appendChild(clone);
            const hijos = zona.querySelectorAll('.dino');
            const index = Array.from(hijos).indexOf(clone);
            const cols = parseInt(zona.dataset.cols) || 3;
            const gap = parseInt(zona.dataset.gap) || 110;
            const offsetX = (index % cols) * gap;
            const offsetY = Math.floor(index / cols) * gap;
            clone.style.position = 'absolute';
            clone.style.top = offsetY + 'px';
            clone.style.left = offsetX + 'px';
          } else {
            if (getComputedStyle(zona).position === 'static') zona.style.position = 'relative';
            zona.appendChild(clone);
            // Mejorar cálculo para que el dino quede dentro de la zona
            const zonaRect = zona.getBoundingClientRect();
            const dinoRect = clone.getBoundingClientRect();
            const dinoWidth = dinoRect.width;
            const dinoHeight = dinoRect.height;
            // Calcular posición relativa al contenedor
            let x = e.clientX - zonaRect.left - dinoWidth / 2;
            let y = e.clientY - zonaRect.top - dinoHeight / 2;
            // Ajustar para que no se salga por ningún borde
            x = Math.max(0, Math.min(x, zona.clientWidth - dinoWidth));
            y = Math.max(0, Math.min(y, zona.clientHeight - dinoHeight));
            clone.style.position = 'absolute';
            clone.style.left = x + 'px';
            clone.style.top = y + 'px';
          }

          zona.classList.remove('zona-valida');

          // Quitar el dinosaurio de la lista visible del jugador (usar el índice parseado si corresponde)
          if (parsedPlayer === playerId && !isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < playerDinos.length) {
            playerDinos.splice(parsedIdx, 1);
            currentVisibleDinos.set(parsedPlayer, playerDinos);
          } else {
            // fallback: buscar por key
            const key = dino.querySelector('img') ? dino.querySelector('img').alt : null;
            const findIdx = playerDinos.findIndex(dd => dd.key === key);
            if (findIdx !== -1) {
              playerDinos.splice(findIdx, 1);
              currentVisibleDinos.set(parsedPlayer, playerDinos);
            }
          }

          // Re-renderizar el pool del jugador para que los ids e índices queden consistentes
          generatePoolAndRenderForPlayer(playerId);

          // Actualizar estadísticas y contadores
          updatePlayerStats(playerId);
          const currentPlacements = totalPlacements.get(playerId) || 0;
          totalPlacements.set(playerId, currentPlacements + 1);
          placementsThisRound.add(playerId);
          console.log(`Jugador ${playerId} colocó. Colocaciones en esta ronda:`, placementsThisRound.size);
          console.log(`Total de colocaciones del jugador ${playerId}:`, currentPlacements + 1);

          // Si todos colocaron, rotar y/o repartir nueva ronda
          if (placementsThisRound.size === NUM_PLAYERS) {
            console.log('Todos los jugadores han colocado. Rotando dinosaurios...');
            rotateDinosaurs();
            placementsThisRound.clear();
            roundNumber++;

            let allPlayersFinished = true;
            for (let i = 0; i < NUM_PLAYERS; i++) {
              if ((totalPlacements.get(i) || 0) < DINOS_PER_DISTRIBUTION) { allPlayersFinished = false; break; }
            }
            if (allPlayersFinished && sharedPool.length > 0) distributeNewDinosaurs();
          }

          // Recalcular puntuaciones
          try { computeScoresForPlayer(playerId); } catch (err) { console.warn('Error al calcular puntuación del jugador', playerId, err); }

          // Pasar al siguiente jugador después de un pequeño retraso
          setTimeout(() => {
            nextTurn();
            const tabElement = document.querySelector(`#player${activePlayerIndex}-tab`);
            if (tabElement) { const tab = new bootstrap.Tab(tabElement); tab.show(); }
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
                    computeScoresForPlayer(playerId);
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
// Calcula la puntuación de la zona Lago (zona7)
function calculateLagoScore(zonaElem) {
  if (!zonaElem) return 0;
  // Cada dinosaurio suma 1 punto
  const dinos = zonaElem.querySelectorAll('.dino');
  return dinos.length;
}

// Calcula la puntuación de la zona Montaña (zona4)
function calculateMontanaScore(zonaElem) {
  if (!zonaElem) return 0;
  const dinos = zonaElem.querySelectorAll('.dino');
  // 7 puntos si tiene exactamente 3 dinosaurios, 0 si tiene menos
  return dinos.length === 3 ? 7 : 0;
}

// Calcula la puntuación de la zona Costa (zona6)
function calculateCostaScore(zonaElem) {
  if (!zonaElem) return 0;
  const dinos = zonaElem.querySelectorAll('.dino');
  
  // Contar especies únicas
  const species = new Set();
  dinos.forEach(d => {
    const img = d.querySelector('img');
    const key = img ? img.alt : d.dataset.type || 'unknown';
    species.add(key);
  });
  
  const speciesCount = species.size;
  
  // Tabla de puntos según especies diferentes
  const scoreTable = {
    1: 1,
    2: 3,
    3: 6,
    4: 10,
    5: 15,
    6: 21
  };
  
  return scoreTable[speciesCount] || 0;
}

// Calcula la puntuación de la zona Desierto (zona5)
function calculateDesiertoScore(zonaElem) {
  if (!zonaElem) return 0;
  const dinos = zonaElem.querySelectorAll('.dino');
  
  // Contar dinosaurios por tipo
  const counts = {};
  dinos.forEach(d => {
    const img = d.querySelector('img');
    const key = img ? img.alt : d.dataset.type || 'unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  
  // Calcular parejas: cada 2 dinosaurios del mismo tipo = 1 pareja = 5 puntos
  let totalScore = 0;
  Object.values(counts).forEach(count => {
    const pairs = Math.floor(count / 2); // Número de parejas completas
    totalScore += pairs * 5;
  });
  
  return totalScore;
}

// Calcula la puntuación de la zona Bosque (zona2)
// Regla: Si el único dinosaurio en Bosque NO aparece en ninguna otra zona del mismo jugador, suma 7 puntos. De lo contrario, 0.
function calculateBosqueScore(zonaElem, playerId) {
  if (!zonaElem) return 0;
  const dino = zonaElem.querySelector('.dino');
  if (!dino) return 0; // No hay dino en Bosque
  const img = dino.querySelector('img');
  const key = img ? img.alt : dino.dataset.type || 'unknown';
  console.debug('[Bosque] Jugador', playerId, 'clave bosque=', key);

  // Revisar el resto de zonas del mismo jugador (1,3,4,5,6,7)
  const otherZonaIds = [1,3,4,5,6,7].map(n => `player${playerId}-zona${n}`);
  for (const zid of otherZonaIds) {
    const z = document.getElementById(zid);
    if (!z) continue;
    const dinos = z.querySelectorAll('.dino');
    for (const d of dinos) {
      const i = d.querySelector('img');
      const k = i ? i.alt : d.dataset.type || 'unknown';
      if (k === key) {
        console.debug('[Bosque] Encontrada misma especie en', zid, ' => sin puntos');
      }
      if (k === key) {
        return 0; // Encontrado el mismo tipo en otra zona
      }
    }
  }
  console.debug('[Bosque] Especie única fuera de Bosque => +7');
  return 7;
}

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

  // Zona 2: Bosque
  const zona2 = document.getElementById(`player${playerId}-zona2`);
  scores.bosque = calculateBosqueScore(zona2, playerId);

  // Zona 4: Montaña
  const zona4 = document.getElementById(`player${playerId}-zona4`);
  scores.montana = calculateMontanaScore(zona4);

  // Zona 5: Desierto
  const zona5 = document.getElementById(`player${playerId}-zona5`);
  scores.desierto = calculateDesiertoScore(zona5);

  // Zona 6: Costa
  const zona6 = document.getElementById(`player${playerId}-zona6`);
  scores.costa = calculateCostaScore(zona6);

  // Zona 7: Lago
  const zona7 = document.getElementById(`player${playerId}-zona7`);
  scores.lago = calculateLagoScore(zona7);

  // Sumar total
  scores.total = Object.values(scores).reduce((s, v) => s + (v || 0), 0);

  // Actualizar la interfaz
  const scoreEl = document.getElementById(`player${playerId}-puntuacion`);
  if (scoreEl) scoreEl.textContent = scores.total;

  // Si tienes un campo específico para el puntaje del lago, actualízalo aquí
  const lagoEl = document.getElementById(`player${playerId}-puntuacion-lago`);
  if (lagoEl) lagoEl.textContent = scores.lago;

  // Si tienes un campo específico para el puntaje de montaña, actualízalo aquí
  const montanaEl = document.getElementById(`player${playerId}-puntuacion-montana`);
  if (montanaEl) montanaEl.textContent = scores.montana;

  // Si tienes un campo específico para el puntaje de bosque, actualízalo aquí
  const bosqueEl = document.getElementById(`player${playerId}-puntuacion-bosque`);
  if (bosqueEl) bosqueEl.textContent = scores.bosque;

  // Si tienes un campo específico para el puntaje de desierto, actualízalo aquí
  const desiertoEl = document.getElementById(`player${playerId}-puntuacion-desierto`);
  if (desiertoEl) desiertoEl.textContent = scores.desierto;

  // Si tienes un campo específico para el puntaje de costa, actualízalo aquí
  const costaEl = document.getElementById(`player${playerId}-puntuacion-costa`);
  if (costaEl) costaEl.textContent = scores.costa;

  console.log(`Puntuaciones jugador ${playerId}:`, scores);
  return scores;
}

