// ========== DATOS DE LA FARMACIA (cambiar acá) ==========
// Número de WhatsApp que recibe los pedidos, en formato internacional sin "+", sin 0 y sin 15.
// Ejemplo Buenos Aires: 54 9 11 + número  ->  "5491112345678"
const WHATSAPP_PEDIDOS = "5491167568029";
const NOMBRE_FARMACIA = "Farmacia Herrera Acosta";
const FORMAS_DE_PAGO = [
    "Efectivo al retirar",
    "Débito o crédito al retirar",
    "Transferencia / Mercado Pago"
];
// ========================================================


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
    document.body.classList.add("carrito-abierto");
    panelCarrito?.classList.add("abierto");
    fondoCarrito?.classList.add("abierto");
    document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
    document.body.classList.remove("carrito-abierto");
    panelCarrito?.classList.remove("abierto");
    fondoCarrito?.classList.remove("abierto");
    document.body.style.overflow = "";
}

document.querySelector("#btnAbrirCarrito")?.addEventListener("click", abrirCarrito);

// Barra flotante "Ver carrito" (en el celular, cuando hay productos)
const barraCarrito = document.createElement("button");
barraCarrito.type = "button";
barraCarrito.className = "barra-carrito";
barraCarrito.innerHTML = '<span class="barra-carrito-info"></span><span class="barra-carrito-ver">Ver carrito</span>';
barraCarrito.addEventListener("click", abrirCarrito);
document.body.appendChild(barraCarrito);

// Aviso "Agregado al carrito"
const avisoAgregado = document.createElement("div");
avisoAgregado.className = "aviso-agregado";
avisoAgregado.setAttribute("role", "status");
avisoAgregado.innerHTML = '<span></span><button type="button">Ver carrito</button>';
avisoAgregado.querySelector("button").addEventListener("click", function() {
    avisoAgregado.classList.remove("visible");
    abrirCarrito();
});
document.body.appendChild(avisoAgregado);
let temporizadorAviso = null;

function avisarAgregado(nombre) {
    avisoAgregado.querySelector("span").textContent = "✓ " + nombre + " agregado";
    avisoAgregado.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function() {
        avisoAgregado.classList.remove("visible");
    }, 2500);
}

// Botón "Seguir comprando" al final del carrito
const botonSeguir = document.createElement("button");
botonSeguir.type = "button";
botonSeguir.className = "btn-seguir-comprando";
botonSeguir.textContent = "Seguir comprando";
botonSeguir.addEventListener("click", cerrarCarrito);
panelCarrito?.appendChild(botonSeguir);
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

    const cantidadAnterior = Number(contador.textContent) || 0;

    const totalPlata = carrito.reduce(function(total, producto) {
        return total + convertirPrecio(producto.precio) * producto.cantidad;
    }, 0);
    barraCarrito.querySelector(".barra-carrito-info").textContent =
        "🛒 " + cantidadTotal + (cantidadTotal === 1 ? " producto" : " productos") + " · $" + totalPlata.toLocaleString("es-AR");
    barraCarrito.classList.toggle("visible", cantidadTotal > 0);
    document.body.classList.toggle("con-barra-carrito", cantidadTotal > 0);

    contador.textContent = cantidadTotal;
    contador.hidden = cantidadTotal === 0;

    // Si se agregó algo, el contador "late" para que se note
    if (cantidadTotal > cantidadAnterior) {
        contador.classList.remove("latido");
        void contador.offsetWidth;
        contador.classList.add("latido");
    }
}

// Dibuja un botón como "Agregar" o como "− cantidad +"
function dibujarBotonCantidad(boton, cantidad) {
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

function cantidadEnCarrito(nombre) {
    const producto = carrito.find(function(item) {
        return item.nombre === nombre;
    });

    return producto ? producto.cantidad : 0;
}

function actualizarBotonesProductos() {
    // Productos destacados
    botonesAgregar.forEach(function(boton) {
        const tarjeta = boton.closest(".card");

        if (tarjeta) {
            dibujarBotonCantidad(boton, cantidadEnCarrito(obtenerNombreProducto(tarjeta)));
        }
    });

    // Ofertas del carrusel
    document.querySelectorAll(".tarjeta-promocion").forEach(function(tarjeta) {
        const nombre = tarjeta.querySelector("h3")?.textContent.trim() ?? "";
        dibujarBotonCantidad(tarjeta.querySelector(".btn-promocion-agregar"), cantidadEnCarrito(nombre));
    });
}

// Suma o resta según dónde se tocó el botón ("+", "−" o "Agregar")
function manejarClicCantidad(event, nombre, precio, imagen) {
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

    if (producto) {
        producto.cantidad++;
        mostrarCarrito();
        avisarAgregado(nombre);
        return;
    }

    agregarProductoAlCarrito(nombre, precio, imagen);
    avisarAgregado(nombre);
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

    const formPedido = document.querySelector("#formPedido");
    if (formPedido) {
        formPedido.hidden = carrito.length === 0;
    }

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

        manejarClicCantidad(
            event,
            obtenerNombreProducto(tarjeta),
            obtenerPrecioOferta(tarjeta),
            obtenerImagenProducto(tarjeta)
        );
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
    tarjeta.querySelector(".btn-promocion-agregar")?.addEventListener("click", function(event) {
        const nombre = tarjeta.querySelector("h3")?.textContent.trim() ?? "";
        const precio = oferta?.textContent.trim() ?? "$0";
        const imagen = tarjeta.querySelector("img")?.getAttribute("src") ?? "";

        manejarClicCantidad(event, nombre, precio, imagen);
    });
});

