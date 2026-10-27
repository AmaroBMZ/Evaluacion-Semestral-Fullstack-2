import { useState, type FormEvent } from "react";
function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const enviar = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setEnviado(true); e.currentTarget.reset(); };
  return <main className="container py-4"><p className="categoria">¿PODEMOS AYUDARTE?</p><h1>Contacto</h1><p className="mb-4">Tu consulta se registra como parte de esta demostración. No se envía un correo real.</p><section className="panel p-4"><form className="formulario" onSubmit={enviar}><div className="mb-3"><label htmlFor="contacto-nombre">Nombre</label><input id="contacto-nombre" className="form-control" required maxLength={100} /></div><div className="mb-3"><label htmlFor="contacto-correo">Correo electrónico (opcional)</label><input id="contacto-correo" className="form-control" type="email" maxLength={100} /></div><div className="mb-3"><label htmlFor="comentario">Comentario</label><textarea id="comentario" className="form-control" rows={5} maxLength={500} required /></div><button className="btn boton-verde" type="submit">Enviar mensaje</button>{enviado && <p className="aviso mt-3" role="status">Mensaje recibido para esta demostración.</p>}</form></section></main>;
}
export default Contacto;
