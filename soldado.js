class Soldado {
    constructor() {
        // En lugar de usar un elemento existente, creamos un nuevo div para cada soldado.
        this.soldado = document.createElement("div");
        this.soldado.id = "soldado";
        this.soldado.classList.add("soldado", 'correr');
        document.body.appendChild(this.soldado);
        this.vivo = true;
        this.estaAtacando = false;
    }

    status() {
        return this.soldado.getBoundingClientRect();
    }

    correr() {
        this.clean();
        this.soldado.classList.add("correr");
    }

    saltar() {
        if (this.soldado.classList.contains("correr")) {
            this.clean();
            this.soldado.classList.add("saltar");
            this.saltando = true;  // Indicar que el soldado está saltando
            this.soldado.addEventListener("animationend", () => {
                this.saltando = false;  // Indicar que el soldado ha terminado de saltar
                this.correr();
            }, { once: true });  // Aseguramos que el evento se ejecute solo una vez
        }
    }

    atacar() {
        this.clean();
        this.soldado.classList.add("atacar");
        this.estaAtacando = true;
        this.soldado.addEventListener("animationend", () => {
            this.estaAtacando = false;
            this.correr();
        }, { once: true });

        // Verificar colisiones con enemigos mientras está atacando
        enemigos.forEach((enemigo, index) => {
            if (colision(this.status(), enemigo.status())) {
                enemigo.morir();  // Eliminar el enemigo si colisiona
                enemigos.splice(index, 1);  // Remover el enemigo del array
            }
        });
    }

    disparar() {
        let soldadoStatus = this.status();
        let bala = new Bala(soldadoStatus.right - 100, soldadoStatus.top + 180);
        balas.push(bala);  // Agrega la bala a un array global de balas
    }

    morir() {
        this.clean();
        this.soldado.classList.add("morir");
        this.soldado.addEventListener("animationend", () => {
            this.desaparecer(); // Elimina el enemigo del DOM al morir
        }, { once: true });
    }

    desaparecer() {
        this.soldado.style.display = 'none';  // Hacer que el soldado desaparezca de la pantalla
    }

    clean() {
        // Eliminar cualquier clase de animación anterior para evitar conflictos
        this.soldado.classList.remove("correr");
        this.soldado.classList.remove("saltar");
        this.soldado.classList.remove("atacar");
        this.soldado.classList.remove("morir");
    }
}
