import { useEffect, useState, type ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./estilos.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Blog from "./pages/Blog";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Cliente from "./pages/Cliente";
import Admin from "./pages/Admin";
import DetalleProducto from "./pages/DetalleProducto";
import type { Producto } from "./data/productos";
import type { UsuarioDemo } from "./data/usuarios";

const codigoPorRuta: Record<string, string> = { audifonos: "audifonos", consola: "consola", control: "control", juegos: "juegos", mouse: "mouse", portatil: "portatil", setup: "setup", teclado: "teclado" };
const esRuta = (ruta: string) => ["inicio", "productos", "producto", "carrito", "blog", "nosotros", "contacto", "login", "registro", "cliente", "admin", "admin-productos", "admin-ordenes", "admin-usuarios", "admin-mensajes"].includes(ruta) || ruta.startsWith("detalle-");
function App() {
  const [vista, setVista] = useState(window.location.hash.slice(1) || "inicio");
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [usuarioActivo, setUsuarioActivo] = useState<UsuarioDemo | null>(null);
  const [aviso, setAviso] = useState("");
  useEffect(() => {
    const sincronizar = () => {
      const ruta = window.location.hash.slice(1);
      if (esRuta(ruta)) setVista(ruta);
    };
    window.addEventListener("hashchange", sincronizar);
    return () => window.removeEventListener("hashchange", sincronizar);
  }, []);
  const agregar = (producto: Producto) => {
    setCarrito((actual) => [...actual, producto]);
    setAviso(`${producto.nombre} se agregó al carrito.`);
    window.setTimeout(() => setAviso(""), 3000);
  };
  const quitar = (codigo: string) => setCarrito((actual) => {
    const indice = actual.findIndex((producto) => producto.codigo === codigo);
    return indice < 0 ? actual : actual.filter((_, i) => i !== indice);
  });
  const ingresar = (usuario: UsuarioDemo) => {
    setUsuarioActivo(usuario);
    const destino = usuario.rol === "Cliente" ? "cliente" : usuario.rol === "Vendedor" ? "admin-productos" : "admin";
    setVista(destino);
    window.location.hash = destino;
  };
  const salir = () => {
    setUsuarioActivo(null);
    setVista("inicio");
    window.location.hash = "inicio";
  };
  let contenido: ReactNode;
  const accesoDenegado = (vista === "cliente" && usuarioActivo?.rol !== "Cliente") || (vista.startsWith("admin-") && (usuarioActivo === null || (usuarioActivo.rol === "Vendedor" && !["admin-productos", "admin-ordenes"].includes(vista)) || usuarioActivo.rol === "Cliente")) || (vista === "admin" && usuarioActivo?.rol !== "Administrador");
  if (accesoDenegado) contenido = <main className="container py-4"><h1>Acceso restringido</h1><p>Inicia sesión con una cuenta que tenga permiso para ver esta sección.</p><a className="btn boton-verde mt-3" href="#login">Iniciar sesión</a></main>;
  else if (vista === "productos" || vista === "producto") contenido = <Productos alAgregarCarrito={agregar} />;
  else if (vista === "carrito") contenido = <Carrito carrito={carrito} alQuitar={quitar} />;
  else if (vista === "blog") contenido = <Blog />;
  else if (vista === "nosotros") contenido = <Nosotros />;
  else if (vista === "contacto") contenido = <Contacto />;
  else if (vista === "login") contenido = <Login alIngresar={ingresar} />;
  else if (vista === "registro") contenido = <Registro />;
  else if (vista === "cliente") contenido = <Cliente />;
  else if (vista === "admin" || vista.startsWith("admin-")) contenido = <Admin vista={vista} />;
  else if (vista.startsWith("detalle-")) {
    const slug = vista.slice("detalle-".length);
    const codigo = slug === "producto" ? new URLSearchParams(window.location.search).get("codigo") ?? "" : codigoPorRuta[slug] ?? "";
    contenido = <DetalleProducto codigo={codigo} alAgregarCarrito={agregar} />;
  } else contenido = <Inicio />;
  return <><Navbar cantidadCarrito={carrito.length} usuario={usuarioActivo} alSalir={salir} /><a className="saltar" href="#contenido">Saltar al contenido</a>{aviso && <div className="container aviso" role="status">{aviso}</div>}{contenido}<Footer /></>;
}
export default App;
