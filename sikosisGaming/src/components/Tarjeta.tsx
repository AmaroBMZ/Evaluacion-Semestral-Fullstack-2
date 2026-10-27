import TarjetaCuerpo from "./TarjetaCuerpo";
import Boton2 from "./Boton2";
import type { Producto } from "../data/productos";
interface Props { producto: Producto; alAgregarCarrito?: (producto: Producto) => void; }
function Tarjeta({ producto, alAgregarCarrito }: Props) {
  const { nombre, categoria, precio, stock, imagen, descripcion } = producto;
  return <article className="card"><img src={imagen} alt={nombre} className="card-img-top foto-producto" loading="lazy" /><TarjetaCuerpo categoria={categoria} titulo={nombre} precio={precio} stock={stock} texto={descripcion}><div className="mt-auto pt-2 w-100"><a className="btn btn-outline-dark w-100 mb-2" href={`#detalle-${producto.codigo}`}>Ver detalle</a><Boton2 tipo="verde" deshabilitado={stock === 0} alClikear={() => alAgregarCarrito?.(producto)}>{stock === 0 ? "Agotado" : "Añadir al carrito"}</Boton2></div></TarjetaCuerpo></article>;
}
export default Tarjeta;
