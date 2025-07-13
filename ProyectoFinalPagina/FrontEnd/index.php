<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <!-- css normal-->
     <link rel="stylesheet" href="styles.css">

    <title>Draftosaurus</title>
</head>
    <body>

    <!-- Boton de costado --> 

            <nav class="navbar navbar-light bg-light">
  <form class="container-fluid justify-content-start">
    <button class="btn btn-outline-success me-2" type="button" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">☰</button>
    <img src="../Otros/fotos/dinosaurioperoacolor.jpg" alt="Usuario" width="40" height="40" class="rounded-circle ms-auto">
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <p class="text-center"><img src="../Otros/fotos/dinosaurioperoacolor.jpg" alt="Usuario" width="40" height="40" class="rounded-circle me-auto"></p>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">¡Aprende mas de nosotros si te registras!</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div>
      ¡Ganaras acceso a nuestros otros proyectos, asi como también a novedades de nuestra empresa!
    </div>
    <div class="dropdown mt-3">
      <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#formularioModal">
        Registrate aca.
      </button>

      <!-- Modal -->
<div class="modal fade" id="formularioModal" tabindex="-1" aria-labelledby="formularioModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <!-- Encabezado del modal -->
      <div class="modal-header">
        <h5 class="modal-title" id="formularioModalLabel">Formulario de contacto</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <!-- Cuerpo del modal con el formulario -->
      <div class="modal-body">
        <form action="enviar.php" method="POST">
          <h6>¡En Construcción!</h6>
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" id="nombre" name="nombre">
          </div>
          <div class="mb-3">
            <label for="correo" class="form-label">Correo electrónico</label>
            <input type="email" class="form-control" id="correo" name="correo">
          </div>
          <button type="submit" class="btn btn-success">Enviar</button>
        </form>
      </div>

    </div>
  </div>
</div>

    </div>
  </div>
</div>
  </form>
            </nav>

<!-- Carrusel -->

 <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="../Otros/fotos/drafto.jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5 class="bg-warning text-dark p-2">¡Bienvenido a Draftosaurus!</h5>
        <p class="bg-success bg-opacity-50 text-white p-3 rounded">El juego más divertido de dinosaurios.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="../Otros/fotos/tablerocarousel.jpg" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5 class="bg-warning text-dark p-2">¡Conoce del juego!</h5>
       <p class="bg-success bg-opacity-50 text-white p-3 rounded">Tu objetivo en Draftosaurus es crear el parque de dinosaurios que atraiga a la mayor cantidad de visitantes.
Para ello, tienes que seleccionar e intercambiar dinosaurios, y colocarlos en recintos que tienen algunas restricciones de colocación.
Cada turno, uno de los jugadores lanza el dado, lo cual limita en qué recintos pueden colocar sus dinosaurios el resto de jugadores.
Draftosaurus es un juego de selección e intercambio rápido y ligero en el que no tienes una mano de cartas que pasar (después de seleccionar una), sino un montón de dinosaurios en la palma de tu mano.</p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="../Otros/fotos/draftosaurus_detalle_tirano.webp" class="d-block w-100" alt="...">
      <div class="carousel-caption d-none d-md-block">
        <h5 class="bg-warning text-dark p-2">Detalles del juego</h5>
        <p class="bg-success bg-opacity-50 text-white p-3 rounded">Desarrollado por Antoine Bauza, Corentin Lebrat, Ludovic Maublanc, Theo Riviere</p>
        <p class="bg-success bg-opacity-50 text-white p-3 rounded">Ilustrado por Jiahui Eva Gao, Roman Kucharski, Vipin Alex Jacob</p>
        
      </div>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

<!-- botones -->
<div class="container d-flex justify-content-center gap-3 mt-5">
  <button type="button" class="btn btn-danger btn-lg" onclick="window.location.href='tablero.php'">Jugar</button>
  <button type="button" class="btn btn-primary btn-lg" onclick="window.location.href='puntaje.php'">Puntuación</button>  
</div>

<!-- Datos -->
  <div class="container mt-5 mb-5 bg-light text-black border border-3 border-secondary">
    <div class="row">
      <div class="col-sm-7 py-4 px-3 col-12"> 
        <h4 class="text-success text-center fw-bold">LUDICA STUDIOS</h5>  
         <p class="pt-3 px-4 fs-5">Ludica Studios trabaja para que los mejores juegos de mesa estén a tu alcance, ¡Sin instalaciones y sin gastos!</p>
      </div>
      <div class="col-sm-5 py-4 px-3 col-12"> 
        <p class="text-center"><img src="../Otros/fotos/Logo_color.jpg" class="rounded" style="width: 200px; height: 150px;" alt="Ejemplo"></p>
        <p class="text-center"><button type="button" class="btn btn-outline-success" onclick="window.location.href='ludica.php'">¡Visita nuestra web!</button></p>
      </div>
    </div>
  </div>

