class Enemigo {
    constructor() {
        this.enemigo = document.createElement('div');
        this.enemigo.classList.add('enemigo', 'correr');
        document.body.appendChild(this.enemigo);

        // Posición inicial (derecha de la pantalla)
        this.enemigo.style.left = window.innerWidth + 'px';
        this.enemigo.style.bottom = '18%';
        this.velocidad = 1; // Velocidad a la que el enemigo se moverá hacia la izquierda
    }

    mover() {
        // Mueve el enemigo hacia la izquierda
        let posicionActual = parseInt(this.enemigo.style.left);
        this.enemigo.style.left = (posicionActual - this.velocidad) + 'px';

        // Elimina al enemigo cuando sale de la pantalla
        if (posicionActual + this.enemigo.offsetWidth < 0) {
            this.enemigo.remove();
        }
    }

    status() {
        return this.enemigo.getBoundingClientRect();
    }

    morir() {
        this.clean();
        this.enemigo.classList.add("morir");
        this.enemigo.addEventListener("animationend", () => {
            this.enemigo.remove(); // Elimina el enemigo del DOM al morir
        });
    }

    clean() {
        this.enemigo.classList.remove("correr");
        this.enemigo.classList.remove("morir");
    }
}

