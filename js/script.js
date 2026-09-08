
const productos = document.querySelectorAll(".card");

productos.forEach(function(producto) {

    const precioAnterior = producto.querySelector(".precio-anterior");
    const precioOferta = producto.querySelector(".precio-oferta");
    const descuento = producto.querySelector(".descuento");

    if (precioAnterior && precioOferta && descuento) {

        const anterior = parseFloat(
            precioAnterior.textContent.replace("$", "").replace(".", "")
        );

        const oferta = parseFloat(
            precioOferta.textContent.replace("$", "").replace(".", "")
        );

        const porcentaje = Math.round(
            ((anterior - oferta) / anterior) * 100
        );

        descuento.textContent = porcentaje + "% OFF";
    }

});

const botonesCarrito = document.querySelectorAll(".btn-primary");
botonesCarrito.forEach(function(boton) {
    boton.addEventListener("click", function() {
        console.log("Producto agregado");
            });

});