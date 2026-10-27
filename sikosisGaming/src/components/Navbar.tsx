import type { UsuarioDemo } from "../data/usuarios";
interface Props { cantidadCarrito: number; usuario?: UsuarioDemo | null; alSalir?: () => void; }
function Navbar({ cantidadCarrito, usuario, alSalir }: Props) {
  const links: [string, string][] = [["Inicio", "#inicio"], ["Productos", "#productos"], ["Nosotros", "#nosotros"], ["Blog", "#blog"], ["Contacto", "#contacto"]];
  const destinoCuenta = usuario?.rol === "Cliente" ? "#cliente" : usuario?.rol === "Vendedor" ? "#admin-productos" : "#admin";
  return <header><nav className="container py-3" aria-label="Navegación principal"><div className="barra">
    <a className="marca" href="#inicio"><img className="logo" src="/imagenes/SG_logo.png" alt="" width="80" height="62" /> Sikosis Gaming</a>
    <ul className="nav">{links.map(([nombre, href]) => <li className="nav-item" key={href}><a className="nav-link" href={href}>{nombre}</a></li>)}</ul>
    <div className="d-flex flex-wrap gap-2 align-items-center">{usuario ? <><a className="btn btn-outline-dark" href={destinoCuenta}>{usuario.nombre} ({usuario.rol})</a><button className="btn btn-outline-dark" type="button" onClick={alSalir}>Cerrar sesión</button></> : <><a className="btn btn-outline-dark" href="#login">Ingresar</a><a className="btn btn-outline-dark" href="#registro">Registrarse</a></>}<a className="btn boton-verde" href="#carrito">Carrito ({cantidadCarrito})</a></div>
  </div></nav></header>;
}
export default Navbar;
