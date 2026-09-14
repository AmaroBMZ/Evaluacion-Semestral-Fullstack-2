"use strict";

// R.10: reglas del Anexo 1, páginas 13 a 16, compartidas por todos los formularios.
const Formularios = (() => {
    function runValido(run) {
        if (!/^\d{6,8}[0-9K]$/i.test(run) || /^0+$/.test(run.slice(0, -1))) return false;
        let suma = 0;
        let factor = 2;
        for (const digito of run.slice(0, -1).split("").reverse()) {
            suma += Number(digito) * factor;
            factor = factor === 7 ? 2 : factor + 1;
        }
        const resto = 11 - suma % 11;
        const verificador = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
        return verificador === run.slice(-1).toUpperCase();
    }

    function validarCampo(campo) {
        const valor = campo.value.trim();
        let mensaje = "";
        if (campo.required && !valor) mensaje = "Este campo es obligatorio.";
        else if (campo.maxLength > 0 && campo.value.length > campo.maxLength) mensaje = `Usa como máximo ${campo.maxLength} caracteres.`;
        else if (valor && campo.minLength > 0 && campo.value.length < campo.minLength) mensaje = `Usa al menos ${campo.minLength} caracteres.`;
        else if (valor && campo.type === "email" && !/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor)) mensaje = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        else if (valor && campo.name === "run" && !runValido(valor)) mensaje = "Ingresa un RUN válido, sin puntos ni guion (7 a 9 caracteres).";
        else if (campo.type === "number" && (campo.validity.badInput || (valor && (!Number.isFinite(Number(valor)) || Number(valor) < 0)))) mensaje = "Ingresa un número válido mayor o igual a cero.";
        else if (valor && campo.type === "number" && campo.step === "1" && !Number.isInteger(Number(valor))) mensaje = "Ingresa un número entero mayor o igual a cero.";
        else if (valor && campo.name === "nacimiento" && valor > new Date().toISOString().slice(0, 10)) mensaje = "La fecha de nacimiento no puede ser futura.";
        else if (campo.name === "confirmacion" && campo.value !== campo.form.elements.clave.value) mensaje = "Las contraseñas deben coincidir.";
        campo.setCustomValidity(mensaje);
        campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
        const ayuda = document.getElementById(campo.id + "-error");
        if (ayuda) ayuda.textContent = mensaje;
        return !mensaje;
    }

    // VALIDACIÓN EN TIEMPO REAL: conserva el foco y muestra ayuda junto al campo.
    function conectar(formulario, alEnviar) {
        formulario.noValidate = true;
        const campos = [...formulario.querySelectorAll("input, select, textarea")];
        for (const campo of campos) {
            const error = document.createElement("small");
            error.id = campo.id + "-error";
            error.className = "error-campo";
            error.setAttribute("aria-live", "polite");
            campo.setAttribute("aria-describedby", [campo.getAttribute("aria-describedby"), error.id].filter(Boolean).join(" "));
            campo.insertAdjacentElement("afterend", error);
            campo.addEventListener("input", () => {
                validarCampo(campo);
                if (campo.name === "clave" && formulario.elements.confirmacion?.value) {
                    validarCampo(formulario.elements.confirmacion);
                }
            });
            campo.addEventListener("change", () => validarCampo(campo));
            campo.addEventListener("blur", () => { if (campo.value) validarCampo(campo); });
        }
        formulario.addEventListener("submit", async (evento) => {
            evento.preventDefault();
            const resultados = campos.map(validarCampo);
            if (resultados.includes(false)) {
                campos[resultados.indexOf(false)].focus();
                return;
            }
            const boton = formulario.querySelector('[type="submit"]');
            if (boton.disabled) return;
            boton.disabled = true;
            const mensaje = formulario.querySelector(".mensaje");
            mensaje.textContent = "";
            try {
                await alEnviar(Object.fromEntries(new FormData(formulario)), mensaje);
            } catch (error) {
                mensaje.textContent = error.message || "No se pudo completar la acción. Inténtalo nuevamente.";
            } finally {
                boton.disabled = false;
            }
        });
    }

    // REGIÓN Y COMUNA: limpiar la comuna cuando cambia la región elegida.
    function regiones(formulario, region = "", comuna = "") {
        const selector = formulario.elements.region;
        const comunas = formulario.elements.comuna;
        selector.innerHTML = '<option value="">Selecciona una región</option>' + REGIONES.map((r) => `<option value="${r.codigo}">${GZ.escapar(r.nombre)}</option>`).join("");
        selector.value = region;
        function actualizar() {
            const elegida = REGIONES.find((r) => r.codigo === selector.value);
            comunas.innerHTML = '<option value="">Selecciona una comuna</option>' + (elegida?.comunas || []).map((c) => `<option>${GZ.escapar(c)}</option>`).join("");
            comunas.disabled = !elegida;
        }
        actualizar();
        comunas.value = comuna;
        selector.addEventListener("change", actualizar);
    }

    // DATOS DE USUARIO: también revisar duplicados y asociaciones región/comuna.
    function revisarUsuario(datos, id = null) {
        if (GZ.usuarios().some((u) => u.id !== id && u.correo === datos.correo.trim().toLowerCase())) throw new Error("Ese correo ya está registrado.");
        if (GZ.usuarios().some((u) => u.id !== id && u.run === datos.run.trim().toUpperCase())) throw new Error("Ese RUN ya está registrado.");
        if (!REGIONES.find((r) => r.codigo === datos.region)?.comunas.includes(datos.comuna)) throw new Error("Selecciona una comuna de la región indicada.");
    }

    return {conectar, regiones, revisarUsuario, runValido};
})();

// CUENTAS Y CONTACTO: conectar únicamente los formularios presentes en la página.
datosListos.then(() => {
    document.querySelectorAll("[data-login]").forEach((formulario) => {
        Formularios.conectar(formulario, async (datos) => {
            const usuario = await GZ.iniciar(datos.correo, datos.clave);
            location.href = usuario.rol === "Cliente" ? "index.html" : "admin.html";
        });
    });

    const registro = document.querySelector("#formulario-registro");
    if (registro) {
        Formularios.regiones(registro);
        Formularios.conectar(registro, async (datos, mensaje) => {
            Formularios.revisarUsuario(datos);
            const usuario = {id: crypto.randomUUID(), run: datos.run.trim().toUpperCase(), nombre: datos.nombre.trim(),
                apellidos: datos.apellidos.trim(), correo: datos.correo.trim().toLowerCase(), nacimiento: datos.nacimiento,
                region: datos.region, comuna: datos.comuna, direccion: datos.direccion.trim(), rol: "Cliente", ...await GZ.credencial(datos.clave)};
            GZ.guardar("usuarios", [...GZ.usuarios(), usuario]);
            registro.reset();
            registro.elements.region.dispatchEvent(new Event("change"));
            mensaje.textContent = "Cuenta local creada. Ya puedes iniciar sesión con tu correo y contraseña.";
        });
    }

    const contacto = document.querySelector("#formulario-contacto");
    if (contacto) Formularios.conectar(contacto, async (datos, mensaje) => {
        const mensajes = GZ.leer("contactos");
        GZ.guardar("contactos", [...mensajes, {...datos, fecha: new Date().toISOString()}].slice(-100));
        contacto.reset();
        mensaje.textContent = "Mensaje guardado en este navegador. No se ha enviado un correo a la tienda.";
    });
}).catch(() => {});
