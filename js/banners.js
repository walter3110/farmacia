// Banner grande de la portada: cambia solo cada 5 segundos.
// Se puede mover con las flechas, los puntitos o deslizando el dedo en el celular.
// Se frena mientras el mouse está encima.

(function() {
    const carrusel = document.querySelector("#carruselPrincipal");

    if (!carrusel) {
        return;
    }

    const diapositivas = Array.from(carrusel.querySelectorAll(".diapositiva"));
    const contenedorPuntos = carrusel.querySelector(".carrusel-puntos");
    const TIEMPO = 5000;
    const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let actual = 0;
    let temporizador = null;

    // Un puntito por cada banner
    const puntos = diapositivas.map(function(diapositiva, indice) {
        const punto = document.createElement("button");
        punto.type = "button";
        punto.className = "carrusel-punto";
        punto.setAttribute("role", "tab");
        punto.setAttribute("aria-label", "Banner " + (indice + 1));
        punto.addEventListener("click", function() {
            mostrar(indice);
            reiniciar();
        });
        contenedorPuntos.appendChild(punto);
        return punto;
    });

    function mostrar(indice) {
        actual = (indice + diapositivas.length) % diapositivas.length;

        diapositivas.forEach(function(diapositiva, i) {
            const visible = i === actual;
            diapositiva.classList.toggle("activa", visible);
            diapositiva.setAttribute("aria-hidden", visible ? "false" : "true");
            diapositiva.tabIndex = visible ? 0 : -1;
        });

        puntos.forEach(function(punto, i) {
            punto.classList.toggle("activo", i === actual);
            punto.setAttribute("aria-selected", i === actual ? "true" : "false");
        });
    }

    function siguiente() {
        mostrar(actual + 1);
    }

    function anterior() {
        mostrar(actual - 1);
    }

    function iniciar() {
        if (sinAnimaciones || diapositivas.length < 2) {
            return;
        }
        detener();
        temporizador = setInterval(siguiente, TIEMPO);
    }

    function detener() {
        clearInterval(temporizador);
        temporizador = null;
    }

    function reiniciar() {
        detener();
        iniciar();
    }

    carrusel.querySelector(".carrusel-flecha.siguiente").addEventListener("click", function() {
        siguiente();
        reiniciar();
    });

    carrusel.querySelector(".carrusel-flecha.anterior").addEventListener("click", function() {
        anterior();
        reiniciar();
    });

    // Pausa con el mouse encima o al navegar con teclado
    carrusel.addEventListener("mouseenter", detener);
    carrusel.addEventListener("mouseleave", iniciar);
    carrusel.addEventListener("focusin", detener);
    carrusel.addEventListener("focusout", iniciar);

    // Pausa cuando la pestaña no se está viendo
    document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
            detener();
        } else {
            iniciar();
        }
    });

    // Deslizar con el dedo en el celular
    let inicioX = null;

    carrusel.addEventListener("touchstart", function(event) {
        inicioX = event.touches[0].clientX;
        detener();
    }, { passive: true });

    carrusel.addEventListener("touchend", function(event) {
        if (inicioX === null) {
            return;
        }

        const distancia = event.changedTouches[0].clientX - inicioX;

        if (Math.abs(distancia) > 40) {
            if (distancia < 0) {
                siguiente();
            } else {
                anterior();
            }
        }

        inicioX = null;
        iniciar();
    });

    mostrar(0);
    iniciar();
})();
