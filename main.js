
//Inicializar arrays globales para enemigos y balas
let enemigosMuertos = 0;
let vidasSoldado = 3;
let enemigos = [];
let balas = [];
let soldado = new Soldado();
let balasAEliminar = [];
let enemigosAEliminar = [];
let obstaculos = [];
let obstaculosAEliminar = [];
let gameLoopActivo = false;
let rayos = [];
let rayosAEliminar = [];
let nombreJugador = "";
let intervaloEnemigos;
let intervaloObstaculos;
let intervaloRayos;

window.addEventListener('load', () => {
    reproducirSonidoInicio(); // Intenta reproducir el sonido automáticamente
});

document.getElementById('btnJugar').addEventListener('click', iniciarJuego);

// Event listeners para acciones del soldado
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') soldado.saltar();
    if (e.key === 'a') soldado.atacar();
    if (e.key === 'd') {
         soldado.disparar();
         reproducirSonidoDisparar();
    }
});

// Event listeners para mover al soldado
document.addEventListener('keydown', (e) => {
    let soldadoStatus = soldado.status();
    let posicionActual = parseInt(soldado.soldado.style.left) || soldadoStatus.left;

    if (e.key === 'ArrowRight' && soldadoStatus.right < window.innerWidth) {
        soldado.soldado.style.left = posicionActual + 20 + 'px';
    }

    if (e.key === 'ArrowLeft' && soldadoStatus.left > 0) {
        soldado.soldado.style.left = posicionActual - 20 + 'px';
    }
});


