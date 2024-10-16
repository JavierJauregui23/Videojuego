class Rayo {
    constructor() {
        this.rayo = document.createElement('div');
        this.rayo.classList.add('rayo');
        document.body.appendChild(this.rayo);

        // Posición inicial fuera de la pantalla (arriba)
        this.rayo.style.top = '-70px'; // Comienza por encima de la pantalla
        this.rayo.style.left = Math.floor(Math.random() * (window.innerWidth - this.rayo.offsetWidth)) + 'px';
    }

    mover() { 
         let posicionActual = parseInt(this.rayo.style.top);
    
        // Mover el rayo hacia abajo
        this.rayo.style.top = (posicionActual + 10) + 'px'; // Ajusta la velocidad de caída
    
        // Verificar si salió de la pantalla por la parte inferior
        if (posicionActual > window.innerHeight) {
            this.remover();  // Eliminar del DOM si sale de la pantalla
            return true;  // Indicar que debe ser eliminado
        }
        return false;
    }

    remover() {
        if (this.rayo && this.rayo.parentElement) {
            this.rayo.remove();  // Eliminar el rayo del DOM
        }
    }

    status() {
        return this.rayo.getBoundingClientRect();
    }
}
