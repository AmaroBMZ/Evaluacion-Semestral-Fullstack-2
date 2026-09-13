"use strict";

// CABECERA: desplegable junto al carrito, cierre exterior, foco y teclado.
const botonCuenta = document.querySelector(".boton-cuenta");
const panelAcceso = document.querySelector(".panel-acceso");
const fondoAcceso = document.querySelector(".fondo-acceso");

if (botonCuenta && panelAcceso) {
    function cambiarAcceso(abierto, devolverFoco = false) {
        panelAcceso.hidden = !abierto;
        fondoAcceso.hidden = !abierto;
        botonCuenta.setAttribute("aria-expanded", String(abierto));
        document.querySelector(".cabecera").classList.toggle("acceso-abierto", abierto);
        if (abierto) {
            const destino = panelAcceso.querySelector('[data-invitado]:not([hidden]) input, [data-sesion]:not([hidden]) button');
            destino?.focus();
        } else if (devolverFoco) botonCuenta.focus();
    }

    botonCuenta.addEventListener("click", () => cambiarAcceso(panelAcceso.hidden));
    document.addEventListener("click", (evento) => {
        if (!panelAcceso.hidden && !evento.target.closest(".cuenta-desplegable")) cambiarAcceso(false, evento.target === fondoAcceso);
    });
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !panelAcceso.hidden) cambiarAcceso(false, true);
    });
    document.querySelector(".cuenta-desplegable").addEventListener("focusout", (evento) => {
        if (evento.relatedTarget && !evento.currentTarget.contains(evento.relatedTarget)) cambiarAcceso(false);
    });

    // OJO DE CONTRASEÑA: la visibilidad cambia solo al pulsar el botón.
    const botonClave = document.querySelector(".mostrar-clave");
    const entradaClave = document.querySelector("#clave-acceso");
    botonClave.addEventListener("click", () => {
        const mostrar = entradaClave.type === "password";
        entradaClave.type = mostrar ? "text" : "password";
        botonClave.setAttribute("aria-pressed", String(mostrar));
        botonClave.setAttribute("aria-label", mostrar ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    // RECUPERACIÓN: el ERS la deja para futuras versiones; no simular un envío real.
    document.querySelector(".recuperar-clave").addEventListener("click", () => {
        document.querySelector(".mensaje-recuperacion").textContent = "La recuperación de contraseña está prevista para una futura versión. No se ha enviado ningún correo.";
    });

    datosListos.then(() => {
        const usuario = GZ.usuarioActual();
        document.querySelector("[data-invitado]").hidden = Boolean(usuario);
        document.querySelector("[data-sesion]").hidden = !usuario;
        if (usuario) {
            botonCuenta.querySelector("strong").textContent = usuario.nombre;
            document.querySelector("#nombre-sesion").textContent = `${usuario.nombre} · ${usuario.rol}`;
            document.querySelector("#enlace-administracion").hidden = usuario.rol === "Cliente";
            document.querySelector("#cerrar-sesion").addEventListener("click", GZ.cerrar);
        }
    }).catch(() => {});
}

// NAVEGACIÓN: destacar la página actual sin duplicar lógica en cada cabecera.
document.querySelectorAll(".menu a").forEach((enlace) => {
    if (enlace.getAttribute("href") === location.pathname.split("/").pop()) {
        enlace.classList.add("activo");
        enlace.setAttribute("aria-current", "page");
    }
});

// BOLETÍN: registro local explícito, sin afirmar que se envían novedades por correo.
datosListos.then(() => {
    const boletin = document.querySelector("#formulario-boletin");
    if (!boletin) return;
    Formularios.conectar(boletin, async (datos, mensaje) => {
        const correo = datos.correo.trim().toLowerCase();
        GZ.guardar("boletin", [...new Set([...GZ.leer("boletin"), correo])]);
        mensaje.textContent = "Suscripción guardada solo en esta demostración local.";
        boletin.reset();
    });
}).catch(() => {});
