import type { Producto } from "../data/productos";

interface Props { carrito: Producto[]; alQuitar: (codigo: string) => void; }
function Carrito({ carrito, alQuitar }: Props) {
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);
  const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  return (
    <main className="container py-4">
      <p className="categoria">TU COMPRA</p><h1>Carrito</h1><p className="mb-4">Revisa los productos que agregaste. Esta tienda realiza una simulación académica y no procesa pagos ni despachos.</p>
      {carrito.length === 0 ? <section className="panel p-4"><h2>Tu carrito está vacío</h2><p>Cuando agregues productos desde el catálogo aparecerán aquí.</p><a className="btn boton-verde mt-3" href="#productos">Explorar productos</a></section> : <div className="carrito-grid"><section className="panel p-4" aria-label="Productos en el carrito">{carrito.map((p, i) => <article className="fila-carrito" key={`${p.codigo}-${i}`}><img src={p.imagen} alt="" width="100" height="80" /><div><h2 className="h5">{p.nombre}</h2><p>{p.categoria} · {clp.format(p.precio)}</p></div><button className="btn btn-outline-danger" onClick={() => alQuitar(p.codigo)} aria-label={`Quitar ${p.nombre}`}>Quitar</button></article>)}</section><aside className="panel p-4"><h2>Resumen</h2><p>Productos: {carrito.length}</p><p className="precio">Total: {clp.format(total)}</p><p className="small">El total es referencial. No se realiza ningún cobro.</p><button className="btn boton-verde mt-2" disabled>Continuar (demostración)</button></aside></div>}
    </main>
  );
}
export default Carrito;
