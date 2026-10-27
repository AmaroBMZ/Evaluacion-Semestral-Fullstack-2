import Boton2 from "./Boton2";

// ==========================================
// COMPONENTE HERO (SECCIÃ“N DESTACADA)
// ==========================================
// Banner principal de bienvenida que presenta el eslogan de Sikosis Gaming
// y un botÃ³n de llamada a la acciÃ³n (Call to Action) que desplaza suavemente
// la vista hacia el catÃ¡logo de productos.
function Hero() {
  // Manejador que utiliza la API nativa de JavaScript scrollIntoView
  // para hacer un desplazamiento suave hacia el elemento #catalogo
  const alIrACatalogo = () => {
    window.location.hash = "productos";
  };

  return (
    <section className="panel p-4 mb-4">
      <div className="row align-items-center g-4">
        {/* Columna de texto */}
        <div className="col-md-6">
          <p className="categoria">VIDEOJUEGOS Y ACCESORIOS</p>
          <h1>Sikosis Gaming</h1>
          <p>
            Todo comienza con una buena partida. Explora accesorios, consolas y
            videojuegos para disfrutar a tu manera.
          </p>
          <Boton2 tipo="verde" alClikear={alIrACatalogo}>
            Ver productos
          </Boton2>
        </div>

        {/* Columna de imagen representativa */}
        <div className="col-md-6">
          <img
            className="img-fluid foto-portada"
            src="/imagenes/setup.jpg"
            alt="Escritorio con monitor y accesorios para jugar"
            width={640}
            height={420}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
