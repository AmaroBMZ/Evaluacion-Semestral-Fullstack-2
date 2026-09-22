// PANEL DE GESTIÓN. Usa los datos y funciones sencillas definidos en app.js.
// Estos permisos son una simulación de frontend; un sitio real debe verificarlos en un servidor.
const parametros = new URLSearchParams(location.search);
const vista = parametros.get("vista") || "inicio";
const panel = document.getElementById("panel-admin");
const menuAdmin = document.getElementById("menu-admin");

function accesoPermitido() {
    const usuario = usuarioActual();
    if (!usuario) return false;
    if (usuario.rol === "Administrador") return true;
    return usuario.rol === "Vendedor" && ["productos", "producto", "ordenes", "orden"].includes(vista);
}

function enlaceAdmin(destino, texto, extra = "") {
    return '<a class="btn btn-outline-dark" href="admin.html?vista=' + destino + extra + '">' + texto + '</a>';
}

function mostrarMenuAdmin() {
    menuAdmin.innerHTML = esAdministrador() ? enlaceAdmin("inicio", "Resumen") : "";
    menuAdmin.innerHTML += enlaceAdmin("productos", "Productos") + enlaceAdmin("ordenes", "Órdenes");
    if (esAdministrador()) menuAdmin.innerHTML += enlaceAdmin("usuarios", "Usuarios") + enlaceAdmin("mensajes", "Mensajes");
}

function mostrarResumen() {
    const alertas = datos.productos.filter(function (p) { return p.critico !== null && p.stock <= p.critico; });
    panel.innerHTML = '<h1>Administración</h1><p>' + datos.productos.length + ' productos · ' + datos.usuarios.length + ' usuarios · ' + datos.ordenes.length + ' órdenes</p>' +
        '<h2>Alertas de stock</h2>' + (alertas.length ? '<ul>' + alertas.map(function (p) {
            return '<li>' + escapar(p.nombre) + ': ' + p.stock + ' unidades (límite crítico: ' + p.critico + ').</li>';
        }).join("") + '</ul>' : '<p>No hay productos con stock crítico.</p>') +
        '<p>Los cambios se reflejan en la tienda de este navegador.</p>';
}

function mostrarProductosAdmin() {
    panel.innerHTML = '<h1>Productos</h1>' + (esAdministrador() ? enlaceAdmin("editar-producto", "Nuevo producto") : "") +
        '<div class="tabla-scroll"><table><caption>Productos y disponibilidad</caption><thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>' +
        datos.productos.map(function (p) {
            const extra = "&codigo=" + encodeURIComponent(p.codigo);
            return '<tr><td>' + escapar(p.codigo) + '</td><td>' + escapar(p.nombre) + '</td><td>' + dinero(p.precio) + '</td><td>' + p.stock +
                (p.critico !== null && p.stock <= p.critico ? ' <strong class="error-campo">Stock crítico</strong>' : '') + '</td><td>' +
                enlaceAdmin("producto", "Ver", extra) + (esAdministrador() ? enlaceAdmin("editar-producto", "Editar", extra) +
                '<button class="btn btn-outline-dark" data-eliminar-producto="' + escapar(p.codigo) + '">Eliminar</button>' : "") + '</td></tr>';
        }).join("") + '</tbody></table></div>';
}

function mostrarProductoAdmin() {
    const p = buscarProducto(parametros.get("codigo"));
    if (!p) return noEncontrado("Producto");
    panel.innerHTML = '<h1>' + escapar(p.nombre) + '</h1><img class="foto-admin" src="' + escapar(imagenSegura(p.imagen)) + '" alt="' + escapar(p.nombre) + '">' +
        '<dl><dt>Código</dt><dd>' + escapar(p.codigo) + '</dd><dt>Categoría</dt><dd>' + escapar(p.categoria) + '</dd><dt>Descripción</dt><dd>' + escapar(p.descripcion || "Sin descripción") + '</dd>' +
        '<dt>Precio</dt><dd>' + dinero(p.precio) + '</dd><dt>Stock</dt><dd>' + p.stock + '</dd><dt>Stock crítico</dt><dd>' + (p.critico ?? "No definido") + '</dd></dl>' + enlaceAdmin("productos", "Volver");
}

