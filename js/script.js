
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

const carrito = [];

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

    let contenido = "<h2>Carrito</h2>";
    let total = 0;

    if (carrito.length === 0) {
        contenido += "<p>Tu carrito está vacío.</p>";
    } else {
        carrito.forEach(function(producto, indice) {
            const precio = convertirPrecio(producto.precio);
            total += precio * producto.cantidad;

            contenido += `
                <div class="producto-carrito">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="info-producto-carrito">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.precio}</p>
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

    contenido += "<strong>Total: $" + total.toLocaleString("es-AR") + "</strong>";
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

actualizarBotonesProductos();
