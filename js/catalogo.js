// Funciones para trabajar con el catálogo de js/productos.js
// y dibujar las tarjetas de productos.

// ---------- Revisión del catálogo ----------
// Si un N° de artículo está mal escrito o repetido, avisa en la consola (F12)
// y ese producto no se muestra, para que no se mezcle en los pedidos.
const CATALOGO = (function() {
    const vistos = new Set();

    return PRODUCTOS.filter(function(producto) {
        const articulo = String(producto.articulo || "");
        let problema = "";

        if (!/^\d{5}$/.test(articulo)) {
            problema = "el N° de artículo tiene que tener 5 dígitos (ej: 07001)";
        } else if (!FAMILIAS[articulo.slice(0, 2)]) {
            problema = "la familia " + articulo.slice(0, 2) + " no existe en FAMILIAS";
        } else if (articulo.slice(2) === "000") {
            problema = "el artículo 000 no es válido (empieza en 001)";
        } else if (vistos.has(articulo)) {
            problema = "el N° de artículo está repetido";
        } else if (!(producto.precio > 0)) {
            problema = "falta el precio";
        }

        if (problema) {
            console.warn("Producto no cargado (" + (producto.nombre || "sin nombre") + ", artículo " + articulo + "): " + problema);
            return false;
        }

        vistos.add(articulo);
        return true;
    });
})();

function buscarProducto(articulo) {
    return CATALOGO.find(function(producto) {
        return producto.articulo === articulo;
    });
}

function familiaDe(producto) {
    return FAMILIAS[producto.articulo.slice(0, 2)];
}

// Categorías del producto: la de su familia + las que tenga anotadas
function categoriasDe(producto) {
    const lista = [familiaDe(producto)].concat(producto.categorias || []);
    return lista.filter(function(categoria, indice) {
        return lista.indexOf(categoria) === indice;
    });
}

function estaEnOferta(producto) {
    return producto.precioAnterior > producto.precio;
}

function porcentajeDescuento(producto) {
    return Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100);
}

function formatoPlata(numero) {
    return "$" + Number(numero).toLocaleString("es-AR");
}

function nombreCompleto(producto) {
    return [producto.nombre, producto.presentacion].filter(Boolean).join(" ");
}

function productosDeCategoria(codigo) {
    return CATALOGO.filter(function(producto) {
        if (codigo === "ofertas") {
            return estaEnOferta(producto);
        }
        return categoriasDe(producto).includes(codigo);
    });
}

// Texto donde busca el buscador: nombre, marca, presentación y N° de artículo
function textoBusqueda(producto) {
    return [producto.nombre, producto.marca, producto.presentacion, producto.articulo, producto.ean]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

// ---------- Tarjeta de producto (grilla) ----------
function crearTarjetaProducto(producto) {
    const enOferta = estaEnOferta(producto);
    const columna = document.createElement("div");
    columna.className = "col-6 col-md-3";
    columna.innerHTML = `
        <div class="card h-100 tarjeta-producto">
            <div class="producto-imagen">
                ${enOferta ? '<span class="badge bg-danger oferta">OFERTA</span><span class="badge bg-warning text-dark descuento"></span>' : ""}
                <img class="card-img-top" alt="" loading="lazy">
            </div>
            <div class="card-body text-center">
                <p class="marca-producto"></p>
                <h3 class="card-title"></h3>
                <p class="presentacion-producto"></p>
                <p class="text-muted descripcion-producto"></p>
                ${enOferta ? '<p class="text-muted text-decoration-line-through mb-1 precio-anterior"></p>' : ""}
                <p class="fs-4 fw-bold precio-oferta"></p>
                <button class="btn btn-primary btn-agregar-carrito" type="button">Agregar</button>
                <p class="articulo-producto"></p>
            </div>
        </div>
    `;

    const tarjeta = columna.querySelector(".card");
    tarjeta.dataset.articulo = producto.articulo;
    tarjeta.dataset.busqueda = textoBusqueda(producto);

    // Los textos se cargan con textContent para que ningún dato rompa el HTML
    const imagen = columna.querySelector("img");
    imagen.src = producto.imagen;
    imagen.alt = nombreCompleto(producto);

    const marca = columna.querySelector(".marca-producto");
    if (producto.marca) {
        marca.textContent = producto.marca;
    } else {
        marca.remove();
    }

    columna.querySelector(".card-title").textContent = producto.nombre;
    const presentacion = columna.querySelector(".presentacion-producto");
    if (producto.presentacion) {
        presentacion.textContent = producto.presentacion;
    } else {
        presentacion.remove();
    }
    columna.querySelector(".descripcion-producto").textContent = producto.descripcion || "";
    columna.querySelector(".precio-oferta").textContent = formatoPlata(producto.precio);
    columna.querySelector(".articulo-producto").textContent = "Art. " + producto.articulo;

    if (enOferta) {
        columna.querySelector(".precio-anterior").textContent = formatoPlata(producto.precioAnterior);
        columna.querySelector(".descuento").textContent = porcentajeDescuento(producto) + "% OFF";
    }

    return columna;
}

// ---------- Tarjeta del carrusel de ofertas ----------
function crearTarjetaPromocion(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-promocion";
    tarjeta.dataset.articulo = producto.articulo;
    tarjeta.innerHTML = `
        <span class="etiqueta-producto">Oferta</span>
        <img alt="" loading="lazy">
        <h3></h3>
        <p></p>
        <div class="precios-promocion">
            <del></del>
            <strong></strong>
            <span></span>
        </div>
        <button type="button" class="btn btn-promocion-agregar">Agregar</button>
    `;

    const imagen = tarjeta.querySelector("img");
    imagen.src = producto.imagen;
    imagen.alt = nombreCompleto(producto);
    tarjeta.querySelector("h3").textContent = producto.nombre;
    tarjeta.querySelector("p").textContent = [producto.presentacion, producto.descripcion].filter(Boolean).join(" · ");
    tarjeta.querySelector("del").textContent = formatoPlata(producto.precioAnterior);
    tarjeta.querySelector("strong").textContent = formatoPlata(producto.precio);
    tarjeta.querySelector(".precios-promocion span").textContent = porcentajeDescuento(producto) + "% OFF";

    return tarjeta;
}

// ---------- Portada: destacados y carrusel ----------
(function() {
    const listaDestacados = document.querySelector("#listaDestacados");
    if (listaDestacados) {
        CATALOGO.filter(function(producto) {
            return producto.destacado;
        }).forEach(function(producto) {
            listaDestacados.appendChild(crearTarjetaProducto(producto));
        });
    }

    const pista = document.querySelector("#pistaPromociones");
    if (pista) {
        CATALOGO.filter(function(producto) {
            return producto.carrusel && estaEnOferta(producto);
        }).forEach(function(producto) {
            pista.appendChild(crearTarjetaPromocion(producto));
        });
    }
})();