function noEncontrado(nombre) {
    panel.innerHTML = '<h1>' + nombre + ' no encontrado</h1><p>El registro no existe o fue eliminado.</p>' + enlaceAdmin("productos", "Volver a productos");
}

// Generamos un identificador que no exista, incluso al crear varios borradores.
function generarCodigoProducto() {
    let numero = 1;
    while (datos.productos.some(function (p) { return p.codigo.toLowerCase() === "prod-" + numero; })) numero++;
    return "PROD-" + numero;
}

function editarProducto() {
    const codigo = parametros.get("codigo");
    const producto = buscarProducto(codigo);
    if (codigo && !producto) return noEncontrado("Producto");
    panel.append(document.getElementById("plantilla-producto").content.cloneNode(true));
    document.getElementById("titulo-producto").textContent = producto ? "Editar producto" : "Nuevo producto";
    const selector = document.getElementById("categoria-producto");
    categorias.forEach(function (categoria) { selector.add(new Option(categoria, categoria)); });
    if (producto) {
        document.getElementById("codigo").value = producto.codigo;
        document.getElementById("codigo").readOnly = true;
        document.getElementById("nombre-producto").value = producto.nombre;
        document.getElementById("descripcion").value = producto.descripcion;
        document.getElementById("precio").value = producto.precio;
        document.getElementById("stock").value = producto.stock;
        document.getElementById("critico").value = producto.critico ?? "";
        document.getElementById("imagen").value = producto.imagen;
        selector.value = producto.categoria;
    }
    prepararFormulario(document.getElementById("form-producto"), function () {
        if (!esAdministrador()) return avisar("No tienes permiso para guardar productos.", true);
        const nuevo = {
            codigo: producto ? producto.codigo : (document.getElementById("codigo").value.trim() || generarCodigoProducto()),
            nombre: document.getElementById("nombre-producto").value.trim() || "Sin informaci\u00f3n",
            descripcion: document.getElementById("descripcion").value.trim() || "Sin informaci\u00f3n",
            precio: Number(document.getElementById("precio").value),
            stock: Number(document.getElementById("stock").value),
            critico: document.getElementById("critico").value === "" ? null : Number(document.getElementById("critico").value),
            categoria: selector.value || "Sin categor\u00eda",
            imagen: document.getElementById("imagen").value.trim() || "imagenes/SG_logo.png"
        };
        const repetido = datos.productos.some(function (p) { return p.codigo.toLowerCase() === nuevo.codigo.toLowerCase() && p.codigo !== codigo; });
        if (repetido) return errorCampo(document.getElementById("codigo"), "Ya existe un producto con ese código.");
        if (producto) datos.productos[datos.productos.findIndex(function (p) { return p.codigo === codigo; })] = nuevo;
        else datos.productos.push(nuevo);
        if (guardarDatos()) location.href = "admin.html?vista=productos&guardado=1";
    });
}

function mostrarUsuarios() {
    panel.innerHTML = '<h1>Usuarios</h1>' + enlaceAdmin("editar-usuario", "Nuevo usuario") +
        '<div class="tabla-scroll"><table><caption>Cuentas de la demostración</caption><thead><tr><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>' +
        datos.usuarios.map(function (u) {
            const extra = "&correo=" + encodeURIComponent(u.correo);
            return '<tr><td>' + escapar(u.nombre + " " + u.apellidos) + '</td><td>' + escapar(u.correo) + '</td><td>' + escapar(u.rol) + '</td><td>' + (u.activo ? "Activo" : "Desactivado") +
                '</td><td>' + enlaceAdmin("usuario", "Ver", extra) + enlaceAdmin("editar-usuario", "Editar", extra) + '</td></tr>';
        }).join("") + '</tbody></table></div>';
}

