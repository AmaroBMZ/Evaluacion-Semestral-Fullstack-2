// ==========================================
// COMPONENTE PRINCIPAL (App.tsx)
// ==========================================
// Este archivo actúa como el punto de entrada y orquestador de la aplicación.
// Aquí se gestionan los estados globales de la interfaz (productos, filtros,
// carrito de compras y notificaciones) usando el Hook `useState` de React.

import { useState } from "react";

// Estilos globales de Bootstrap y estilos personalizados del proyecto Sikosis Gaming
import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos.css";

// Importación de componentes modulares
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Contenedor from "./components/Contenedor";
import Tarjeta from "./components/Tarjeta";
import Footer from "./components/Footer";

// Importación de datos y tipos de TypeScript
import {
  productosIniciales,
  categoriasDisponibles,
  type Producto,
} from "./data/productos";

function App() {
  // -------------------------------------------------------------
  // 1. MANEJO DE ESTADOS CON EL HOOK useState
  // -------------------------------------------------------------
  // useState nos devuelve un arreglo con 2 elementos:
  // [0]: El valor actual del estado.
  // [1]: La función que permite actualizar ese estado y disparar el re-renderizado.

  // Estado que contiene la lista completa de productos cargados inicialmente
  const [productos] = useState<Producto[]>(productosIniciales);

  // Estado para la categoría seleccionada en los botones de filtro (por defecto "Todas")
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("Todas");

  // Estado para el texto ingresado en el buscador en tiempo real
  const [busqueda, setBusqueda] = useState<string>("");

  // Estado para la lista de productos que el usuario ha añadido al carrito
  const [carrito, setCarrito] = useState<Producto[]>([]);

  // Estado para mostrar avisos/mensajes temporales de confirmación al usuario
  const [mensajeAviso, setMensajeAviso] = useState<string>("");

  // -------------------------------------------------------------
  // 2. FUNCIONES CONTROLADORAS (HANDLERS)
  // -------------------------------------------------------------

  // Función que se dispara cuando el usuario presiona "Añadir al carrito" en cualquier tarjeta.
  // Recibe el objeto `producto` seleccionado desde el componente Tarjeta.
  const alAgregarCarrito = (producto: Producto) => {
    // Usamos el operador spread (...) para crear un nuevo arreglo sin mutar el estado anterior
    setCarrito((prev) => [...prev, producto]);

    // Mostramos un mensaje de confirmación
    setMensajeAviso(`¡"${producto.nombre}" añadido al carrito con éxito!`);

    // Configuramos un temporizador de 3 segundos para ocultar el mensaje automáticamente
    setTimeout(() => {
      setMensajeAviso("");
    }, 3000);
  };

  // -------------------------------------------------------------
  // 3. LÓGICA DE FILTRADO COMBINADO (CATEGORÍA + BUSCADOR)
  // -------------------------------------------------------------
  // En cada render, se calcula la lista de productos que cumplen ambas condiciones:
  // 1) Pertenecer a la categoría seleccionada (o que sea "Todas").
  // 2) Contener en el nombre el texto digitado en el buscador (insensible a mayúsculas/minúsculas).
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      producto.categoria === categoriaSeleccionada;

    const coincideTexto = producto.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    return coincideCategoria && coincideTexto;
  });

  // -------------------------------------------------------------
  // 4. RETORNO DE LA ESTRUCTURA JSX
  // -------------------------------------------------------------
  // Regla importante de JSX: Todo retorno debe tener un único elemento raíz.
  // Usamos un Fragment (<> ... </>) para agrupar múltiples elementos adyacentes
  // (Navbar, main, Footer) sin agregar nodos <div> innecesarios al DOM HTML.
  return (
    <>
      {/* Navbar: le pasamos la cantidad actual de productos en el carrito */}
      <Navbar cantidadCarrito={carrito.length} />

      {/* Contenedor principal con espaciado vertical de Bootstrap */}
      <main className="container py-4" id="contenido">
        {/* Barra superior de inicio de sesión / registro */}
        <div className="cuenta mb-4">
          <a href="#">Iniciar sesión</a> | <a href="#">Registrarse</a>
        </div>

        {/* RENDERIZADO CONDICIONAL CON && (Cortocircuito):
            Si `mensajeAviso` contiene texto, se renderiza la alerta. Si está vacío (""), se ignora. */}
        {mensajeAviso && (
          <div className="aviso mb-3" role="alert">
            {mensajeAviso}
          </div>
        )}

        {/* Sección Hero: banner visual de bienvenida */}
        <Hero />

        {/* Sección del Catálogo de Productos */}
        <section id="catalogo" className="mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h2>Productos destacados</h2>
              <p className="text-muted">
                Explora nuestro catálogo de demostración y arma tu carrito.
              </p>
            </div>

            {/* Controles de búsqueda y filtros */}
            <div className="d-flex gap-2 align-items-center flex-wrap">
              {/* Input controlado: su valor está atado al estado `busqueda` */}
              <input
                type="text"
                className="form-control"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ maxWidth: "220px" }}
              />

              {/* Botones de categorías generados dinámicamente con .map() */}
              <div className="btn-group" role="group">
                {categoriasDisponibles.map((cat) => (
                  <button
                    key={cat} // En React, todo elemento en una lista iterada requiere una `key` única
                    type="button"
                    className={`btn btn-sm ${
                      categoriaSeleccionada === cat
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setCategoriaSeleccionada(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-secondary">
            Mostrando {productosFiltrados.length} productos
          </p>

          {/* Grilla de productos: usamos el componente envoltorio Contenedor con la clase CSS Grid .productos-grid */}
          <Contenedor clase="productos-grid">
            {/* RENDERIZADO CONDICIONAL CON OPERADOR TERNARIO (? :)
                - Si hay productos filtrados: recorremos el arreglo con .map() y creamos una <Tarjeta /> por cada uno.
                - Si la lista está vacía: mostramos un mensaje informativo al usuario. */}
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <Tarjeta
                  key={producto.codigo}
                  producto={producto}
                  alAgregarCarrito={alAgregarCarrito}
                />
              ))
            ) : (
              <p>No se encontraron productos que coincidan con la búsqueda.</p>
            )}
          </Contenedor>
        </section>
      </main>

      {/* Pie de página con callback para cambiar de categoría al hacer clic en sus enlaces */}
      <Footer alFiltrarCategoria={(cat) => setCategoriaSeleccionada(cat)} />
    </>
  );
}

export default App;