<!-- Info adicional -->
<div class="container px-4">
  <div class="row gx-5">
    <div class="col-sm-6 col-12">
     <div class="p-3 border bg-light border-3 border-secondary">
      <div class="card">
          <div class="card-body">
            <h5 class="card-title text-center fs-3 text-danger fw-bold">Estadísticas</h5>
            <p class="card-text"></p>
          </div>
          <img src="../Otros/fotos/Detalles.png" class="card-img-bottom" alt="ficha con información">
        </div>
     </div>
    </div>
    <div class="col-sm-6 col-12">
      <div class="p-3 border bg-light border-3 border-secondary">
        <div class="d-grid gap-2">
          <a href="../Otros/descargas/instruccionesE.pdf" download class="btn btn-danger" type="button">Descargar PDF con instrucciones en español</a>
          <button class="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#modalSumario">Sumario</button>
          <!-- MODAL DEL SUMARIO -->
          <div class="modal fade" id="modalSumario" tabindex="-1" aria-labelledby="modalSumarioLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title" id="modalSumarioLabel">Sumario</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body">
        Aquí va el contenido del sumario. Podés poner texto, imágenes, listas, o lo que necesites.
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>

    </div>
  </div>
</div>
        <!-- END -->
          <a href="../Otros/descargas/instruccionesI.pdf" download class="btn btn-primary" type="button">Descargar PDF con instrucciones en inglés</a>
        </div>

       <!-- ACORDEON -->
        <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Accordion Item #2
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the second item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Accordion Item #3
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the third item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</div>


<!-- footer -->
 <footer class="bd-footer py-5 mt-5 bg-light">
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-3 mb-3">
        <a class="d-inline-flex align-items-center mb-2 link-dark text-decoration-none" href="ludica.php" aria-label="Bootstrap">
          <img src="../Otros/fotos/Logo_color.jpg" alt="Usuario" width="40" height="40" class="rounded-circle me-auto">
          <span class="fs-5 ps-4">Ludica Studios</span>

        </a>
        <ul class="list-unstyled small text-muted">
          <li class="mb-2">Diseñado y construido con todo el esfuerzo de nuestro <a href="ludica.php">equipo</a> y con la ayuda de nuestros <a href="https://chatgpt.com"> contribuidores</a>.</li>
          <li class="mb-2">Actualmente v1.0.0.</li>
          <li class="mb-2">Actualizado por <a href="https://github.com/sebarosales5" target="_blank" rel="noopener">sebarosales5</a>.</li>
        </ul>
      </div>
      <div class="col-6 col-lg-4 offset-lg-1 mb-3">
        <h5>Links</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="ludica.php">Página de LudicaStudios </a></li>
          <li class="mb-2"><a href="https://github.com/sebarosales5">GitHub</a></li>
          <li class="mb-2"><a href="/docs/5.0/examples/">Instagram</a></li>
          <li class="mb-2"><a href="https://themes.getbootstrap.com/">Cuenta de X</a></li>
        </ul>
      </div>
      <div class="col-6 col-lg-4 mb-3">
        <h5>Ludica Studios</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="ludica.php">Pagina principal</a></li>
 <!-- 
          <li class="mb-2"><a href="...">PlaceHolder</a></li>
          <li class="mb-2"><a href="...">PlaceHolder</a></li>
          <li class="mb-2"><a href="...">PlaceHolder</a></li>
          -->
        </ul>
      </div>
       <!--

      <div class="col-6 col-lg-2 modificar los "4" por "2" en esta parte en las dos estructuras de arriba cuando descomentemos mb-3">
        <h5>Otros proyectos</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="https://github.com/twbs/bootstrap">Bootstrap 5</a></li>
          <li class="mb-2"><a href="https://github.com/twbs/bootstrap/tree/v4-dev">Bootstrap 4</a></li>
          <li class="mb-2"><a href="https://github.com/twbs/icons">Icons</a></li>
          <li class="mb-2"><a href="https://github.com/twbs/rfs">RFS</a></li>
          <li class="mb-2"><a href="https://github.com/twbs/bootstrap-npm-starter">npm starter</a></li>
        </ul>
      </div>

      <div class="col-6 col-lg-2 mb-3">
        <h5>Contribuir</h5>
        <ul class="list-unstyled">
          <li class="mb-2"><a href="https://github.com/twbs/bootstrap/issues">Issues</a></li>
          <li class="mb-2"><a href="https://github.com/twbs/bootstrap/discussions">Discussions</a></li>
          <li class="mb-2"><a href="https://github.com/sponsors/twbs">Corporate sponsors</a></li>
          <li class="mb-2"><a href="https://opencollective.com/bootstrap">Open Collective</a></li>
          <li class="mb-2"><a href="https://stackoverflow.com/questions/tagged/bootstrap-5">Stack Overflow</a></li>
        </ul>
      </div>

          -->

    </div>
  </div>
</footer>
    <!--  Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    </body>
    
</html>