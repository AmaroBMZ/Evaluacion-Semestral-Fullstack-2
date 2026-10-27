// ==========================================
// DEFINICIÓN DE TIPOS Y MODELO DE DATOS
// ==========================================

// En TypeScript utilizamos interfaces para definir la "forma" o contrato
// que deben cumplir los objetos de nuestra aplicación. Esto previene errores
// al acceder a propiedades inexistentes o de tipo incorrecto.
export interface Producto {
  codigo: string;       // Identificador único (ej: "control", "consola")
  nombre: string;       // Nombre legible para mostrar en la tarjeta
  categoria: string;    // Categoría para aplicar filtros (ej: "Accesorios", "Consolas")
  precio: number;       // Precio numérico para permitir cálculos y formatos
  stock: number;        // Unidades disponibles en inventario
  critico?: number | null; // Umbral opcional de stock crítico (? indica que es opcional)
  imagen: string;       // Ruta a la imagen (en public/imagenes/)
  descripcion: string;  // Descripción detallada del producto
}

// Arreglo inicial de productos que simula una base de datos o respuesta de una API.
// Este arreglo servirá como estado inicial en React mediante useState.
export const productosIniciales: Producto[] = [
  {
    codigo: "control",
    nombre: "Control inalámbrico",
    categoria: "Accesorios",
    precio: 54990,
    stock: 12,
    critico: 3,
    imagen: "/imagenes/control.jpg",
    descripcion: "Control de demostración con botones, palancas y conexión inalámbrica para tus partidas."
  },
  {
    codigo: "consola",
    nombre: "Consola clásica",
    categoria: "Consolas",
    precio: 129990,
    stock: 8,
    critico: 2,
    imagen: "/imagenes/consola.jpg",
    descripcion: "Consola de demostración para disfrutar videojuegos en casa. Incluye un control de referencia."
  },
  {
    codigo: "audifonos",
    nombre: "Audífonos",
    categoria: "Accesorios",
    precio: 44990,
    stock: 15,
    critico: 3,
    imagen: "/imagenes/audifonos.jpg",
    descripcion: "Audífonos de demostración para escuchar el sonido de tus videojuegos con comodidad."
  },
  {
    codigo: "teclado",
    nombre: "Teclado compacto",
    categoria: "Accesorios",
    precio: 64990,
    stock: 10,
    critico: 2,
    imagen: "/imagenes/teclado.jpg",
    descripcion: "Teclado de demostración con formato compacto para aprovechar mejor el escritorio."
  },
  {
    codigo: "mouse",
    nombre: "Mouse de escritorio",
    categoria: "Accesorios",
    precio: 29990,
    stock: 20,
    critico: 4,
    imagen: "/imagenes/mouse.jpg",
    descripcion: "Mouse de demostración para navegar y jugar en el computador."
  },
  {
    codigo: "portatil",
    nombre: "Consola portátil",
    categoria: "Consolas",
    precio: 299990,
    stock: 5,
    critico: 2,
    imagen: "/imagenes/portatil.jpg",
    descripcion: "Consola de demostración con pantalla y controles integrados para jugar donde prefieras."
  },
  {
    codigo: "juegos",
    nombre: "Selección de videojuegos",
    categoria: "Videojuegos",
    precio: 39990,
    stock: 18,
    critico: 3,
    imagen: "/imagenes/juegos.jpg",
    descripcion: "Selección de videojuegos de demostración. Los productos, imágenes y precios de esta tienda son ejemplos académicos."
  },
  {
    codigo: "setup",
    nombre: "Monitor para jugar",
    categoria: "Accesorios",
    precio: 189990,
    stock: 3,
    critico: 3,
    imagen: "/imagenes/setup.jpg",
    descripcion: "Monitor de demostración para completar tu espacio de juego y mostrar tus partidas."
  }
];

// Lista de categorías disponibles para generar los botones de filtro dinámicamente.
export const categoriasDisponibles: string[] = [
  "Todas",
  "Accesorios",
  "Consolas",
  "Videojuegos"
];
