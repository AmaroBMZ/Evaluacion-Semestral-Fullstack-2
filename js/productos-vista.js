// Plantillas compartidas: todas las tarjetas y detalles usan los datos del producto.
// Este archivo no contiene productos individuales ni guarda datos.

function cargarCategoriasCatalogo() {
    const selector = document.getElementById("categoria");
    if (!selector) return;
    selector.innerHTML = '<option value="">Todas las categor&iacute;as</option>' + categorias.map(function (categoria) {
        return '<option value="' + escapar(categoria) + '">' + escapar(categoria) + '</option>';
    }).join("");
}

function tarjetaProducto(producto) {
    return '<article class="card"><a href="' + enlaceDetalle(producto.codigo) + '">' +
        '<img class="foto-producto" src="' + escapar(imagenSegura(producto.imagen)) + '" alt="' + escapar(producto.nombre) + '" loading="lazy" width="640" height="420"></a>' +
        '<div class="card-body"><p class="categoria">' + escapar(producto.categoria) + '</p><h3 class="h5">' + escapar(producto.nombre) + '</h3>' +
        '<p class="precio">' + dinero(producto.precio) + '</p><p>' + (producto.stock > 0 ? "Disponibles: " + producto.stock : "Agotado") + '</p>' +
        '<a class="btn btn-outline-dark" href="' + enlaceDetalle(producto.codigo) + '">Ver detalle</a> ' +
        '<button class="btn boton-verde" data-agregar="' + escapar(producto.codigo) + '" ' + (producto.stock === 0 ? "disabled" : "") + '>Añadir al carrito</button></div></article>';
}

// La misma función dibuja el inicio y el catálogo, con filtros opcionales.
function mostrarCatalogo() {
    const contenedor = document.getElementById("lista-productos");
    if (!contenedor) return;
    const buscador = document.getElementById("buscar");
    const filtro = document.getElementById("categoria");
    const texto = buscador ? buscador.value.trim().toLocaleLowerCase("es") : "";
    const categoria = filtro ? filtro.value : "";
    const lista = datos.productos.filter(function (producto) {
        return producto.nombre.toLocaleLowerCase("es").includes(texto) && (!categoria || producto.categoria === categoria);
    });
    contenedor.innerHTML = lista.map(tarjetaProducto).join("") || "<p>No hay productos para esta búsqueda.</p>";
    const resultado = document.getElementById("resultado-busqueda");
    if (resultado) resultado.textContent = lista.length + " productos encontrados.";
}

function mostrarDetalle() {
    const contenedor = document.getElementById("detalle-producto");
    if (!contenedor) return;
    const codigo = new URLSearchParams(location.search).get("codigo") || document.body.dataset.producto;
    const producto = buscarProducto(codigo);
    if (!producto) {
        contenedor.innerHTML = '<h1>Producto no disponible</h1><p>Puede haber sido eliminado.</p><a href="producto.html">Volver al catálogo</a>';
        return;
    }
    document.title = producto.nombre + " | Sikosis Gaming";
    contenedor.innerHTML = '<div class="detalle-grid"><img class="foto-detalle" src="' + escapar(imagenSegura(producto.imagen)) + '" alt="' + escapar(producto.nombre) + '">' +
        '<div><p class="categoria">' + escapar(producto.categoria) + '</p><h1>' + escapar(producto.nombre) + '</h1><p class="precio">' + dinero(producto.precio) + '</p>' +
        '<p>' + escapar(producto.descripcion || "Sin descripción adicional.") + '</p><p>' + (producto.stock ? "Disponibles: " + producto.stock : "Agotado") + '</p>' +
        '<label for="cantidad-detalle">Cantidad</label><input id="cantidad-detalle" class="form-control cantidad" type="number" min="1" max="' + producto.stock + '" step="1" value="1">' +
        '<button class="btn boton-verde mt-3" id="agregar-detalle" ' + (!producto.stock ? "disabled" : "") + '>Añadir al carrito</button></div></div>';
    document.getElementById("agregar-detalle").addEventListener("click", function () {
        agregarCarrito(codigo, Number(document.getElementById("cantidad-detalle").value));
    });
}

