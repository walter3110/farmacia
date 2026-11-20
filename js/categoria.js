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

    const productos = productosDeCategoria(codigo);

    if (productos.length === 0) {
        vacio.hidden = false;
        return;
    }

    // Misma tarjeta que en la portada (js/catalogo.js)
    productos.forEach(function(producto) {
        lista.appendChild(crearTarjetaProducto(producto));
    });
})();
