// Datos de ejemplo: se copian al navegador la primera vez que se abre la tienda.
// Se pueden modificar después desde el panel de administración.
const productosIniciales = [
    { codigo: "control", nombre: "Control inalámbrico", categoria: "Accesorios", precio: 54990, stock: 12, critico: 3, imagen: "imagenes/control.jpg", descripcion: "Control de demostración con botones, palancas y conexión inalámbrica para tus partidas." },
    { codigo: "consola", nombre: "Consola clásica", categoria: "Consolas", precio: 129990, stock: 8, critico: 2, imagen: "imagenes/consola.jpg", descripcion: "Consola de demostración para disfrutar videojuegos en casa. Incluye un control de referencia." },
    { codigo: "audifonos", nombre: "Audífonos", categoria: "Accesorios", precio: 44990, stock: 15, critico: 3, imagen: "imagenes/audifonos.jpg", descripcion: "Audífonos de demostración para escuchar el sonido de tus videojuegos con comodidad." },
    { codigo: "teclado", nombre: "Teclado compacto", categoria: "Accesorios", precio: 64990, stock: 10, critico: 2, imagen: "imagenes/teclado.jpg", descripcion: "Teclado de demostración con formato compacto para aprovechar mejor el escritorio." },
    { codigo: "mouse", nombre: "Mouse de escritorio", categoria: "Accesorios", precio: 29990, stock: 20, critico: 4, imagen: "imagenes/mouse.jpg", descripcion: "Mouse de demostración para navegar y jugar en el computador." },
    { codigo: "portatil", nombre: "Consola portátil", categoria: "Consolas", precio: 299990, stock: 5, critico: 2, imagen: "imagenes/portatil.jpg", descripcion: "Consola de demostración con pantalla y controles integrados para jugar donde prefieras." },
    { codigo: "juegos", nombre: "Selección de videojuegos", categoria: "Videojuegos", precio: 39990, stock: 18, critico: 3, imagen: "imagenes/juegos.jpg", descripcion: "Selección de videojuegos de demostración. Los productos, imágenes y precios de esta tienda son ejemplos académicos." },
    { codigo: "setup", nombre: "Monitor para jugar", categoria: "Accesorios", precio: 189990, stock: 3, critico: 3, imagen: "imagenes/setup.jpg", descripcion: "Monitor de demostración para completar tu espacio de juego y mostrar tus partidas." }
];

// Estas cuentas son públicas y sirven solamente para la evaluación.
// Las claves locales NO ofrecen seguridad real. No usar datos ni claves personales.
const usuariosIniciales = [
    { run: "111111111", nombre: "Administrador", apellidos: "Demo", correo: "admin@duoc.cl", clave: "Admin123", rol: "Administrador", activo: true, nacimiento: "", region: "Metropolitana de Santiago", comuna: "Santiago", direccion: "Dirección de demostración 1" },
    { run: "222222222", nombre: "Vendedor", apellidos: "Demo", correo: "vendedor@duoc.cl", clave: "Venta123", rol: "Vendedor", activo: true, nacimiento: "", region: "Metropolitana de Santiago", comuna: "Santiago", direccion: "Dirección de demostración 2" },
    { run: "333333333", nombre: "Cliente", apellidos: "Demo", correo: "cliente@gmail.com", clave: "Cliente123", rol: "Cliente", activo: true, nacimiento: "", region: "Metropolitana de Santiago", comuna: "Santiago", direccion: "Dirección de demostración 3" }
];
const categorias = ["Accesorios", "Consolas", "Videojuegos"];
