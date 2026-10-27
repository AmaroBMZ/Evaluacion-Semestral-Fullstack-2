// ==========================================
// COMPONENTE FOOTER (PIE DE PÁGINA)
// ==========================================
// Muestra información de copyright y enlaces de categorías.
// Permite que al hacer clic en una categoría del pie de página,
// se actualice el filtro en el catálogo mediante la función alFiltrarCategoria.
interface Props {
  alFiltrarCategoria?: (categoria: string) => void;
}

function Footer({ alFiltrarCategoria }: Props) {
  return (
    <footer className="mt-5 py-4">
      <div className="container row-pie">
        <div>
          <strong>Sikosis Gaming</strong>
          <p className="mb-0">
            Videojuegos y accesorios para tu próxima partida.
          </p>
          <small>© 2026 Sikosis Gaming. Proyecto Fullstack II.</small>
        </div>

        {/* Navegación rápida por categorías */}
        <nav aria-label="Categorías">
          <a
            href="#catalogo"
            onClick={(e) => {
              e.preventDefault(); // Evitamos recarga o salto brusco de página
              alFiltrarCategoria?.("Accesorios");
            }}
          >
            Accesorios
          </a>
          <br />
          <a
            href="#catalogo"
            onClick={(e) => {
              e.preventDefault();
              alFiltrarCategoria?.("Videojuegos");
            }}
          >
            Videojuegos
          </a>
          <br />
          <a
            href="#catalogo"
            onClick={(e) => {
              e.preventDefault();
              alFiltrarCategoria?.("Consolas");
            }}
          >
            Consolas
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
