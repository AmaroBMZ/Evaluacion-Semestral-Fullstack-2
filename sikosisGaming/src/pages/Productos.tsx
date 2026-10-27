import { useState } from "react";
import Tarjeta from "../components/Tarjeta";
import Contenedor from "../components/Contenedor";
import { categoriasDisponibles, productosIniciales, type Producto } from "../data/productos";

interface Props { alAgregarCarrito: (producto: Producto) => void; }
function Productos({ alAgregarCarrito }: Props) {
  const [categoria, setCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const visibles = productosIniciales.filter((p) => (categoria === "Todas" || p.categoria === categoria) && p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()));
  return (
    <main className="container py-4" id="catalogo">
      <section className="mb-4"><p className="categoria">CATÁLOGO</p><h1>Productos</h1><p>Revisa nuestra selección de consolas, videojuegos y accesorios. Los precios y el inventario son demostrativos.</p></section>
      <section aria-label="Buscar y filtrar productos" className="panel p-4 mb-4">
        <div className="busqueda-grid">
          <div><label htmlFor="buscar-producto">Buscar por nombre</label><input id="buscar-producto" className="form-control" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej.: control inalámbrico" /></div>
          <div><label htmlFor="filtro-categoria">Categoría</label><select id="filtro-categoria" className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>{categoriasDisponibles.map((c) => <option key={c}>{c}</option>)}</select></div>
          <p role="status">{visibles.length} productos</p>
        </div>
      </section>
      <Contenedor clase="productos-grid">{visibles.length ? visibles.map((p) => <Tarjeta key={p.codigo} producto={p} alAgregarCarrito={alAgregarCarrito} />) : <p>No se encontraron productos con esos criterios.</p>}</Contenedor>
    </main>
  );
}
export default Productos;