function mostrarUsuario() {
    const u = datos.usuarios.find(function (item) { return item.correo === parametros.get("correo"); });
    if (!u) return noEncontrado("Usuario");
    // La contraseña nunca se muestra en las tablas o fichas.
    panel.innerHTML = '<h1>' + escapar(u.nombre + " " + u.apellidos) + '</h1><dl><dt>RUN</dt><dd>' + escapar(u.run) + '</dd><dt>Correo</dt><dd>' + escapar(u.correo) + '</dd>' +
        '<dt>Perfil</dt><dd>' + escapar(u.rol) + '</dd><dt>Estado</dt><dd>' + (u.activo ? "Activo" : "Desactivado") + '</dd><dt>Nacimiento</dt><dd>' + escapar(u.nacimiento || "No indicado") + '</dd>' +
        '<dt>Dirección</dt><dd>' + escapar(u.direccion) + ', ' + escapar(u.comuna) + ', ' + escapar(u.region) + '</dd></dl>' + enlaceAdmin("usuarios", "Volver");
}

function editarUsuario() {
    const correo = parametros.get("correo");
    const usuario = datos.usuarios.find(function (u) { return u.correo === correo; });
    if (correo && !usuario) return noEncontrado("Usuario");
    panel.append(document.getElementById("plantilla-usuario").content.cloneNode(true));
    document.getElementById("titulo-usuario").textContent = usuario ? "Editar usuario" : "Nuevo usuario";
    cargarRegiones();
    if (usuario) {
        // El correo se mantiene como identificador estable de la cuenta.
        const campos = { run: "run", nombre: "nombre", apellidos: "apellidos", "correo-registro": "correo", nacimiento: "nacimiento", direccion: "direccion", region: "region", rol: "rol" };
        Object.keys(campos).forEach(function (id) { document.getElementById(id).value = usuario[campos[id]]; });
        document.getElementById("correo-registro").readOnly = true;
        cargarComunas();
        document.getElementById("comuna").value = usuario.comuna;
        document.getElementById("activo").value = usuario.activo ? "si" : "no";
        document.getElementById("clave-registro").required = false;
        document.getElementById("confirmar-clave").required = false;
        document.getElementById("ayuda-clave-admin").textContent = "Deja las dos contraseñas vacías para conservar la actual.";
    }
    prepararFormulario(document.getElementById("form-usuario"), function () {
        if (!esAdministrador()) return avisar("No tienes permiso para guardar usuarios.", true);
        const nuevo = leerUsuario();
        nuevo.rol = document.getElementById("rol").value;
        nuevo.activo = document.getElementById("activo").value === "si";
        if (usuarioRepetido(nuevo, correo || "")) return;
        if (usuario && usuario.correo === usuarioActual().correo && (nuevo.rol !== "Administrador" || !nuevo.activo)) {
            return avisar("Conserva tu propia cuenta activa como administrador. Usa otra cuenta administrativa para cambiar este perfil.", true);
        }
        if (usuario) {
            if (!nuevo.clave) nuevo.clave = usuario.clave;
            nuevo.telefono = usuario.telefono || "";
            datos.usuarios[datos.usuarios.findIndex(function (u) { return u.correo === correo; })] = nuevo;
        } else datos.usuarios.push(nuevo);
        if (guardarDatos()) location.href = "admin.html?vista=usuarios&guardado=1";
    });
}

