

// Función principal del bucle del juego
function gameLoop() {
    if (!gameLoopActivo) return;
    balasAEliminar = [];
    enemigosAEliminar = [];
    obstaculosAEliminar = [];
    rayosAEliminar = []; 
        
    // Mover balas y verificar colisiones
    for (let balaIndex = balas.length - 1; balaIndex >= 0; balaIndex--) {
        const bala = balas[balaIndex];

        if (bala.mover()) {
            balasAEliminar.push(balaIndex);
            continue;
        }

        for (let enemigoIndex = 0; enemigoIndex < enemigos.length; enemigoIndex++) {
            const enemigo = enemigos[enemigoIndex];
            if (colision(bala.status(), enemigo.status())) {
                enemigo.morir();
                enemigosAEliminar.push(enemigoIndex);
                balasAEliminar.push(balaIndex);
                enemigosMuertos++;
                actualizarContadorEnemigos();
                break;
            }
        }
    }

    // Eliminar balas
    balasAEliminar.forEach(balaIndex => {
        const bala = balas[balaIndex];
        if (bala && bala.bala) {
            bala.bala.remove();
        }
        balas.splice(balaIndex, 1);
    });

    // Eliminar enemigos
    enemigosAEliminar.forEach(enemigoIndex => {
        const enemigo = enemigos[enemigoIndex];
        if (enemigo && enemigo.enemigoElement) {
            enemigo.enemigoElement.remove();
        }
        enemigos.splice(enemigoIndex, 1);
    });

    // Mover enemigos y detectar colisiones con el soldado
    for (let index = enemigos.length - 1; index >= 0; index--) {
        const enemigo = enemigos[index];
        enemigo.mover();

        if (parseInt(enemigo.enemigo.style.left) < -enemigo.enemigo.offsetWidth) {
            enemigos.splice(index, 1);
        }

        if (colision(soldado.status(), enemigo.status())) {
            if (soldado.vivo) {
                manejarMuerteSoldado();
                break;
            }
        }
    }

    // Mover obstáculos y detectar colisiones con el soldado
    for (let index = obstaculos.length - 1; index >= 0; index--) {
        const obstaculo = obstaculos[index];
        if (obstaculo.mover()) {
            obstaculosAEliminar.push(index);
        }

        if (colision(soldado.status(), obstaculo.status())) {
            if (!soldado.saltando) {  // Verificar si el soldado no está saltando
                manejarMuerteSoldado();
                obstaculo.remover();  // Hacer que el obstáculo desaparezca
                obstaculosAEliminar.push(index);
            }
            break;
        }
    
    
        obstaculosAEliminar.forEach(index => {
            obstaculos.splice(index, 1);
        });
    }

     // Mover rayos y detectar colisiones
for (let rayoIndex = rayos.length - 1; rayoIndex >= 0; rayoIndex--) {
    let rayo = rayos[rayoIndex];
    if (rayo.mover()) {
        rayosAEliminar.push(rayoIndex);
    }

    // Verificar colisión entre el rayo y el soldado
    if (colision(soldado.status(), rayo.status())) {
        manejarMuerteSoldado();  // Soldado muere al ser golpeado por un rayo
        rayosAEliminar.push(rayoIndex);
    }

    // Verificar colisión entre el rayo y los enemigos
    for (let enemigoIndex = 0; enemigoIndex < enemigos.length; enemigoIndex++) {
        const enemigo = enemigos[enemigoIndex];
        if (colision(enemigo.status(), rayo.status())) {
            enemigo.morir(); 
            enemigosAEliminar.push(enemigoIndex);
            rayosAEliminar.push(rayoIndex);
            break;
        }
    }
}

   // Eliminar rayos que salieron de la pantalla o colisionaron
    rayosAEliminar.forEach(index => {
    let rayo = rayos[index];
    if (rayo && rayo.rayo) {
        rayo.rayo.remove(); 
    }
    rayos.splice(index, 1);
});



    obstaculosAEliminar.forEach(index => {
        obstaculos.splice(index, 1);
    });

    requestAnimationFrame(gameLoop);
}

