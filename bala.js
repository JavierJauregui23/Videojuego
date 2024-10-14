class Bala {
    constructor(x, y) {
        this.bala = document.createElement('div');
        this.bala.classList.add('bala');
        document.body.appendChild(this.bala);

        this.bala.style.left = `${x}px`;
        this.bala.style.top = `${y}px`;
        this.velocidad = 10;
    }

    mover() {
        let posicionActual = parseInt(this.bala.style.left);
        this.bala.style.left = (posicionActual + this.velocidad) + 'px';

        // Elimina la bala cuando sale de la pantalla
        if (posicionActual > window.innerWidth) {
            this.bala.remove(); // Eliminar el elemento de la pantalla
            return true; // Retorna true para indicar que debe eliminarse del array
        }
        return false; // Retorna false para indicar que debe permanecer
    }

    status() {
        return this.bala.getBoundingClientRect();
    }
}