function mostrarOrdenes() {
    panel.innerHTML = '<h1>Órdenes de demostración</h1>' + (datos.ordenes.length ?
        '<div class="tabla-scroll"><table><caption>Pedidos sin cobro real</caption><thead><tr><th>Número</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Detalle</th></tr></thead><tbody>' +
        datos.ordenes.slice().reverse().map(function (o) {
            return '<tr><td>' + escapar(o.numero) + '</td><td>' + new Date(o.fecha).toLocaleString("es-CL") + '</td><td>' + escapar(o.cliente) + '</td><td>' + dinero(o.total) + '</td><td>' +
                enlaceAdmin("orden", "Ver", "&numero=" + encodeURIComponent(o.numero)) + '</td></tr>';
        }).join("") + '</tbody></table></div>' : '<p>No hay órdenes. Confirma un pedido de prueba desde el carrito con una cuenta Cliente.</p>');
}

function mostrarOrden() {
    const orden = datos.ordenes.find(function (o) { return o.numero === parametros.get("numero"); });
    if (!orden) return noEncontrado("Pedido");
    panel.innerHTML = '<h1>Pedido ' + escapar(orden.numero) + '</h1><p>Cliente: ' + escapar(orden.cliente) + '</p><p>' + escapar(orden.estado) + '</p><ul>' +
        orden.items.map(function (item) { return '<li>' + escapar(item.nombre) + ' · ' + item.cantidad + ' × ' + dinero(item.precio) + '</li>'; }).join("") +
        '</ul><p class="precio">Total: ' + dinero(orden.total) + '</p>' + enlaceAdmin("ordenes", "Volver");
}

function mostrarMensajes() {
    panel.innerHTML = '<h1>Mensajes de contacto</h1>' + (datos.mensajes.slice().reverse().map(function (m) {
        return '<article class="panel p-3 mb-3"><h2 class="h5">' + escapar(m.nombre) + '</h2><p>' + escapar(m.correo || "Sin correo") + ' · ' + new Date(m.fecha).toLocaleString("es-CL") + '</p><p class="texto-mensaje">' + escapar(m.comentario) + '</p></article>';
    }).join("") || '<p>No hay mensajes recibidos.</p>');
}

// Comprobamos permisos ANTES de insertar formularios o datos administrativos.
if (usuarioActual() && usuarioActual().rol === "Vendedor" && vista === "inicio") {
    location.replace("admin.html?vista=productos");
} else if (!accesoPermitido()) {
    menuAdmin.hidden = true;
    panel.innerHTML = '<h1>Acceso restringido</h1><p>Tu cuenta no tiene permiso para ver esta sección.</p><a href="login.html">Iniciar sesión</a> · <a href="Inicio.html">Volver a la tienda</a>';
} else {
    mostrarMenuAdmin();
    if (vista === "inicio") mostrarResumen();
    else if (vista === "productos") mostrarProductosAdmin();
    else if (vista === "producto") mostrarProductoAdmin();
    else if (vista === "editar-producto") editarProducto();
    else if (vista === "usuarios") mostrarUsuarios();
    else if (vista === "usuario") mostrarUsuario();
    else if (vista === "editar-usuario") editarUsuario();
    else if (vista === "ordenes") mostrarOrdenes();
    else if (vista === "orden") mostrarOrden();
    else if (vista === "mensajes") mostrarMensajes();
    else panel.innerHTML = '<h1>Sección no encontrada</h1><a href="admin.html">Volver al panel</a>';
    if (parametros.get("guardado")) avisar("Cambios guardados correctamente.");
}

panel.addEventListener("click", function (evento) {
    const boton = evento.target.closest("[data-eliminar-producto]");
    if (!boton || !esAdministrador()) return;
    const codigo = boton.dataset.eliminarProducto;
    const producto = buscarProducto(codigo);
    if (!producto || !confirm("¿Eliminar " + producto.nombre + "? Se retirará también de los carritos. Las órdenes anteriores se conservarán.")) return;
    datos.productos = datos.productos.filter(function (p) { return p.codigo !== codigo; });
    Object.keys(datos.carritos).forEach(function (clave) {
        datos.carritos[clave] = datos.carritos[clave].filter(function (item) { return item.codigo !== codigo; });
    });
    if (guardarDatos()) {
        mostrarProductosAdmin(); actualizarContador(); avisar("Producto eliminado.");
    }
});
