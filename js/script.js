
const contenedorCarrito = document.querySelector("#carrito");
const productos = document.querySelectorAll(".card");
const formularioBusqueda = document.querySelector("#formularioBusqueda");
const campoBusqueda = document.querySelector("#campoBusqueda");
const botonesAgregar = document.querySelectorAll(".btn-agregar-carrito");
const mensajeBusqueda = document.querySelector("#mensajeBusqueda");
const tarjetasProductos = Array.from(botonesAgregar)
    .map(function(boton) {
        return boton.closest(".card");
    })
    .filter(Boolean);

const CLAVE_CARRITO = "farmacia_carrito";
const carrito = cargarCarrito();

// ---------- Guardar el carrito en el navegador ----------
function cargarCarrito() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
        return Array.isArray(guardado) ? guardado : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // Si el navegador no deja guardar, el carrito sigue funcionando en memoria.
    }
}

// Evita que un nombre con < o > rompa el HTML del carrito
function escaparHtml(texto) {
    return String(texto).replace(/[&<>"']/g, function(c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

// ---------- Abrir y cerrar el carrito ----------
const panelCarrito = document.querySelector("#carrito");
const fondoCarrito = document.querySelector("#fondoCarrito");

function abrirCarrito() {
    mostrarCarrito();
    panelCarrito?.classList.add("abierto");
    fondoCarrito?.classList.add("abierto");
    document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
    panelCarrito?.classList.remove("abierto");
    fondoCarrito?.classList.remove("abierto");
    document.body.style.overflow = "";
}

document.querySelector("#btnAbrirCarrito")?.addEventListener("click", abrirCarrito);
document.querySelector("#btnCerrarCarrito")?.addEventListener("click", cerrarCarrito);
fondoCarrito?.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        cerrarCarrito();
    }
});

function convertirPrecio(texto) {
    return Number(String(texto).replace(/\$/g, "").replace(/\./g, "").replace(",", "."));
}

function obtenerNombreProducto(tarjeta) {
    return tarjeta.querySelector(".card-title")?.textContent.trim() ?? "";
}

function obtenerPrecioOferta(tarjeta) {
    return tarjeta.querySelector(".precio-oferta")?.textContent.trim() ?? "$0";
}

function obtenerImagenProducto(tarjeta) {
    return tarjeta.querySelector("img")?.getAttribute("src") ?? "";
}

function filtrarProductos() {
    if (!campoBusqueda) {
        return;
    }

    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    let cantidadCoincidencias = 0;

    tarjetasProductos.forEach(function(tarjeta) {
        const nombreProducto = obtenerNombreProducto(tarjeta).toLowerCase();
        const productoCoincide = nombreProducto.includes(textoBuscado);
        const contenedorCol = tarjeta.closest(".col-md-3");

        if (contenedorCol) {
            contenedorCol.hidden = !productoCoincide;
        }

        if (productoCoincide) {
            cantidadCoincidencias++;
        }
    });

    if (mensajeBusqueda) {
        mensajeBusqueda.hidden = cantidadCoincidencias > 0 || textoBuscado === "";
    }
}

if (formularioBusqueda) {
    formularioBusqueda.addEventListener("submit", function(event) {
        event.preventDefault();
        filtrarProductos();
    });
}

if (campoBusqueda) {
    campoBusqueda.addEventListener("input", filtrarProductos);
}

productos.forEach(function(producto) {
    const precioAnterior = producto.querySelector(".precio-anterior");
    const precioOferta = producto.querySelector(".precio-oferta");
    const descuento = producto.querySelector(".descuento");

    if (precioAnterior && precioOferta && descuento) {
        const anterior = convertirPrecio(precioAnterior.textContent);
        const oferta = convertirPrecio(precioOferta.textContent);
        const porcentaje = Math.round(((anterior - oferta) / anterior) * 100);

        descuento.textContent = porcentaje + "% OFF";
    }
});

function actualizarContadorCarrito() {
    const contador = document.querySelector("#contadorCarrito");

    if (!contador) {
        return;
    }

    const cantidadTotal = carrito.reduce(function(total, producto) {
        return total + producto.cantidad;
    }, 0);

    contador.textContent = cantidadTotal;
    contador.hidden = cantidadTotal === 0;
}

function actualizarBotonProducto(tarjeta, cantidad) {
    const boton = tarjeta.querySelector(".btn-agregar-carrito");

    if (!boton) {
        return;
    }

    if (cantidad === 0) {
        boton.classList.remove("control-cantidad");
        boton.textContent = "Agregar";
        return;
    }

    boton.classList.add("control-cantidad");
    boton.innerHTML = `
        <span class="btn-cantidad-restar" aria-label="Quitar una unidad">-</span>
        <span class="cantidad-producto">${cantidad}</span>
        <span class="btn-cantidad-sumar" aria-label="Agregar una unidad">+</span>
    `;
}

function actualizarBotonesProductos() {
    botonesAgregar.forEach(function(boton) {
        const tarjeta = boton.closest(".card");

        if (!tarjeta) {
            return;
        }

        const nombre = obtenerNombreProducto(tarjeta);
        const producto = carrito.find(function(item) {
            return item.nombre === nombre;
        });

        actualizarBotonProducto(tarjeta, producto ? producto.cantidad : 0);
    });
}

