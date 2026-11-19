// Arma la página de una categoría según la dirección: categoria.html?c=bebes
// Se carga ANTES de script.js, así el carrito y el buscador encuentran los productos.

(function() {
    const codigo = new URLSearchParams(location.search).get("c") || "";
    const categoria = CATEGORIAS[codigo];

    const titulo = document.querySelector("#tituloCategoria");
    const descripcion = document.querySelector("#descripcionCategoria");
    const migaActual = document.querySelector("#migaCategoria");
    const lista = document.querySelector("#listaCategoria");
    const vacio = document.querySelector("#categoriaVacia");

    // Marca en el menú la categoría en la que estamos
    document.querySelectorAll(".enlace-categoria").forEach(function(enlace) {
        if (enlace.dataset.categoria === codigo) {
            enlace.classList.add("activo");
            enlace.setAttribute("aria-current", "page");
        }
    });

    if (!categoria) {
        document.title = "Categoría no encontrada | Farmacia Herrera Acosta";
        titulo.textContent = "Categoría no encontrada";
        descripcion.textContent = "Elegí una categoría del menú para ver sus productos.";
        migaActual.textContent = "Categoría";
        vacio.hidden = false;
        return;
    }

    document.title = categoria.nombre + " | Farmacia Herrera Acosta";
    titulo.textContent = categoria.nombre;
    descripcion.textContent = categoria.descripcion;
    migaActual.textContent = categoria.nombre;

    const productos = PRODUCTOS.filter(function(producto) {
        if (codigo === "ofertas") {
            return producto.precioAnterior > producto.precio;
        }
        return producto.categorias.includes(codigo);
    });

    if (productos.length === 0) {
        vacio.hidden = false;
        return;
    }

    const plata = function(n) {
        return "$" + n.toLocaleString("es-AR");
    };

    // Misma estructura de tarjeta que en la página principal,
    // así funcionan igual el botón "Agregar", el % OFF y el buscador.
    productos.forEach(function(producto) {
        const enOferta = producto.precioAnterior > producto.precio;
        const columna = document.createElement("div");
        columna.className = "col-6 col-md-3";
        columna.innerHTML = `
            <div class="card h-100">
                <div class="producto-imagen">
                    ${enOferta ? '<span class="badge bg-danger oferta">OFERTA</span><span class="badge bg-warning text-dark descuento"></span>' : ""}
                    <img class="card-img-top" alt="">
                </div>
                <div class="card-body text-center">
                    <h3 class="card-title"></h3>
                    <p class="text-muted descripcion-producto"></p>
                    ${enOferta ? '<p class="text-muted text-decoration-line-through mb-1 precio-anterior"></p>' : ""}
                    <p class="fs-4 fw-bold precio-oferta"></p>
                    <button class="btn btn-primary btn-agregar-carrito" type="button">Agregar</button>
                </div>
            </div>
        `;

        // Los textos se cargan con textContent para que ningún dato rompa el HTML
        const imagen = columna.querySelector("img");
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        columna.querySelector(".card-title").textContent = producto.nombre;
        columna.querySelector(".descripcion-producto").textContent = producto.descripcion;
        columna.querySelector(".precio-oferta").textContent = plata(producto.precio);
        if (enOferta) {
            columna.querySelector(".precio-anterior").textContent = plata(producto.precioAnterior);
        }

        lista.appendChild(columna);
    });
})();
