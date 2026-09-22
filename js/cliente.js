// Cada cliente consulta solamente las órdenes vinculadas a su cuenta.
function comprasDelCliente() {
    const usuario = usuarioActual();
    if (!usuario || usuario.rol !== "Cliente") return [];
    return datos.ordenes.filter(function (orden) { return orden.cliente === usuario.correo; }).slice().reverse();
}

function mostrarMisCompras() {
    const lista = document.getElementById("lista-compras");
    lista.innerHTML = comprasDelCliente().map(function (orden) {
        const entrega = orden.entrega;
        // No atribuimos a un pedido antiguo la dirección actual del perfil.
        const destino = entrega ? '<h4 class="h6">Dirección registrada</h4><p>' +
            escapar([entrega.nombre, entrega.apellidos].filter(Boolean).join(" ")) + '<br>' +
            escapar([entrega.direccion, entrega.comuna, entrega.region].filter(Boolean).join(", ")) +
            (entrega.telefono ? '<br>Teléfono: ' + escapar(entrega.telefono) : '') + '</p>' :
            '<p>Este pedido antiguo no tiene una dirección de entrega registrada.</p>';
        return '<article class="compra-cliente"><h3 class="h5">Pedido ' + escapar(orden.numero) + '</h3>' +
            '<p>' + escapar(new Date(orden.fecha).toLocaleString("es-CL")) + '</p><p>Estado: <strong>' + escapar(orden.estado || "Sin estado registrado") + '</strong></p>' +
            '<p>Total: <strong>' + dinero(orden.total) + '</strong></p><details><summary>Ver detalle de la compra</summary>' +
            '<ul class="mt-3">' + orden.items.map(function (item) {
                return '<li>' + escapar(item.nombre) + ': ' + item.cantidad + ' × ' + dinero(item.precio) + ' = ' + dinero(Math.round(item.cantidad * item.precio * 100) / 100) + '</li>';
            }).join('') + '</ul>' + destino + '</details></article>';
    }).join('') || '<p>Aún no tienes compras. <a href="producto.html">Explorar productos</a>.</p>';
}

function guardarMiPerfil() {
    const usuario = usuarioActual();
    if (!usuario || usuario.rol !== "Cliente") return avisar("Inicia sesión como cliente para editar tus datos.", true);
    const telefono = document.getElementById("telefono");
    if (telefono.value.trim() && (!/^\+?[\d\s()-]{7,20}$/.test(telefono.value.trim()) || telefono.value.replace(/\D/g, "").length < 7)) {
        errorCampo(telefono, "Ingresa un teléfono válido, por ejemplo +56 9 1234 5678.");
        telefono.focus();
        return;
    }
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const seleccion = regiones.find(function (item) { return item.nombre === region.value; });
    if (!seleccion || !seleccion.comunas.includes(comuna.value)) return avisar("Selecciona una región y una comuna válida.", true);
    // Solo modificamos datos personales: identidad, contraseña y perfil se conservan.
    ["nombre", "apellidos", "telefono", "nacimiento", "direccion", "region", "comuna"].forEach(function (campo) {
        usuario[campo] = document.getElementById(campo).value.trim();
    });
    if (guardarDatos()) {
        actualizarCuenta();
        avisar("Tus datos fueron guardados. Se usarán en tus próximas compras.");
    }
}

function prepararPerfilCliente() {
    const usuario = usuarioActual();
    if (!usuario || usuario.rol !== "Cliente") {
        const acceso = document.getElementById("acceso-cliente");
        acceso.hidden = false;
        acceso.innerHTML = '<p>Inicia sesión con una cuenta Cliente para consultar tus compras y editar tus datos.</p><a href="login.html">Iniciar sesión</a>';
        return;
    }
    document.getElementById("contenido-cliente").hidden = false;
    document.getElementById("identidad-cliente").textContent = "Correo: " + usuario.correo + " · RUN: " + usuario.run;
    ["nombre", "apellidos", "telefono", "nacimiento", "direccion", "region"].forEach(function (campo) {
        document.getElementById(campo).value = usuario[campo] || "";
    });
    cargarComunas();
    document.getElementById("comuna").value = usuario.comuna || "";
    prepararFormulario(document.getElementById("form-perfil"), guardarMiPerfil);
    document.getElementById("correo-nuevo").value = usuario.correo;
    prepararFormulario(document.getElementById("form-seguridad"), guardarSeguridadCliente);
    mostrarMisCompras();
}

prepararPerfilCliente();

function guardarSeguridadCliente() {
    datos = cargarDatos();
    const usuario = usuarioActual();
    if (!usuario || usuario.rol !== "Cliente") return avisar("Inicia sesi\u00f3n como cliente para actualizar tu cuenta.", true);
    const correoCampo = document.getElementById("correo-nuevo");
    const actual = document.getElementById("clave-actual");
    const nueva = document.getElementById("clave-nueva");
    const repetir = document.getElementById("repetir-clave-nueva");
    const correo = correoCampo.value.trim().toLowerCase();
    if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo) || correo.length > 100) {
        errorCampo(correoCampo, "Ingresa un correo v\u00e1lido de los dominios permitidos."); correoCampo.focus(); return;
    }
    if (actual.value !== usuario.clave) {
        errorCampo(actual, "La contrase\u00f1a actual no es correcta."); actual.focus(); return;
    }
    if (nueva.value && (nueva.value.trim().length < 4 || nueva.value.length > 10)) {
        errorCampo(nueva, "La nueva contrase\u00f1a debe tener entre 4 y 10 caracteres."); nueva.focus(); return;
    }
    if (nueva.value !== repetir.value) {
        errorCampo(repetir, "Las nuevas contrase\u00f1as deben coincidir."); repetir.focus(); return;
    }
    if (datos.usuarios.some(function (otro) { return otro !== usuario && otro.correo.toLowerCase() === correo; })) {
        errorCampo(correoCampo, "Este correo ya pertenece a otra cuenta."); correoCampo.focus(); return;
    }
    const anterior = usuario.correo;
    if (correo === anterior && !nueva.value) return avisar("No hay cambios para guardar.");
    // El correo identifica cuentas, carritos y pedidos en esta demostracion.
    // Migramos todas sus referencias juntas para conservar el historial.
    if (correo !== anterior) {
        try { sessionStorage.setItem(CLAVE_SESION, correo); }
        catch (error) { return avisar("No se pudo actualizar la sesi\u00f3n. No se guardaron cambios.", true); }
        datos.carritos[correo] = datos.carritos[anterior] || [];
        delete datos.carritos[anterior];
        datos.ordenes.forEach(function (orden) { if (orden.cliente === anterior) orden.cliente = correo; });
        usuario.correo = correo;
    }
    if (nueva.value) usuario.clave = nueva.value;
    if (!guardarDatos()) {
        if (correo !== anterior) {
            try { sessionStorage.setItem(CLAVE_SESION, anterior); }
            catch (error) { location.href = "login.html"; }
        }
        return;
    }
    document.getElementById("form-seguridad").reset();
    correoCampo.value = correo;
    [correoCampo, actual, nueva, repetir].forEach(function (campo) { errorCampo(campo, ""); });
    document.getElementById("identidad-cliente").textContent = "Correo: " + correo + " \u00b7 RUN: " + usuario.run;
    actualizarCuenta();
    mostrarMisCompras();
    avisar("Cuenta actualizada. Usa tus nuevos datos la pr\u00f3xima vez que inicies sesi\u00f3n.");
}
