// SIKOSIS GAMING: funciones compartidas por la tienda y la administración.
// No se usan frameworks. Los datos se guardan en este navegador (prototipo académico).
const CLAVE_DATOS = "sikosis-datos-v1";
const CLAVE_SESION = "sikosis-sesion-v1";
let almacenamientoDisponible = true;

function datosVacios() {
    // Copiamos los arreglos para no modificar las constantes de ejemplo al editar.
    return { productos: JSON.parse(JSON.stringify(productosIniciales)), usuarios: JSON.parse(JSON.stringify(usuariosIniciales)), carritos: {}, ordenes: [], mensajes: [] };
}

function cargarDatos() {
    try {
        const texto = localStorage.getItem(CLAVE_DATOS);
        if (!texto) return datosVacios();
        const datos = JSON.parse(texto);
        if (!Array.isArray(datos.productos) || !Array.isArray(datos.usuarios) ||
            !Array.isArray(datos.ordenes) || !Array.isArray(datos.mensajes) ||
            !datos.carritos || typeof datos.carritos !== "object" || Array.isArray(datos.carritos)) {
            throw new Error("Formato incorrecto");
        }
        return datos;
    } catch (error) {
        almacenamientoDisponible = false;
        return datosVacios();
    }
}

let datos = cargarDatos();

// Solo se muestra éxito después de guardar. Si falla, recuperamos la última versión.
function guardarDatos() {
    if (!almacenamientoDisponible) {
        avisar("El almacenamiento no está disponible. No se guardó el cambio.", true);
        datos = cargarDatos();
        return false;
    }
    try {
        localStorage.setItem(CLAVE_DATOS, JSON.stringify(datos));
        return true;
    } catch (error) {
        datos = cargarDatos();
        avisar("No se pudo guardar. Revisa el espacio y los permisos del navegador.", true);
        return false;
    }
}

function usuarioActual() {
    try {
        const correo = sessionStorage.getItem(CLAVE_SESION);
        return datos.usuarios.find(function (usuario) { return usuario.correo === correo && usuario.activo; });
    } catch (error) {
        return undefined;
    }
}

function esAdministrador() {
    const usuario = usuarioActual();
    return usuario && usuario.rol === "Administrador";
}

