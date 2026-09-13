"use strict";

// ALMACENAMIENTO LOCAL (R.9, R.14, R.20): datos de una demostración académica.
// Los permisos del navegador no sustituyen la autorización de un servidor.
const GZ = (() => {
    const prefijo = "gamezone.v1.";
    const roles = ["Administrador", "Cliente", "Vendedor"];
    const escapar = (valor) => String(valor ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);

    // No borrar silenciosamente los datos si el navegador rechaza el almacenamiento.
    function leer(nombre, inicial = []) {
        const texto = localStorage.getItem(prefijo + nombre);
        if (texto === null) return structuredClone(inicial);
        const datos = JSON.parse(texto);
        if (!Array.isArray(datos)) throw new Error("Los datos locales de " + nombre + " no son válidos.");
        return datos;
    }

    function guardar(nombre, datos) {
        try {
            localStorage.setItem(prefijo + nombre, JSON.stringify(datos));
        } catch {
            throw new Error("No se pudo guardar. Revisa el espacio y los permisos del navegador.");
        }
    }

    function productos() {
        const datos = leer("productos", PRODUCTOS_INICIALES);
        if (datos.some((p) => !p || typeof p.codigo !== "string" || typeof p.nombre !== "string" ||
            !Number.isFinite(p.precio) || p.precio < 0 || !Number.isInteger(p.stock) || p.stock < 0)) {
            throw new Error("El catálogo local contiene datos no válidos. No se ha sobrescrito.");
        }
        return datos;
    }

    function usuarios() {
        const datos = leer("usuarios");
        if (datos.some((u) => !u || typeof u.id !== "string" || !roles.includes(u.rol))) {
            throw new Error("Los usuarios locales contienen datos no válidos.");
        }
        return datos;
    }

    function usuarioActual() {
        const id = sessionStorage.getItem(prefijo + "sesion");
        return usuarios().find((u) => u.id === id) || null;
    }

    function exigirRol(permitidos) {
        const usuario = usuarioActual();
        if (!usuario || !permitidos.includes(usuario.rol)) {
            throw new Error("No tienes permiso para acceder a esta función.");
        }
        return usuario;
    }

    // CREDENCIALES: guardar un derivado con sal aleatoria, nunca la contraseña ingresada.
    async function derivar(clave, sal) {
        const encoder = new TextEncoder();
        const material = await crypto.subtle.importKey("raw", encoder.encode(clave), "PBKDF2", false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt: encoder.encode(sal), iterations: 100000, hash: "SHA-256"}, material, 256);
        return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
    }

    async function credencial(clave) {
        const sal = crypto.randomUUID();
        return {sal, verificador: await derivar(clave, sal)};
    }

    async function iniciar(correo, clave) {
        const usuario = usuarios().find((u) => u.correo === correo.trim().toLowerCase());
        if (!usuario || await derivar(clave, usuario.sal) !== usuario.verificador) {
            throw new Error("Correo o contraseña incorrectos.");
        }
        sessionStorage.setItem(prefijo + "sesion", usuario.id);
        return usuario;
    }

    function cerrar() {
        sessionStorage.removeItem(prefijo + "sesion");
        location.href = "index.html";
    }

    // DATOS INICIALES: cuentas ficticias para probar los tres perfiles.
    async function inicializar() {
        if (localStorage.getItem(prefijo + "usuarios") !== null) return;
        const cuentas = [];
        for (const [indice, rol] of roles.entries()) {
            cuentas.push({id: "demo-" + indice, run: ["10000009", "10000017", "10000025"][indice], nombre: rol, apellidos: "de ejemplo", correo: rol.toLowerCase() + "@duoc.cl", rol,
                nacimiento: "", region: "13", comuna: "Santiago", direccion: "Dirección de ejemplo", ...await credencial("Demo1234")});
        }
        guardar("usuarios", cuentas);
    }

    // CARRITO: consolidar duplicados y ajustar cantidades si cambia el stock.
    function carrito() {
        const catalogo = productos();
        const acumulado = new Map();
        const guardado = leer("carrito");
        for (const linea of guardado) {
            if (!linea || !Number.isInteger(linea.cantidad) || linea.cantidad < 1) continue;
            const producto = catalogo.find((p) => p.codigo === linea.codigo);
            if (!producto || producto.stock === 0) continue;
            acumulado.set(linea.codigo, Math.min(producto.stock, (acumulado.get(linea.codigo) || 0) + linea.cantidad));
        }
        const ajustado = [...acumulado].map(([codigo, cantidad]) => ({codigo, cantidad}));
        if (JSON.stringify(guardado) !== JSON.stringify(ajustado)) guardar("carrito", ajustado);
        return ajustado;
    }

    function cambiarCantidad(codigo, cantidad) {
        const producto = productos().find((p) => p.codigo === codigo);
        if (!producto || !Number.isInteger(cantidad) || cantidad < 0 || cantidad > producto.stock) {
            throw new Error("La cantidad debe ser entera y no puede superar el stock disponible.");
        }
        const lineas = carrito().filter((l) => l.codigo !== codigo);
        if (cantidad > 0) lineas.push({codigo, cantidad});
        guardar("carrito", lineas);
        document.dispatchEvent(new Event("carrito-cambiado"));
    }

    const moneda = (numero) => new Intl.NumberFormat("es-CL", {style: "currency", currency: "CLP", maximumFractionDigits: 2}).format(numero);
    const imagen = (ruta) => /^img\/[a-zA-Z0-9_.-]+$/.test(ruta || "") ? ruta : "img/portada.jpg";
    return {leer, guardar, productos, usuarios, usuarioActual, exigirRol, credencial, iniciar, cerrar, inicializar, carrito,
        cambiarCantidad, escapar, moneda, imagen, roles};
})();

// Todas las páginas esperan la carga de cuentas antes de conectar los formularios.
const datosListos = GZ.inicializar();
datosListos.catch((error) => {
    const aviso = document.createElement("p");
    aviso.className = "alert alert-danger";
    aviso.setAttribute("role", "alert");
    aviso.textContent = "No se pudo preparar la demostración: " + error.message;
    document.querySelector("main")?.prepend(aviso);
});
