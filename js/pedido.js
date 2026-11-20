// Página "Estado de tu pedido" (pedido.html?n=NUMERO).
// Muestra los pedidos enviados desde este dispositivo (se guardan en el navegador).
// Por ahora la confirmación y el aviso de "listo" llegan por WhatsApp;
// cuando exista el panel de administrador, estos pasos se van a actualizar solos.

(function() {
    const pedidos = cargarPedidos();
    const numeroBuscado = new URLSearchParams(location.search).get("n");
    const pedido = pedidos.find(function(p) {
        return p.numero === numeroBuscado;
    }) || pedidos[0];

    if (!pedido) {
        document.querySelector("#sinPedidos").hidden = false;
        return;
    }

    document.querySelector("#detallePedido").hidden = false;

    const texto = function(selector, valor) {
        document.querySelector(selector).textContent = valor;
    };

    texto("#numeroPedido", pedido.numero);
    const fecha = new Date(pedido.fecha);
    texto("#fechaPedido", "Enviado el " + fecha.toLocaleDateString("es-AR", { day: "numeric", month: "long" }) +
        " a las " + fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) + " hs");
    texto("#totalPedido", formatoPlata(pedido.total));
    texto("#pagoPedido", pedido.pago);
    texto("#nombrePedido", pedido.nombre);

    if (pedido.comentario) {
        texto("#comentarioPedido", pedido.comentario);
    } else {
        document.querySelector("#comentarioPedido").remove();
        document.querySelector("#comentarioPedidoTitulo").remove();
    }

    const lista = document.querySelector("#listaPedido");
    pedido.productos.forEach(function(producto) {
        const fila = document.createElement("li");
        fila.innerHTML = '<span class="lp-cantidad"></span><span class="lp-nombre"><span></span><small></small></span><span class="lp-subtotal"></span>';
        fila.querySelector(".lp-cantidad").textContent = producto.cantidad + " x";
        fila.querySelector(".lp-nombre span").textContent = producto.nombre;
        fila.querySelector(".lp-nombre small").textContent = "Art. " + producto.articulo;
        fila.querySelector(".lp-subtotal").textContent = formatoPlata(convertirPrecio(producto.precio) * producto.cantidad);
        lista.appendChild(fila);
    });

    function abrirWhatsApp(mensaje) {
        window.open("https://wa.me/" + WHATSAPP_PEDIDOS + "?text=" + encodeURIComponent(mensaje), "_blank", "noopener");
    }

    document.querySelector("#btnReenviar").addEventListener("click", function() {
        abrirWhatsApp(pedido.mensaje);
    });

    document.querySelector("#btnConsultar").addEventListener("click", function() {
        abrirWhatsApp("¡Hola " + NOMBRE_FARMACIA + "! Quería consultar por mi pedido N° " + pedido.numero + " a nombre de " + pedido.nombre + ".");
    });

    // Otros pedidos de este dispositivo
    const anteriores = pedidos.filter(function(p) {
        return p.numero !== pedido.numero;
    });

    if (anteriores.length > 0) {
        const listaAnteriores = document.querySelector("#listaAnteriores");
        document.querySelector("#pedidosAnteriores").hidden = false;

        anteriores.forEach(function(p) {
            const fila = document.createElement("li");
            const enlace = document.createElement("a");
            enlace.href = "pedido.html?n=" + encodeURIComponent(p.numero);
            enlace.innerHTML = "<strong></strong><span></span><b></b>";
            enlace.querySelector("strong").textContent = "Pedido N° " + p.numero;
            enlace.querySelector("span").textContent = new Date(p.fecha).toLocaleDateString("es-AR") + " · " +
                p.productos.reduce(function(t, x) { return t + x.cantidad; }, 0) + " productos";
            enlace.querySelector("b").textContent = formatoPlata(p.total);
            fila.appendChild(enlace);
            listaAnteriores.appendChild(fila);
        });
    }
})();
