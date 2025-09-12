<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="estilos.css">

    <title>Partida Draftosaurus</title>
  </head>
  <body class="bg-custom"> <!-- clase para fondo -->
    
    <div class="container py-4">
      
      <!-- TABLERO -->
      <div class="d-flex justify-content-center mb-3">
        <div class="mapa">
          <img src="../Otros/fotos/Tablero_final.jpg" alt="Mapa zoológico">
          <div class="zona" id="zona1"></div>
          <div class="zona" id="zona2"></div>
          <div class="zona" id="zona3"></div>
          <div class="zona" id="zona4"></div>
          <div class="zona" id="zona5"></div>
          <div class="zona" id="zona6"></div>
          <div class="zona" id="zona7"></div>
        </div>
      </div>

<!-- Contenedor único para los dinos -->
<div class="d-flex flex-wrap justify-content-center bg-light border border-3 border-danger" style="max-width: 320px; margin: auto; gap: 10px;">

  <div class="dino" draggable="true" id="trex">
    <img src="../Otros/fotos/dino_rojo.png" alt="T-Rex">
  </div>
  <div class="dino" draggable="true" id="triceratops">
    <img src="../Otros/fotos/dino_amarillo.png" alt="Triceratops">
  </div>
  <div class="dino" draggable="true" id="stegosaurus">
    <img src="../Otros/fotos/dino_azul.png" alt="Stegosaurus">
  </div>
  <div class="dino" draggable="true" id="brontosaurus">
    <img src="../Otros/fotos/dino_morado.png" alt="Brontosaurus">
  </div>
  <div class="dino" draggable="true" id="parasaurus">
    <img src="../Otros/fotos/dino_verde.png" alt="Parasaurus">
  </div>
  <div class="dino" draggable="true" id="spinosaurus">
    <img src="../Otros/fotos/dino_naranja.png" alt="Spinosaurus">
  </div>

</div>


    <script src="../bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="tablero.js"></script>
  </body>
</html>
