import type { ReactNode } from "react";

// ==========================================
// COMPONENTE CONTENEDOR (PATRÓN WRAPPER)
// ==========================================
// Este componente sirve como envoltorio reutilizable para estructurar
// el layout de secciones completas o rejillas (CSS Grid / Flexbox).
interface Props {
  clase?: string;         // Clase CSS a aplicar (por defecto "container" de Bootstrap)
  children?: ReactNode;   // Contenido que se envolverá dentro del div
}

function Contenedor({ clase = "container", children }: Props) {
  return (
    <div className={clase}>
      {/* Aquí se renderiza todo el contenido anidado dentro de <Contenedor> */}
      {children}
    </div>
  );
}

export default Contenedor;
