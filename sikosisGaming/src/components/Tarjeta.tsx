import TarjetaCuerpo from "./TarjetaCuerpo";
import Boton2 from "./Boton2";
import type { Producto } from "../data/productos";

// ==========================================
// COMPONENTE TARJETA DE PRODUCTO
// ==========================================
// Compone la presentación completa de un producto en el catálogo:
// - La imagen del producto con atributo loading="lazy" para optimizar la carga
// - El cuerpo de la tarjeta mediante el subcomponente TarjetaCuerpo
// - El botón de acción "Añadir al carrito" usando Boton2
interface Props {
  producto: Producto;                                     // Objeto de producto completo tipado
  alAgregarCarrito?: (producto: Producto) => void;         // Callback que comunica al padre la acción de compra
}

function Tarjeta({ producto, alAgregarCarrito }: Props) {
  // Desestructuración de propiedades del objeto producto para código más limpio
  const { nombre, categoria, precio, stock, imagen, descripcion } = producto;

  return (
    <article className="card">
      {/* Imagen del producto */}
      <img
        src={imagen}
        alt={nombre}
        className="card-img-top foto-producto"
        loading="lazy"
      />

      {/* Subcomponente que estructura la información textual */}
      <TarjetaCuerpo
        categoria={categoria}
        titulo={nombre}
        precio={precio}
        stock={stock}
        texto={descripcion}
      >
        {/* Contenedor del botón al final del cuerpo de la tarjeta */}
        <div className="mt-auto pt-2 w-100">
          <Boton2
            tipo="verde"
            deshabilitado={stock === 0}
            // Ejecutamos la función al hacer clic enviando el producto seleccionado al componente principal
            alClikear={() => alAgregarCarrito && alAgregarCarrito(producto)}
          >
            {stock === 0 ? "Agotado" : "Añadir al carrito"}
          </Boton2>
        </div>
      </TarjetaCuerpo>
    </article>
  );
}

export default Tarjeta;
