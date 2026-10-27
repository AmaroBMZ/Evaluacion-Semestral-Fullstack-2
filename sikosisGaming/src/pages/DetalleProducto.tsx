import { productosIniciales } from "../data/productos";
import Tarjeta from "../components/Tarjeta";
import type { Producto } from "../data/productos";
interface Props { codigo: string; alAgregarCarrito: (producto: Producto) => void; }
function DetalleProducto({ codigo, alAgregarCarrito }: Props) {
  const producto = productosIniciales.find((p) => p.codigo === codigo);
  if (!producto) return <main className="container py-4"><h1>Producto no encontrado</h1><p>El producto solicitado no está disponible.</p><a href="#productos">Volver al catálogo</a></main>;
  const precio = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(producto.precio);
  return <main className="container py-4"><p className="categoria">{producto.categoria}</p><h1>{producto.nombre}</h1><section className="panel p-4 detalle-grid"><img src={producto.imagen} alt={producto.nombre} className="foto-detalle" /><div><h2>Descripción</h2><p>{producto.descripcion}</p><p className="precio mt-3">{precio}</p><p>Disponibilidad: {producto.stock > 0 ? `${producto.stock} unidades` : "Agotado"}</p><button className="btn boton-verde" disabled={producto.stock === 0} onClick={() => alAgregarCarrito(producto)}>Añadir al carrito</button></div></section><p className="mt-3"><a href="#productos">Volver al catálogo</a> · <a href="#carrito">Ver carrito</a></p></main>;
}
export default DetalleProducto;
