import type { ReactNode } from "react";

// ==========================================
// COMPONENTE TARJETA CUERPO
// ==========================================
// Representa el bloque de contenido interno de una tarjeta (.card-body).
// Recibe los datos descriptivos y utiliza renderizado condicional en JSX
// para mostrar solo los elementos que tengan valor asignado.
interface Props {
  clase?: string;       // Clase CSS contenedora (por defecto "card-body")
  categoria?: string;   // Categoría del producto (ej: "Accesorios")
  titulo: string;       // Título principal de la tarjeta
  precio?: number;      // Precio del producto
  stock?: number;       // Cantidad de stock disponible
  texto?: string;       // Descripción del producto
  children?: ReactNode; // Elementos adicionales (ej: botones de acción)
}

function TarjetaCuerpo({
  clase = "card-body",
  categoria,
  titulo,
  precio,
  stock,
  texto,
  children,
}: Props) {
  return (
    <div className={clase}>
      {/* Operador && (cortocircuito): si la categoría existe, renderiza el párrafo */}
      {categoria && <p className="categoria">{categoria}</p>}

      <h3 className="h5 card-title">{titulo}</h3>

      {/* Formateo de precio a formato de moneda chilena con separador de miles */}
      {precio !== undefined && (
        <p className="precio">${precio.toLocaleString("es-CL")}</p>
      )}

      {/* Operador ternario: si el stock es mayor a 0 muestra disponibles, de lo contrario 'Agotado' */}
      {stock !== undefined && (
        <p className="card-text">
          {stock > 0 ? `Disponibles: ${stock}` : "Agotado"}
        </p>
      )}

      {texto && <p className="card-text">{texto}</p>}

      {/* Inyección de botones o controles pasados como hijos */}
      {children}
    </div>
  );
}

export default TarjetaCuerpo;