// Escapamos lo escrito por el usuario antes de colocarlo en una plantilla HTML.
function escapar(texto) {
    return String(texto ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function dinero(numero) {
    return "$" + Number(numero).toLocaleString("es-CL", { maximumFractionDigits: 2 });
}

function avisar(texto, error = false) {
    const caja = document.getElementById("aviso");
    if (!caja) return;
    caja.textContent = texto;
    caja.className = error ? "aviso aviso-error" : "aviso";
    caja.hidden = false;
}

function imagenSegura(ruta) {
    // Se aceptan imágenes locales y enlaces HTTPS, nunca código o rutas arbitrarias.
    // Los datos conservan imagenes/...; las páginas están un nivel más abajo.
    if (/^imagenes\/[\w.-]+$/.test(ruta)) return "../" + ruta;
    if (/^https:\/\/[^\s]+$/i.test(ruta)) return ruta;
    return "../imagenes/SG_logo.png";
}

function buscarProducto(codigo) {
    return datos.productos.find(function (producto) { return producto.codigo === codigo; });
}

function enlaceDetalle(codigo) {
    return "detalle-producto.html?codigo=" + encodeURIComponent(codigo);
}

function actualizarCuenta() {
    const cuenta = document.querySelector(".cuenta");
    const usuario = usuarioActual();
    if (cuenta && usuario) {
        cuenta.innerHTML = "<span>Hola, " + escapar(usuario.nombre) + "</span> " +
            (usuario.rol !== "Cliente" ? '<a href="admin.html">Panel de gestión</a> ' : "") +
            '<button class="btn btn-outline-dark btn-sm" id="cerrar-sesion">Cerrar sesión</button>';
        document.getElementById("cerrar-sesion").addEventListener("click", function () {
            sessionStorage.removeItem(CLAVE_SESION);
            location.href = "Inicio.html";
        });
    }
    actualizarContador();
}

// Una cuenta conserva su carrito aunque cierre sesión; el visitante tiene otro separado.
function claveCarrito() {
    const usuario = usuarioActual();
    return usuario ? usuario.correo : "visitante";
}

function carritoActual() {
    return datos.carritos[claveCarrito()] || [];
}

function actualizarContador() {
    let cantidad = 0;
    carritoActual().forEach(function (item) { cantidad += item.cantidad; });
    document.querySelectorAll('a[href="carrito.html"]').forEach(function (enlace) {
        if (enlace.classList.contains("boton-verde")) enlace.textContent = "Carrito (" + cantidad + ")";
    });
}

function agregarCarrito(codigo, cantidad) {
    const producto = buscarProducto(codigo);
    if (!producto) return avisar("El producto ya no está disponible.", true);
    const carrito = carritoActual();
    const item = carrito.find(function (fila) { return fila.codigo === codigo; });
    const acumulado = (item ? item.cantidad : 0) + cantidad;
    if (!Number.isInteger(cantidad) || cantidad < 1 || acumulado > producto.stock) {
        return avisar("Ingresa una cantidad entera disponible. Stock: " + producto.stock + ".", true);
    }
    if (item) item.cantidad = acumulado;
    else carrito.push({ codigo: codigo, cantidad: cantidad });
    datos.carritos[claveCarrito()] = carrito;
    if (guardarDatos()) {
        actualizarContador();
        avisar(producto.nombre + " añadido al carrito.");
    }
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

function mostrarCarrito() {
    const contenedor = document.getElementById("contenido-carrito");
    if (!contenedor) return;
    const carrito = carritoActual();
    let total = 0;
    let valido = carrito.length > 0;
    contenedor.innerHTML = carrito.map(function (item) {
        const producto = buscarProducto(item.codigo);
        if (!producto) {
            valido = false;
            return '<article class="fila-carrito"><p>Producto eliminado: ' + escapar(item.codigo) + '</p><button class="btn btn-outline-dark" data-quitar="' + escapar(item.codigo) + '">Quitar</button></article>';
        }
        const subtotal = Math.round(producto.precio * item.cantidad * 100) / 100;
        total += subtotal;
        if (item.cantidad > producto.stock) valido = false;
        return '<article class="fila-carrito"><img src="' + escapar(imagenSegura(producto.imagen)) + '" alt="' + escapar(producto.nombre) + '" width="100" height="80">' +
            '<div><h2 class="h5">' + escapar(producto.nombre) + '</h2><p>' + dinero(producto.precio) + ' por unidad. Stock: ' + producto.stock + '</p>' +
            (item.cantidad > producto.stock ? '<p class="error-campo">Reduce la cantidad: supera el stock disponible.</p>' : "") +
            '<label>Cantidad <input aria-label="Cantidad de ' + escapar(producto.nombre) + '" class="form-control cantidad" type="number" min="1" max="' + producto.stock + '" step="1" value="' + item.cantidad + '" data-cantidad="' + escapar(item.codigo) + '"></label></div>' +
            '<div><p>Subtotal: ' + dinero(subtotal) + '</p><button class="btn btn-outline-dark" data-quitar="' + escapar(item.codigo) + '">Quitar</button></div></article>';
    }).join("") || '<p>Tu carrito está vacío. <a href="producto.html">Explora los productos</a>.</p>';
    document.getElementById("total-carrito").textContent = dinero(total);
    document.getElementById("confirmar-pedido").disabled = !valido;
    document.getElementById("vaciar-carrito").disabled = carrito.length === 0;
    actualizarContador();
}

// Pedido académico: guardamos una copia de nombres y precios para conservar el historial.
function confirmarPedido() {
    const usuario = usuarioActual();
    if (!usuario || usuario.rol !== "Cliente") return avisar("Inicia sesión con una cuenta Cliente para confirmar un pedido de demostración.", true);
    // Volvemos a leer antes de comprar para comprobar el stock más reciente.
    datos = cargarDatos();
    const carrito = carritoActual();
    if (!carrito.length) return avisar("El carrito está vacío.", true);
    const items = [];
    let total = 0;
    for (const item of carrito) {
        const producto = buscarProducto(item.codigo);
        if (!producto || !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > producto.stock) {
            mostrarCarrito();
            return avisar("Revisa las cantidades: cambió la disponibilidad.", true);
        }
        items.push({ codigo: producto.codigo, nombre: producto.nombre, precio: producto.precio, cantidad: item.cantidad });
        total += Math.round(producto.precio * item.cantidad * 100) / 100;
    }
    if (!confirm("¿Confirmar este pedido de demostración? Se descontará el stock, sin cobros ni despachos.")) return;
    items.forEach(function (item) { buscarProducto(item.codigo).stock -= item.cantidad; });
    const numero = "SG-" + Date.now();
    datos.ordenes.push({ numero: numero, fecha: new Date().toISOString(), cliente: usuario.correo, items: items, total: Math.round(total * 100) / 100, estado: "Demostración confirmada" });
    datos.carritos[claveCarrito()] = [];
    if (guardarDatos()) {
        mostrarCarrito();
        avisar("Pedido " + numero + " registrado. No se realizó ningún cobro.");
    }
}

// El módulo 11 calcula el dígito verificador del RUN.
function runValido(run) {
    if (!/^\d{6,8}[\dKk]$/.test(run) || /^0+$/.test(run.slice(0, -1))) return false;
    let suma = 0;
    let multiplicador = 2;
    for (let i = run.length - 2; i >= 0; i--) {
        suma += Number(run[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - suma % 11;
    const digito = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return run.slice(-1).toUpperCase() === digito;
}

function errorCampo(campo, mensaje) {
    let error = document.getElementById(campo.id + "-error");
    if (!error) {
        error = document.createElement("small");
        error.id = campo.id + "-error";
        error.className = "error-campo";
        error.setAttribute("aria-live", "polite");
        campo.insertAdjacentElement("afterend", error);
        campo.setAttribute("aria-describedby", ((campo.getAttribute("aria-describedby") || "") + " " + error.id).trim());
    }
    error.textContent = mensaje;
    campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
    return !mensaje;
}

// Reglas compartidas por todos los formularios. true significa que el campo es válido.
function validarCampo(campo) {
    if (campo.disabled || campo.type === "submit" || campo.type === "button") return true;
    const valor = campo.value.trim();
    let mensaje = "";
    if (campo.required && !valor) mensaje = "Completa este campo.";
    else if (valor && campo.maxLength > 0 && valor.length > campo.maxLength) mensaje = "Máximo " + campo.maxLength + " caracteres.";
    else if (valor && campo.minLength > 0 && valor.length < campo.minLength) mensaje = "Mínimo " + campo.minLength + " caracteres.";
    else if (valor && campo.type === "email" && !/^[^@\s]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(valor)) mensaje = "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    else if (campo.id === "run" && valor && !runValido(valor)) mensaje = "RUN inválido. Escríbelo sin puntos ni guion y revisa el dígito verificador.";
    else if (campo.id === "confirmar-clave" && valor !== document.getElementById("clave-registro").value) mensaje = "Las contraseñas deben coincidir.";
    else if (campo.type === "number" && valor) {
        const numero = Number(valor);
        if (!Number.isFinite(numero) || numero < Number(campo.min || 0)) mensaje = "Ingresa un número mayor o igual a " + (campo.min || 0) + ".";
        else if (campo.step === "1" && !Number.isInteger(numero)) mensaje = "Ingresa un número entero.";
    } else if (campo.id === "imagen" && valor && !/^imagenes\/[\w.-]+$/.test(valor) && !/^https:\/\/[^\s]+$/i.test(valor)) mensaje = "Usa una ruta imagenes/archivo.jpg o un enlace HTTPS.";
    if (!mensaje && campo.type === "date" && valor && valor > new Date().toISOString().slice(0, 10)) mensaje = "La fecha no puede ser futura.";
    return errorCampo(campo, mensaje);
}

function prepararFormulario(formulario, alEnviar) {
    // Desactivamos los mensajes nativos para mostrar nuestros propios mensajes en español.
    formulario.noValidate = true;
    formulario.querySelectorAll("input, select, textarea").forEach(function (campo) {
        campo.addEventListener("input", function () {
            validarCampo(campo);
            if (campo.id === "clave-registro" && document.getElementById("confirmar-clave").value) validarCampo(document.getElementById("confirmar-clave"));
        });
        campo.addEventListener("change", function () { validarCampo(campo); });
        campo.addEventListener("blur", function () { validarCampo(campo); });
    });
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        let valido = true;
        formulario.querySelectorAll("input, select, textarea").forEach(function (campo) {
            if (!validarCampo(campo)) valido = false;
        });
        if (!valido) {
            formulario.querySelector('[aria-invalid="true"]').focus();
            return avisar("Revisa los campos indicados antes de continuar.", true);
        }
        alEnviar();
    });
}

function cargarRegiones() {
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    if (!region || !comuna) return;
    region.innerHTML = '<option value="">Selecciona una región</option>' + regiones.map(function (item) {
        return '<option value="' + escapar(item.nombre) + '">' + escapar(item.nombre) + '</option>';
    }).join("");
    region.addEventListener("change", cargarComunas);
    cargarComunas();
}

// Al cambiar región borramos la comuna anterior para evitar combinaciones incorrectas.
function cargarComunas() {
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const seleccion = regiones.find(function (item) { return item.nombre === region.value; });
    comuna.disabled = !seleccion;
    comuna.innerHTML = '<option value="">Selecciona una comuna</option>' + (seleccion ? seleccion.comunas.map(function (nombre) {
        return '<option value="' + escapar(nombre) + '">' + escapar(nombre) + '</option>';
    }).join("") : "");
}

function leerUsuario() {
    return {
        run: document.getElementById("run").value.trim().toUpperCase(),
        nombre: document.getElementById("nombre").value.trim(),
        apellidos: document.getElementById("apellidos").value.trim(),
        correo: document.getElementById("correo-registro").value.trim().toLowerCase(),
        clave: document.getElementById("clave-registro").value,
        nacimiento: document.getElementById("nacimiento").value,
        direccion: document.getElementById("direccion").value.trim(),
        region: document.getElementById("region").value,
        comuna: document.getElementById("comuna").value,
        rol: "Cliente", activo: true
    };
}

// En edición se ignora la misma cuenta, pero no los datos de las demás personas.
function usuarioRepetido(usuario, correoAnterior = "") {
    const repetido = datos.usuarios.find(function (otro) {
        return otro.correo !== correoAnterior && (otro.correo === usuario.correo || otro.run === usuario.run);
    });
    if (repetido) {
        const campo = repetido.correo === usuario.correo ? "correo-registro" : "run";
        errorCampo(document.getElementById(campo), "Este dato ya pertenece a otra cuenta.");
        document.getElementById(campo).focus();
        return true;
    }
    return false;
}

function prepararCuentas() {
    const registro = document.getElementById("form-registro");
    if (registro) prepararFormulario(registro, function () {
        const usuario = leerUsuario();
        if (usuarioRepetido(usuario)) return;
        datos.usuarios.push(usuario);
        if (guardarDatos()) {
            registro.reset(); cargarComunas();
            avisar("Cuenta creada. Ahora puedes iniciar sesión con tu correo y contraseña.");
        }
    });
    const login = document.getElementById("form-login");
    if (login) prepararFormulario(login, function () {
        const correo = document.getElementById("correo-ingreso").value.trim().toLowerCase();
        const clave = document.getElementById("clave-ingreso").value;
        const usuario = datos.usuarios.find(function (item) { return item.correo === correo && item.clave === clave && item.activo; });
        if (!usuario) return avisar("Correo o contraseña incorrectos, o cuenta desactivada.", true);
        try { sessionStorage.setItem(CLAVE_SESION, correo); }
        catch (error) { return avisar("El navegador no permite guardar la sesión.", true); }
        // Si había una selección como visitante, la unimos al carrito del cliente sin superar stock.
        if (usuario.rol === "Cliente" && datos.carritos.visitante && datos.carritos.visitante.length) {
            const carrito = carritoActual();
            datos.carritos.visitante.forEach(function (item) {
                const producto = buscarProducto(item.codigo);
                if (!producto || producto.stock === 0) return;
                const existente = carrito.find(function (fila) { return fila.codigo === item.codigo; });
                if (existente) existente.cantidad = Math.min(producto.stock, existente.cantidad + item.cantidad);
                else carrito.push({ codigo: item.codigo, cantidad: Math.min(item.cantidad, producto.stock) });
            });
            datos.carritos[correo] = carrito;
            datos.carritos.visitante = [];
        }
        if (!guardarDatos()) { sessionStorage.removeItem(CLAVE_SESION); return; }
        location.href = usuario.rol === "Cliente" ? "carrito.html" : "admin.html";
    });
    const contacto = document.getElementById("form-contacto");
    if (contacto) prepararFormulario(contacto, function () {
        datos.mensajes.push({ fecha: new Date().toISOString(), nombre: document.getElementById("contacto-nombre").value.trim(), correo: document.getElementById("contacto-correo").value.trim(), comentario: document.getElementById("comentario").value.trim() });
        if (guardarDatos()) {
            contacto.reset();
            avisar("Mensaje guardado en esta demostración. El administrador puede verlo en su panel; no se envió un correo real.");
        }
    });
}

// Inicio común: los scripts se cargan con defer, después de leer todo el HTML.
actualizarCuenta();
cargarRegiones();
prepararCuentas();
mostrarCatalogo();
mostrarDetalle();
mostrarCarrito();
if (!almacenamientoDisponible) avisar("No se pudieron leer los datos guardados. La navegación sigue disponible, pero no se guardarán cambios. Revisa el almacenamiento del navegador.", true);

const busqueda = document.getElementById("form-busqueda");
if (busqueda) {
    // Los enlaces del footer también pueden elegir una categoría del catálogo.
    const categoriaURL = new URLSearchParams(location.search).get("categoria");
    if (categorias.includes(categoriaURL)) {
        document.getElementById("categoria").value = categoriaURL;
        mostrarCatalogo();
    }
    busqueda.addEventListener("submit", function (evento) { evento.preventDefault(); mostrarCatalogo(); });
    document.getElementById("buscar").addEventListener("input", mostrarCatalogo);
    document.getElementById("categoria").addEventListener("change", mostrarCatalogo);
}

// Señalamos la sección actual para quienes navegan con lector de pantalla.
document.querySelectorAll("header .nav-link").forEach(function (enlace) {
    const actual = enlace.getAttribute("href") === location.pathname.split("/").pop();
    enlace.classList.toggle("activo", actual);
    if (actual) enlace.setAttribute("aria-current", "page");
    else enlace.removeAttribute("aria-current");
});

// Un único evento maneja los botones de las tarjetas creadas con JavaScript.
document.addEventListener("click", function (evento) {
    const agregar = evento.target.closest("[data-agregar]");
    if (agregar) agregarCarrito(agregar.dataset.agregar, 1);
    const quitar = evento.target.closest("[data-quitar]");
    if (quitar) {
        datos.carritos[claveCarrito()] = carritoActual().filter(function (item) { return item.codigo !== quitar.dataset.quitar; });
        if (guardarDatos()) { mostrarCarrito(); avisar("Producto retirado del carrito."); }
    }
});
document.addEventListener("change", function (evento) {
    const campo = evento.target;
    if (!campo.dataset.cantidad) return;
    const producto = buscarProducto(campo.dataset.cantidad);
    const cantidad = Number(campo.value);
    if (!producto || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > producto.stock) {
        avisar("La cantidad debe ser un entero entre 1 y el stock disponible.", true);
        mostrarCarrito(); return;
    }
    carritoActual().find(function (item) { return item.codigo === producto.codigo; }).cantidad = cantidad;
    if (guardarDatos()) mostrarCarrito();
});
const vaciar = document.getElementById("vaciar-carrito");
if (vaciar) vaciar.addEventListener("click", function () {
    if (!confirm("¿Quitar todos los productos del carrito?")) return;
    datos.carritos[claveCarrito()] = [];
    if (guardarDatos()) { mostrarCarrito(); avisar("Carrito vacío."); }
});
const pedido = document.getElementById("confirmar-pedido");
if (pedido) pedido.addEventListener("click", confirmarPedido);

// Las imágenes rotas usan el logo como alternativa, sin repetir el error.
document.addEventListener("error", function (evento) {
    if (evento.target.tagName === "IMG" && !evento.target.src.endsWith("SG_logo.png")) evento.target.src = "../imagenes/SG_logo.png";
}, true);

// Si otra pestaña guarda cambios, actualizamos la vista para no trabajar con datos antiguos.
window.addEventListener("storage", function (evento) {
    if (evento.key === CLAVE_DATOS) location.reload();
});