function mostrarCarrito() {
    const contenidoCarrito = document.querySelector("#contenidoCarrito");

    if (!contenidoCarrito) {
        return;
    }

    guardarCarrito();

    let contenido = "";
    let total = 0;

    if (carrito.length === 0) {
        contenido += '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(function(producto, indice) {
            const precio = convertirPrecio(producto.precio);
            total += precio * producto.cantidad;

            contenido += `
                <div class="producto-carrito">
                    <img src="${escaparHtml(producto.imagen)}" alt="${escaparHtml(producto.nombre)}">
                    <div class="info-producto-carrito">
                        <h3>${escaparHtml(producto.nombre)}</h3>
                        <p>${escaparHtml(producto.precio)}</p>
                        <div class="controles-carrito">
                            <button type="button" class="btn-restar" data-indice="${indice}">−</button>
                            <span>${producto.cantidad}</span>
                            <button type="button" class="btn-sumar" data-indice="${indice}">+</button>
                            <button type="button" class="btn-eliminar" data-indice="${indice}">✕</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    if (carrito.length > 0) {
        contenido += '<div class="carrito-total"><span>Total</span><strong>$' + total.toLocaleString("es-AR") + "</strong></div>";
    }
    contenidoCarrito.innerHTML = contenido;

    actualizarContadorCarrito();
    actualizarBotonesProductos();

    const botonesSumar = contenidoCarrito.querySelectorAll(".btn-sumar");
    botonesSumar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            const indice = Number(boton.dataset.indice);
            const producto = carrito[indice];

            if (producto) {
                producto.cantidad++;
                mostrarCarrito();
            }
        });
    });

    const botonesRestar = contenidoCarrito.querySelectorAll(".btn-restar");
    botonesRestar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            const indice = Number(boton.dataset.indice);
            const producto = carrito[indice];

            if (!producto) {
                return;
            }

            producto.cantidad--;

            if (producto.cantidad <= 0) {
                carrito.splice(indice, 1);
            }

            mostrarCarrito();
        });
    });

    const botonesEliminar = contenidoCarrito.querySelectorAll(".btn-eliminar");
    botonesEliminar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            const indice = Number(boton.dataset.indice);
            carrito.splice(indice, 1);
            mostrarCarrito();
        });
    });
}

function agregarProductoAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(function(producto) {
        return producto.nombre === nombre;
    });

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }

    mostrarCarrito();
}

botonesAgregar.forEach(function(boton) {
    boton.addEventListener("click", function(event) {
        const tarjeta = boton.closest(".card");

        if (!tarjeta) {
            return;
        }

        const nombre = obtenerNombreProducto(tarjeta);
        const producto = carrito.find(function(item) {
            return item.nombre === nombre;
        });

        if (event.target.closest(".btn-cantidad-restar")) {
            if (producto) {
                producto.cantidad--;

                if (producto.cantidad <= 0) {
                    carrito.splice(carrito.indexOf(producto), 1);
                }
            }

            mostrarCarrito();
            return;
        }

        if (event.target.closest(".btn-cantidad-sumar")) {
            if (producto) {
                producto.cantidad++;
            } else {
                agregarProductoAlCarrito(nombre, obtenerPrecioOferta(tarjeta), obtenerImagenProducto(tarjeta));
            }

            mostrarCarrito();
            return;
        }

        agregarProductoAlCarrito(nombre, obtenerPrecioOferta(tarjeta), obtenerImagenProducto(tarjeta));
    });
});

// ---------- Carrusel de ofertas ----------
const pistaPromociones = document.querySelector(".promociones-pista");

document.querySelectorAll(".boton-promocion").forEach(function(boton) {
    boton.addEventListener("click", function() {
        if (!pistaPromociones) {
            return;
        }

        const tarjeta = pistaPromociones.querySelector(".tarjeta-promocion");
        const paso = tarjeta ? tarjeta.offsetWidth + 18 : pistaPromociones.clientWidth;
        const direccion = boton.dataset.promoDireccion === "prev" ? -1 : 1;

        pistaPromociones.scrollBy({ left: paso * direccion, behavior: "smooth" });
    });
});

document.querySelectorAll(".tarjeta-promocion").forEach(function(tarjeta) {
    const anterior = tarjeta.querySelector(".precios-promocion del");
    const oferta = tarjeta.querySelector(".precios-promocion strong");
    const etiqueta = tarjeta.querySelector(".precios-promocion span");

    // Calcula el % OFF igual que en los productos destacados
    if (anterior && oferta && etiqueta) {
        const precioAnterior = convertirPrecio(anterior.textContent);
        const precioOferta = convertirPrecio(oferta.textContent);

        if (precioAnterior > 0) {
            etiqueta.textContent = Math.round(((precioAnterior - precioOferta) / precioAnterior) * 100) + "% OFF";
        }
    }

    // "Agregar" de las ofertas suma al mismo carrito
    tarjeta.querySelector(".btn-promocion-agregar")?.addEventListener("click", function() {
        const nombre = tarjeta.querySelector("h3")?.textContent.trim() ?? "";
        const precio = oferta?.textContent.trim() ?? "$0";
        const imagen = tarjeta.querySelector("img")?.getAttribute("src") ?? "";

        agregarProductoAlCarrito(nombre, precio, imagen);
    });
});

mostrarCarrito();