// Crear un nuevo enemigo y agregarlo al array de enemigos
function crearEnemigo() {
    let enemigo = new Enemigo();
    enemigos.push(enemigo);
    reproducirSonidoZombie();
    console.log("Enemigo creado");
}

// Crear un obstáculo y agregarlo al array de obstáculos
function crearObstaculo() {
    const obstaculo = new Obstaculo();
    obstaculos.push(obstaculo);
    console.log("Obstáculo creado");
}

function crearRayo() {
    rayo = new Rayo();
    rayos.push(rayo);
    reproducirSonidoRayo();
    console.log("Rayo creado");
}

function moverRayos() {
    rayos.forEach((rayo, index) => {
        if (rayo.mover()) {
            rayos.splice(index, 1);  // Eliminar rayo cuando sale de la pantalla
        }
    });
}

// Función para manejar la muerte del soldado
function manejarMuerteSoldado() {
    vidasSoldado--;
    actualizarVidasSoldado();
    if (vidasSoldado <= 0) {
        console.log("entra a vidas 0");
        soldado.morir();
        reproducirSonidoMuerte();
        detenerGameLoop();
    } else {
        reproducirSonidoMuerte();
        soldado.morir();
        console.log("El soldado ha muerto.");
        // Crear un nuevo soldado después de eliminar el anterior del DOM
        soldado.soldado.addEventListener("animationend", () => {
            setTimeout(function() {
                soldado = new Soldado();
                soldado.correr();  // Comienza la animación de correr del nuevo soldado
            }, 1000);
        }, { once: true });
    }
}


// Función para actualizar el contador de enemigos muertos
function actualizarContadorEnemigos() {
    let contadorEnemigos = document.getElementById("contadorEnemigos");
    contadorEnemigos.innerText = `Enemigos muertos: ${enemigosMuertos}`;
}

// Función para actualizar el contador de vidas del soldado
function actualizarVidasSoldado() {
    let vidasSoldadoElem = document.getElementById("vidasSoldado");
    vidasSoldadoElem.innerText = `Vidas del soldado: ${vidasSoldado}`;
}