mostrarCarrito();

// ========== ENVIAR PEDIDO POR WHATSAPP ==========
(function() {
    const form = document.querySelector("#formPedido");

    if (!form) {
        return;
    }

    const CLAVE_DATOS = "farmacia_datos_cliente";
    const nombre = form.querySelector("#pedidoNombre");
    const telefono = form.querySelector("#pedidoTelefono");
    const pago = form.querySelector("#pedidoPago");
    const comentario = form.querySelector("#pedidoComentario");
    const error = form.querySelector("#errorPedido");
    const enviado = form.querySelector("#pedidoEnviado");

    FORMAS_DE_PAGO.forEach(function(forma) {
        const opcion = document.createElement("option");
        opcion.value = forma;
        opcion.textContent = forma;
        pago.appendChild(opcion);
    });

    // Recordar nombre y teléfono para la próxima compra
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_DATOS)) || {};
        nombre.value = datos.nombre || "";
        telefono.value = datos.telefono || "";
        if (FORMAS_DE_PAGO.includes(datos.pago)) {
            pago.value = datos.pago;
        }
    } catch (e) {
        // sin datos guardados
    }

    function mostrarError(texto, campo) {
        error.textContent = texto;
        error.hidden = false;
        campo?.focus();
    }

    function numeroPedido() {
        const ahora = new Date();
        const dos = function(n) { return String(n).padStart(2, "0"); };
        return dos(ahora.getDate()) + dos(ahora.getMonth() + 1) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    }

    function armarMensaje(numero) {
        let total = 0;
        const lineas = carrito.map(function(producto) {
            const subtotal = convertirPrecio(producto.precio) * producto.cantidad;
            total += subtotal;
            return "• " + producto.cantidad + " x " + producto.nombre + " — $" + subtotal.toLocaleString("es-AR");
        });

        const partes = [
            "¡Hola " + NOMBRE_FARMACIA + "! Quiero hacer este pedido:",
            "",
            "*Pedido N° " + numero + "*",
            lineas.join("\n"),
            "",
            "*Total: $" + total.toLocaleString("es-AR") + "*",
            "",
            "Nombre: " + nombre.value.trim(),
            "Teléfono: " + telefono.value.trim(),
            "Pago: " + pago.value,
            "Entrega: Retiro en el local"
        ];

        if (comentario.value.trim()) {
            partes.push("Comentario: " + comentario.value.trim());
        }

        return partes.join("\n");
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        error.hidden = true;

        if (carrito.length === 0) {
            return mostrarError("Tu carrito está vacío.");
        }
        if (nombre.value.trim().length < 2) {
            return mostrarError("Escribí tu nombre para saber de quién es el pedido.", nombre);
        }
        if (telefono.value.replace(/\D/g, "").length < 8) {
            return mostrarError("Escribí un teléfono válido para poder avisarte.", telefono);
        }

        try {
            localStorage.setItem(CLAVE_DATOS, JSON.stringify({
                nombre: nombre.value.trim(),
                telefono: telefono.value.trim(),
                pago: pago.value
            }));
        } catch (e) {
            // no se pudo guardar, no pasa nada
        }

        const url = "https://wa.me/" + WHATSAPP_PEDIDOS + "?text=" + encodeURIComponent(armarMensaje(numeroPedido()));
        window.open(url, "_blank", "noopener");
        enviado.hidden = false;
    });

    form.querySelector("#btnVaciarCarrito").addEventListener("click", function() {
        carrito.splice(0, carrito.length);
        comentario.value = "";
        enviado.hidden = true;
        mostrarCarrito();
        cerrarCarrito();
    });
})();
