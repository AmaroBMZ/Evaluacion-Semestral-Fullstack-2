"use strict";

// CATÁLOGO Y CARRITO (R.2, R.3, R.9, R.16, R.17): una sola fuente de productos.
datosListos.then(() => {
    const escapar = GZ.escapar;
    const mensaje = document.querySelector("#mensaje-tienda");
    const avisar = (texto) => { if (mensaje) mensaje.textContent = texto; };

    function actualizarContador() {
        const cantidad = GZ.carrito().reduce((suma, linea) => suma + linea.cantidad, 0);
        document.querySelectorAll(".contador").forEach((nodo) => { nodo.textContent = cantidad; });
    }

    function tarjeta(producto) {
        const url = "detalle.html?codigo=" + encodeURIComponent(producto.codigo);
        return `<!-- PRODUCTO: imagen, nombre, precio, disponibilidad y acceso al detalle. -->
            <article class="producto">
                <a class="producto-imagen" href="${url}"><img src="${GZ.imagen(producto.imagen)}" alt="${escapar(producto.nombre)}" width="640" height="480" loading="lazy"></a>
                <div class="producto-info">
                    <p class="etiqueta">${escapar(producto.categoria)}</p>
                    <h3><a href="${url}">${escapar(producto.nombre)}</a></h3>
                    <p>${escapar(producto.descripcion)}</p>
                    <div class="producto-base"><strong>${GZ.moneda(producto.precio)}</strong><span>${producto.stock > 0 ? "Disponible" : "Sin stock"}</span></div>
                    <button class="boton-principal" data-agregar="${escapar(producto.codigo)}" ${producto.stock === 0 ? "disabled" : ""}>Agregar al carrito</button>
                </div>
            </article>`;
    }

    // BÚSQUEDA: combinar nombre y categoría, ignorando tildes y mayúsculas.
    const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    function renderCatalogo() {
        const grilla = document.querySelector("[data-catalogo]");
        if (!grilla) return;
        const texto = normalizar(document.querySelector("#buscar-producto")?.value.trim() || "");
        const categoria = document.querySelector("#filtrar-categoria")?.value || "";
        let datos = GZ.productos().filter((p) => normalizar(p.nombre).includes(texto) && (!categoria || p.categoria === categoria));
        if (grilla.dataset.catalogo === "destacados") datos = datos.slice(0, 4);
        grilla.innerHTML = datos.length ? datos.map(tarjeta).join("") : '<p role="status">No hay productos que coincidan con tu búsqueda.</p>';
        const cantidad = document.querySelector("#cantidad-resultados");
        if (cantidad) cantidad.textContent = `${datos.length} productos`;
    }

    const categorias = document.querySelector("#filtrar-categoria");
    if (categorias) {
        categorias.innerHTML = '<option value="">Todas las categorías</option>' + [...new Set(GZ.productos().map((p) => p.categoria))].map((c) => `<option>${escapar(c)}</option>`).join("");
        categorias.addEventListener("change", renderCatalogo);
        document.querySelector("#buscar-producto").addEventListener("input", renderCatalogo);
    }

    // DETALLE: usar el código de la URL y explicar si el producto ya no existe.
    const detalle = document.querySelector("#detalle-producto");
    if (detalle) {
        const codigo = new URLSearchParams(location.search).get("codigo");
        const producto = GZ.productos().find((p) => p.codigo === codigo);
        detalle.innerHTML = producto ? `
            <div class="historia-imagen"><img src="${GZ.imagen(producto.imagen)}" alt="${escapar(producto.nombre)}" width="640" height="480"></div>
            <div class="historia-texto">
                <p class="etiqueta">${escapar(producto.categoria)}</p>
                <h1>${escapar(producto.nombre)}</h1>
                <p>${escapar(producto.descripcion)}</p>
                <p class="precio-detalle">${GZ.moneda(producto.precio)}</p>
                <p>Disponibilidad: ${producto.stock} unidades</p>
                <button class="boton-principal" data-agregar="${escapar(producto.codigo)}" ${producto.stock === 0 ? "disabled" : ""}>Agregar al carrito</button>
            </div>` : '<div class="historia-texto"><h1>Producto no encontrado</h1><p>Selecciona otro producto del catálogo.</p></div>';
    }

    // CARRITO: los precios se consultan al catálogo y el stock se revisa en cada cambio.
    function renderCarrito() {
        const contenedor = document.querySelector("#contenido-carrito");
        if (!contenedor) return;
        const lineas = GZ.carrito();
        const productos = GZ.productos();
        let total = 0;
        const filas = lineas.map((linea) => {
            const producto = productos.find((p) => p.codigo === linea.codigo);
            const subtotal = producto.precio * linea.cantidad;
            total += subtotal;
            return `<tr>
                <td><a href="detalle.html?codigo=${encodeURIComponent(producto.codigo)}">${escapar(producto.nombre)}</a></td>
                <td>${GZ.moneda(producto.precio)}</td>
                <td><label class="visualmente-oculto" for="cantidad-${escapar(producto.codigo)}">Cantidad de ${escapar(producto.nombre)}</label>
                    <input id="cantidad-${escapar(producto.codigo)}" class="cantidad-carrito" data-cantidad="${escapar(producto.codigo)}" type="number" min="1" max="${producto.stock}" step="1" value="${linea.cantidad}"></td>
                <td>${GZ.moneda(subtotal)}</td>
                <td><button class="boton-secundario" data-quitar="${escapar(producto.codigo)}" aria-label="Quitar ${escapar(producto.nombre)}">Quitar</button></td>
            </tr>`;
        }).join("");
        contenedor.innerHTML = lineas.length ? `<div class="tabla-scroll" role="region" aria-label="Productos en el carrito" tabindex="0">
            <table class="table"><caption>Productos seleccionados</caption><thead><tr><th scope="col">Producto</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Subtotal</th><th scope="col">Acción</th></tr></thead><tbody>${filas}</tbody></table></div>
            <p class="precio-detalle">Total: ${GZ.moneda(total)}</p>
            <button class="boton-secundario" id="vaciar-carrito">Vaciar carrito</button>` : '<p>Tu carrito está vacío. <a href="productos.html">Explorar productos</a>.</p>';
    }

    document.addEventListener("click", (evento) => {
        const agregar = evento.target.closest("[data-agregar]");
        const quitar = evento.target.closest("[data-quitar]");
        const vaciar = evento.target.closest("#vaciar-carrito");
        try {
            if (agregar) {
                const codigo = agregar.dataset.agregar;
                const cantidad = GZ.carrito().find((l) => l.codigo === codigo)?.cantidad || 0;
                GZ.cambiarCantidad(codigo, cantidad + 1);
                avisar("Producto agregado al carrito.");
            }
            if (quitar) GZ.cambiarCantidad(quitar.dataset.quitar, 0);
            if (vaciar && confirm("¿Vaciar todos los productos del carrito?")) {
                GZ.guardar("carrito", []);
                document.dispatchEvent(new Event("carrito-cambiado"));
            }
        } catch (error) { avisar(error.message); }
    });

    document.addEventListener("change", (evento) => {
        if (!evento.target.matches("[data-cantidad]")) return;
        try {
            const cantidad = Number(evento.target.value);
            if (!Number.isInteger(cantidad) || cantidad < 1) throw new Error("La cantidad mínima es 1. Usa Quitar para eliminar el producto.");
            GZ.cambiarCantidad(evento.target.dataset.cantidad, cantidad);
            avisar("Cantidad actualizada.");
        } catch (error) {
            avisar(error.message);
            renderCarrito();
        }
    });

    document.addEventListener("carrito-cambiado", () => { actualizarContador(); renderCarrito(); });
    window.addEventListener("storage", () => {
        try { actualizarContador(); renderCarrito(); renderCatalogo(); }
        catch (error) { avisar(error.message); }
    });
    actualizarContador();
    renderCatalogo();
    renderCarrito();
}).catch((error) => {
    const mensaje = document.querySelector("#mensaje-tienda");
    if (mensaje) mensaje.textContent = error.message;
});