// Función para detectar colisiones entre dos elementos
function colision(rect1, rect2) {
    return !(rect1.right-110 < rect2.left ||
             rect1.left +50 > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function detenerGameLoop() {
    gameLoopActivo = false;
    clearInterval(intervaloEnemigos);
    clearInterval(intervaloObstaculos);
    clearInterval(intervaloRayos);
    clearInterval(intervaloReloj);
    mostrarPantallaFin();
}
// Función para iniciar el juego
function iniciarJuego() {
    reproducirSonidoInicio();
    console.log("dentro de iniciar Juego");
    let inputNombre = document.getElementById('nombreJugadorInput').value;
    if (inputNombre.trim() === "") {
        alert("Por favor, ingresa tu nombre para jugar.");
        return;
    }
    nombreJugador = inputNombre;
    
    // Eliminar la pantalla de inicio
    document.getElementById('pantallaInicio').remove();

    reproducirMusicaFondo();
    
    // Mostrar el nombre del jugador en pantalla
    mostrarNombreJugador();

    // Iniciar el bucle del juego
    intervaloObstaculos= setInterval(crearObstaculo, 7000);
    intervaloEnemigos= setInterval(crearEnemigo, 5000);
    intervaloRayos= setInterval(crearRayo, Math.random() * (5000 - 1000) + 1000);
    gameLoopActivo = true;
    requestAnimationFrame(gameLoop);
    iniciarReloj(); 
}
    

// Función para mostrar el nombre del jugador en pantalla
function mostrarNombreJugador() {
    let nombreElem = document.createElement('div');
    nombreElem.id = "nombreJugadorDisplay";
    nombreElem.innerText = `Jugador: ${nombreJugador}`;
    document.body.appendChild(nombreElem);
}

function mostrarPantallaFin() {
    console.log("Mostrando pantalla de fin");

    let pantallaFin = document.createElement('div');
    pantallaFin.id = 'pantallaFin';

    let titulo = document.createElement('h1');
    titulo.textContent = "¡Juego Terminado!";

    let mensaje = document.createElement('p');
    mensaje.textContent = `Jugador: ${nombreJugador} - Puntaje: ${enemigosMuertos}`;

    // Contenedor para los botones
    let contenedorBotones = document.createElement('div');
    contenedorBotones.id = 'contenedorBotones';

    let botonReiniciar = document.createElement('button');
    botonReiniciar.textContent = "Reiniciar";
    botonReiniciar.addEventListener('click', reiniciarJuego);

    let botonSalir = document.createElement('button');
    botonSalir.textContent = "Salir";
    botonSalir.addEventListener('click', salirDelJuego);

    // Añadir los botones al contenedor
    contenedorBotones.appendChild(botonReiniciar);
    contenedorBotones.appendChild(botonSalir);

    // Añadir los elementos a la pantalla de fin
    pantallaFin.appendChild(titulo);
    pantallaFin.appendChild(mensaje);
    pantallaFin.appendChild(contenedorBotones);

    document.body.appendChild(pantallaFin);
}


function reiniciarJuego() {
    location.reload(); // Recarga la página para reiniciar el juego
}

function salirDelJuego() {
    window.close(); // Cierra la ventana (puede no funcionar en todos los navegadores)
}
function reproducirSonidoDisparar() {
    const sonidoDisparar = document.getElementById('sonidoDisparar');
    sonidoDisparar.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoDisparar.volume = 1;
    sonidoDisparar.play();
}

function reproducirSonidoInicio() {
    let sonidoInicio = document.getElementById('sonidoInicio');
    sonidoInicio.volume= 0.3;
    sonidoInicio.play().catch(function(error) {
        console.log("La reproducción automática fue bloqueada, esperando interacción del usuario.");

        // Mostrar mensaje solicitando interacción para habilitar el audio
        document.getElementById('pantallaInicio').addEventListener('click', () => {
            sonidoInicio.play();
        }, { once: true });
    });
}

function reproducirMusicaFondo() {
    let musicaFondo = document.getElementById('musicaFondo');
    musicaFondo.volume = 0.2;  // Ajusta el volumen si lo necesitas
    musicaFondo.play().catch(function(error) {
        console.log("La reproducción automática fue bloqueada para la música de fondo.");
    });
}

function reproducirSonidoRayo() {
    const sonidoRayo = document.getElementById('sonidoRayo');
    //sonidoDisparar.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoRayo.volume = 1;
    sonidoRayo.play();
}

function reproducirSonidoZombie() {
    const sonidoZombie = document.getElementById('sonidoZombie');
    sonidoDisparar.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoZombie.volume = 1;
    sonidoZombie.play();
    setTimeout(() => {
        sonidoZombie.currentTime = 0; // Reinicia el sonido otra vez
        sonidoZombie.play();
    }, 1000); // Reproduce el sonido otra vez después de 1 segundo
}

function reproducirSonidoMuerte() {
    const sonidoMuerte = document.getElementById('sonidoMuerte');
    //sonidoDisparar.currentTime = 0; // Reinicia el sonido desde el principio
    sonidoMuerte.volume = 1;
    sonidoMuerte.play();
}

let tiempoRestante = 3 * 60; // 3 minutos en segundos
let intervaloReloj;

function iniciarReloj() {
    intervaloReloj = setInterval(() => {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            mostrarReloj(); // Actualizar la visualización del reloj
        } else {
            clearInterval(intervaloReloj);
            gameLoopActivo = false; // Detener el juego
            mostrarPantallaFin(); // Mostrar la pantalla de fin
        }
    }, 1000);
}

function mostrarReloj() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    document.getElementById('relojJuego').textContent = 
        `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

