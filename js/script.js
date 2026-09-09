
const contenedorCarrito = document.querySelector("#carrito");
const productos = document.querySelectorAll(".card");

function convertirPrecio(texto) {
    return Number(texto.replace("$", "").replace(/\./g, "").replace(",", "."));
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

const carrito = [];

function mostrarCarrito() {
    let contenido = "<h2>Carrito</h2>";
    let total = 0;

    carrito.forEach(function(producto, indice) {
        total += convertirPrecio(producto.precio);
        contenido += producto.nombre + " - " + producto.precio;
        contenido += ' <button type="button" data-indice="' + indice + '">Eliminar</button><br>';
    });

    contenido += "<strong>Total: $" + total.toLocaleString("es-AR") + "</strong>";
    contenedorCarrito.innerHTML = contenido;

    const botonesEliminar = contenedorCarrito.querySelectorAll("button");
    botonesEliminar.forEach(function(boton) {
        boton.addEventListener("click", function() {
            carrito.splice(Number(boton.dataset.indice), 1);
            mostrarCarrito();
        });
    });
}

const botonesCarrito = document.querySelectorAll(".btn-agregar-carrito");
botonesCarrito.forEach(function(boton) {
    boton.addEventListener("click", function() {
        const tarjeta = boton.closest(".card");
        const nombre = tarjeta.querySelector(".card-title").textContent.trim();
        const precio = tarjeta.querySelector(".precio-oferta").textContent.trim();

        carrito.push({
            nombre: nombre,
            precio: precio
        });

        mostrarCarrito();
    });
});
