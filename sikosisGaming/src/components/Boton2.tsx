// Importamos el tipo ReactNode para tipar el contenido interno (hijos/children) del botón.
import type { ReactNode } from "react";

// ==========================================
// INTERFAZ DE PROPS PARA BOTON2
// ==========================================
// Define qué parámetros puede recibir este componente desde su componente padre:
// - children: el contenido JSX o texto que va dentro de las etiquetas <Boton2>...</Boton2>
// - alClikear: función callback opcional que se ejecuta al hacer clic (evento onClick)
// - tipo: variante visual del botón (verde corporativo de Sikosis o estilos Bootstrap)
// - deshabilitado: booleano para desactivar el botón si por ejemplo no hay stock
interface Props {
  children: ReactNode;
  alClikear?: () => void;
  tipo?: "verde" | "primary" | "secondary" | "danger" | "outline-dark";
  deshabilitado?: boolean;
}

// Componente reutilizable de botón.
// Se aplican valores por defecto: tipo="verde" y deshabilitado=false.
function Boton2({
  children,
  alClikear,
  tipo = "verde",
  deshabilitado = false,
}: Props) {
  // Determinamos la clase CSS según el tipo solicitado.
  // Si es "verde", usamos la clase propia .boton-verde definida en estilos.css.
  // Para los demás, usamos las clases estándar de Bootstrap (.btn-primary, etc.).
  const claseBoton =
    tipo === "verde" ? "btn boton-verde" : `btn btn-${tipo}`;

  return (
    <button
      type="button"                // Evita comportamientos inesperados como envíos de formulario involuntarios
      className={claseBoton}       // Clases CSS dinámicas
      onClick={alClikear}          // Vincula la función controladora de eventos
      disabled={deshabilitado}     // Controla el atributo nativo disabled de HTML
    >
      {/* El children inyecta el texto o elementos hijos pasados al componente */}
      {children}
    </button>
  );
}

export default Boton2;
