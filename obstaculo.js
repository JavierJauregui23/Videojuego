class Obstaculo {
    constructor() {
        this.obstaculo = document.createElement('div');
        this.obstaculo.classList.add('obstaculo');
        document.body.appendChild(this.obstaculo);
        
        // Posición inicial fuera de la pantalla (a la derecha)
        this.obstaculo.style.left = window.innerWidth + 'px';
        this.obstaculo.style.bottom = '100px';
    }

    mover() {
        let posicionActual = parseInt(this.obstaculo.style.left);
        // Mover la trinchera a la izquierda
        this.obstaculo.style.left = (posicionActual - 5) + 'px';

        // Verificar si salió de la pantalla
        if (posicionActual < -this.obstaculo.offsetWidth) {
            this.obstaculo.remove();  // Eliminar del DOM
            return true;  // Indicar que debe ser eliminada
        }
        return false;
    }

    remover(){
        this.obstaculo.remove();
    }
    status() {
        return this.obstaculo.getBoundingClientRect();
    }

    desaparecer() {
        this.obstaculo.style.display = 'none';  // Hacer que el soldado desaparezca de la pantalla
    }

}