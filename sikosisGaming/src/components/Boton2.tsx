import type { ReactNode } from "react";
import "../estilos.css";

interface Props {
  children: ReactNode;
}

function Boton2({ children }: Props) {
  return <button className="btn boton-verde">{children}</button>;
}
export default Boton2;
