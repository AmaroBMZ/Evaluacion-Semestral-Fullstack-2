"use strict";

// R.11 Y R.12: administración local. Cada acción vuelve a comprobar el perfil.
datosListos.then(() => {
    const zona = document.querySelector("#administracion");
    const mensaje = document.querySelector("#mensaje-tienda");
    const pagina = location.pathname.split("/").pop();
    const parametros = new URLSearchParams(location.search);
    const vista = parametros.get("vista") || "lista";
    const id = parametros.get("id");
    const escapar = GZ.escapar;
    const permisos = ["Administrador", "Vendedor"];
    const actual = GZ.exigirRol(permisos);

    // Bloquear también el acceso directo a URL, no solo ocultar enlaces del menú.
    if (actual.rol === "Vendedor") {
        document.querySelectorAll("[data-solo-admin]").forEach((nodo) => { nodo.hidden = true; });
        if (pagina === "admin-usuarios.html" || ["nuevo", "editar"].includes(vista)) {
            throw new Error("El vendedor solo puede consultar productos y órdenes.");
        }
        if (pagina === "admin.html") {
            location.replace("admin-productos.html");
            return;
        }
    }
    zona.hidden = false;

    function enlace(paginaDestino, vistaDestino, identificador, texto) {
        return `<a class="boton-secundario" href="${paginaDestino}?vista=${vistaDestino}&id=${encodeURIComponent(identificador)}">${texto}</a>`;
    }

    function tabla(encabezados, filas) {
        return `<div class="tabla-scroll" role="region" aria-label="Listado administrativo" tabindex="0"><table class="table table-striped">
            <caption>Listado de ${pagina === "admin-usuarios.html" ? "usuarios" : "productos"}</caption>
            <thead><tr>${encabezados.map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead>
            <tbody>${filas || `<tr><td colspan="${encabezados.length}">No hay registros.</td></tr>`}</tbody></table></div>`;
    }

    // RESUMEN: advertir cuando stock <= stock crítico, incluido el valor cero.
    if (pagina === "admin.html") {
        const alertas = GZ.productos().filter((p) => p.critico !== null && p.critico !== "" && p.stock <= p.critico);
        document.querySelector("#resumen-admin").innerHTML = `<p>${GZ.productos().length} productos · ${GZ.usuarios().length} usuarios</p>
            <h2>Alertas de stock</h2>${alertas.length ? '<ul>' + alertas.map((p) => `<li>${escapar(p.nombre)}: quedan ${p.stock} unidades.</li>`).join("") + '</ul>' : '<p>No hay productos con stock crítico.</p>'}`;
    }

    // PRODUCTOS: el vendedor consulta; el administrador puede modificar el catálogo.
    if (pagina === "admin-productos.html") {
        const lista = document.querySelector("#lista-admin");
        const producto = GZ.productos().find((p) => p.codigo === id);
        if (vista === "lista") {
            const filas = GZ.productos().map((p) => `<tr>
                <td>${escapar(p.codigo)}</td><td>${escapar(p.nombre)}</td><td>${GZ.moneda(p.precio)}</td>
                <td>${p.stock}${p.critico !== null && p.stock <= p.critico ? ' <strong>Stock crítico</strong>' : ''}</td>
                <td>${enlace(pagina, "detalle", p.codigo, "Ver")}
                    ${actual.rol === "Administrador" ? enlace(pagina, "editar", p.codigo, "Editar") + `<button class="boton-secundario" data-eliminar-producto="${escapar(p.codigo)}">Eliminar</button>` : ''}</td>
            </tr>`).join("");
            lista.innerHTML = (actual.rol === "Administrador" ? '<a class="boton-principal" href="admin-productos.html?vista=nuevo">Nuevo producto</a>' : '') + tabla(["Código", "Nombre", "Precio", "Stock", "Acciones"], filas);
        } else if (vista === "detalle") {
            if (!producto) throw new Error("Producto no encontrado.");
            document.querySelector("#detalle-admin").innerHTML = `<h2>${escapar(producto.nombre)}</h2>
                <p>Código: ${escapar(producto.codigo)}</p><p>${escapar(producto.descripcion)}</p>
                <p>Precio: ${GZ.moneda(producto.precio)} · Stock: ${producto.stock} · Stock crítico: ${producto.critico ?? "Sin definir"}</p>
                <p>Categoría: ${escapar(producto.categoria)}</p>
                <img class="imagen-admin" src="${GZ.imagen(producto.imagen)}" alt="${escapar(producto.nombre)}">
                ${actual.rol === "Administrador" ? enlace(pagina, "editar", producto.codigo, "Editar producto") : ''}`;
        } else if (["nuevo", "editar"].includes(vista)) {
            GZ.exigirRol(["Administrador"]);
            if (vista === "editar" && !producto) throw new Error("Producto no encontrado.");
            const formulario = document.querySelector("#formulario-producto");
            formulario.hidden = false;
            document.querySelector("#titulo-admin").textContent = vista === "nuevo" ? "Nuevo producto" : "Editar producto";
            formulario.elements.categoria.innerHTML = '<option value="">Selecciona una categoría</option>' + [...new Set(PRODUCTOS_INICIALES.map((p) => p.categoria))].map((c) => `<option>${escapar(c)}</option>`).join("");
            if (producto) {
                for (const campo of formulario.querySelectorAll("input, textarea, select")) campo.value = producto[campo.name] ?? "";
                // El código es la identidad usada por los enlaces y el carrito.
                formulario.elements.codigo.readOnly = true;
            }
            Formularios.conectar(formulario, async (datos) => {
                GZ.exigirRol(["Administrador"]);
                const productos = GZ.productos();
                if (vista === "editar" && !productos.some((p) => p.codigo === id)) throw new Error("El producto fue eliminado en otra pestaña.");
                const codigo = producto ? producto.codigo : datos.codigo.trim();
                if (!producto && productos.some((p) => p.codigo === codigo)) throw new Error("Ya existe un producto con ese código.");
                if (datos.imagen && !/^img\/[a-zA-Z0-9_.-]+$/.test(datos.imagen)) throw new Error("Indica una imagen local de la carpeta img, por ejemplo img/control.jpg.");
                const nuevo = {codigo, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), precio: Number(datos.precio),
                    stock: Number(datos.stock), critico: datos.critico === "" ? null : Number(datos.critico), categoria: datos.categoria, imagen: datos.imagen.trim()};
                GZ.guardar("productos", producto ? productos.map((p) => p.codigo === id ? nuevo : p) : [...productos, nuevo]);
                location.href = "admin-productos.html?vista=detalle&id=" + encodeURIComponent(codigo);
            });
        } else throw new Error("La vista solicitada no existe.");
    }

    // USUARIOS: comprobar duplicados y evitar quitar el último administrador.
    if (pagina === "admin-usuarios.html") {
        GZ.exigirRol(["Administrador"]);
        const usuario = GZ.usuarios().find((u) => u.id === id);
        const lista = document.querySelector("#lista-admin");
        if (vista === "lista") {
            lista.innerHTML = '<a class="boton-principal" href="admin-usuarios.html?vista=nuevo">Nuevo usuario</a>' + tabla(["Nombre", "Correo", "Perfil", "Acciones"], GZ.usuarios().map((u) => `<tr>
                <td>${escapar(u.nombre)} ${escapar(u.apellidos)}</td><td>${escapar(u.correo)}</td><td>${escapar(u.rol)}</td>
                <td>${enlace(pagina, "detalle", u.id, "Ver")}${enlace(pagina, "editar", u.id, "Editar")}</td></tr>`).join(""));
        } else if (vista === "detalle") {
            if (!usuario) throw new Error("Usuario no encontrado.");
            const region = REGIONES.find((r) => r.codigo === usuario.region)?.nombre || "Sin región";
            document.querySelector("#detalle-admin").innerHTML = `<h2>${escapar(usuario.nombre)} ${escapar(usuario.apellidos)}</h2>
                <p>RUN: ${escapar(usuario.run || "Cuenta ficticia")}</p><p>Correo: ${escapar(usuario.correo)}</p><p>Perfil: ${escapar(usuario.rol)}</p>
                <p>Nacimiento: ${escapar(usuario.nacimiento || "No informado")}</p>
                <p>${escapar(usuario.direccion)}, ${escapar(usuario.comuna)}, ${escapar(region)}</p>${enlace(pagina, "editar", usuario.id, "Editar usuario")}`;
        } else if (["nuevo", "editar"].includes(vista)) {
            if (vista === "editar" && !usuario) throw new Error("Usuario no encontrado.");
            const formulario = document.querySelector("#formulario-usuario");
            formulario.hidden = false;
            document.querySelector("#titulo-admin").textContent = vista === "nuevo" ? "Nuevo usuario" : "Editar usuario";
            Formularios.regiones(formulario, usuario?.region, usuario?.comuna);
            if (usuario) {
                for (const campo of formulario.querySelectorAll("input, select")) {
                    if (campo.name !== "clave") campo.value = usuario[campo.name] ?? "";
                }
            } else formulario.elements.clave.required = true;
            Formularios.conectar(formulario, async (datos) => {
                GZ.exigirRol(["Administrador"]);
                Formularios.revisarUsuario(datos, usuario?.id);
                const usuarios = GZ.usuarios();
                if (usuario && !usuarios.some((u) => u.id === id)) throw new Error("El usuario ya no existe.");
                if (!GZ.roles.includes(datos.rol)) throw new Error("Selecciona un perfil válido.");
                if (usuario?.rol === "Administrador" && datos.rol !== "Administrador" && usuarios.filter((u) => u.rol === "Administrador").length === 1) throw new Error("Debe quedar al menos un administrador.");
                const nuevo = {...usuario, id: usuario?.id || crypto.randomUUID(), run: datos.run.trim().toUpperCase(), nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(),
                    correo: datos.correo.trim().toLowerCase(), nacimiento: datos.nacimiento, region: datos.region, comuna: datos.comuna, direccion: datos.direccion.trim(), rol: datos.rol};
                if (datos.clave) Object.assign(nuevo, await GZ.credencial(datos.clave));
                GZ.guardar("usuarios", usuario ? usuarios.map((u) => u.id === id ? nuevo : u) : [...usuarios, nuevo]);
                location.href = GZ.usuarioActual()?.rol === "Administrador" ? "admin-usuarios.html?vista=detalle&id=" + encodeURIComponent(nuevo.id) : "index.html";
            });
        } else throw new Error("La vista solicitada no existe.");
    }

    // ÓRDENES: solo consulta de ejemplos, como pide el rol Vendedor del Anexo 1.
    if (pagina === "admin-ordenes.html") {
        const ordenes = [
            {id: "ORD001", fecha: "2026-09-01", cliente: "Cliente de ejemplo A", producto: "Control inalámbrico", cantidad: 1, total: 54990, estado: "Recibida"},
            {id: "ORD002", fecha: "2026-09-02", cliente: "Cliente de ejemplo B", producto: "Teclado compacto", cantidad: 1, total: 64990, estado: "Preparación"}
        ];
        const contenedor = document.querySelector("#ordenes-admin");
        if (vista === "detalle") {
            const orden = ordenes.find((o) => o.id === id);
            if (!orden) throw new Error("Orden no encontrada.");
            contenedor.innerHTML = `<h2>${orden.id}</h2><p>${orden.cliente} · ${orden.fecha}</p><p>${orden.producto} · Cantidad: ${orden.cantidad}</p><p>Total: ${GZ.moneda(orden.total)} · Estado: ${orden.estado}</p>`;
        } else if (vista === "lista") {
            contenedor.innerHTML = '<ul class="lista-ordenes">' + ordenes.map((o) => `<li>${o.id} · ${o.cliente} · ${o.estado} ${enlace(pagina, "detalle", o.id, "Ver detalle")}</li>`).join("") + '</ul>';
        } else throw new Error("Las órdenes de ejemplo son de solo lectura.");
    }

    // BAJA DE PRODUCTO: confirmación antes de eliminar un dato de la demostración.
    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-eliminar-producto]");
        if (!boton) return;
        try {
            GZ.exigirRol(["Administrador"]);
            if (!confirm("¿Eliminar este producto del catálogo local?")) return;
            GZ.guardar("productos", GZ.productos().filter((p) => p.codigo !== boton.dataset.eliminarProducto));
            location.reload();
        } catch (error) { mensaje.textContent = error.message; }
    });
}).catch((error) => {
    document.querySelector("#administracion").hidden = true;
    const mensaje = document.querySelector("#mensaje-tienda");
    mensaje.textContent = error.message;
    const enlace = document.createElement("a");
    enlace.href = "login.html";
    enlace.textContent = "Volver al inicio de sesión";
    mensaje.insertAdjacentElement("afterend", enlace);
});
