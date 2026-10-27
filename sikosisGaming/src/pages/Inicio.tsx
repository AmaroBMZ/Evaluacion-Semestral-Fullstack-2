import Hero from "../components/Hero";

function Inicio() {
  return (
    <main className="container py-4" id="contenido">
      <Hero />
      <section className="panel p-4 mb-4">
        <h2>Bienvenido a Sikosis Gaming</h2>
        <p>Somos una tienda de demostración dedicada a videojuegos, consolas y accesorios. Aquí puedes conocer productos pensados para acompañar tus partidas y descubrir las novedades de la comunidad gamer.</p>
        <p className="mb-0">Explora el catálogo para revisar precios y disponibilidad. Los productos y las compras de este sitio son parte de una simulación académica.</p>
      </section>
      <section className="panel p-4">
        <h2>¿Qué encontrarás?</h2>
        <div className="row g-3 mt-1">
          <div className="col-md-4"><h3 className="h5">Consolas</h3><p>Opciones para disfrutar tus juegos favoritos en casa o donde quieras.</p></div>
          <div className="col-md-4"><h3 className="h5">Accesorios</h3><p>Periféricos y complementos para armar un espacio cómodo de juego.</p></div>
          <div className="col-md-4"><h3 className="h5">Videojuegos</h3><p>Una selección de títulos para distintos estilos y formas de jugar.</p></div>
        </div>
      </section>
    </main>
  );
}
export default Inicio;
