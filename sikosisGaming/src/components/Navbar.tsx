import Boton2 from "./Boton2";

// ==========================================
// COMPONENTE NAVBAR / HEADER
// ==========================================
// Muestra la cabecera del sitio:
// - Logotipo y nombre de la tienda
// - Menú de navegación principal
// - Botón de acceso al Carrito que refleja en tiempo real la cantidad acumulada
interface Props {
  cantidadCarrito: number; // Número total de artículos en el carrito recibido desde App.tsx
}

function Navbar({ cantidadCarrito }: Props) {
  return (
    <header>
      <nav className="container py-3" aria-label="Navegación principal">
        <div className="barra">
          {/* Marca / Logo */}
          <a className="marca" href="#">
            <img
              className="logo"
              src="/imagenes/SG_logo.png"
              alt="Logo SG de Sikosis Gaming"
              width="80"
              height="62"
            />
            Sikosis Gaming
          </a>

          {/* Enlaces de navegación */}
          <ul className="nav">
            <li className="nav-item">
              <a className="nav-link activo" href="#" aria-current="page">
                Inicio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#catalogo">
                Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Nosotros
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Blog
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Contacto
              </a>
            </li>
          </ul>

          {/* Botón Carrito con contador reactivo */}
          <Boton2 tipo="verde">
            Carrito ({cantidadCarrito})
          </Boton2>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
