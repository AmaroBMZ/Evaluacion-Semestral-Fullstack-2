import { useState, type FormEvent } from "react";
import { usuariosDemo, type UsuarioDemo } from "../data/usuarios";

interface Props { alIngresar: (usuario: UsuarioDemo) => void; }
function Login({ alIngresar }: Props) {
  const [aviso, setAviso] = useState("");
  const ingresar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const correo = String(datos.get("correo") ?? "").trim().toLowerCase();
    const clave = String(datos.get("clave") ?? "");
    const usuario = usuariosDemo.find((cuenta) => cuenta.correo.toLowerCase() === correo && cuenta.clave === clave && cuenta.activo);
    if (!usuario) {
      setAviso("Correo o contraseña incorrectos. Prueba una de las cuentas de demostración.");
      return;
    }
    alIngresar(usuario);
  };
  return <main className="container py-4"><h1>Iniciar sesión</h1><section className="panel p-4"><form className="formulario" onSubmit={ingresar}><div className="mb-3"><label htmlFor="correo-ingreso">Correo electrónico</label><input id="correo-ingreso" name="correo" className="form-control" type="email" required maxLength={100} autoComplete="username" /></div><div className="mb-3"><label htmlFor="clave-ingreso">Contraseña</label><input id="clave-ingreso" name="clave" className="form-control" type="password" required minLength={4} maxLength={10} autoComplete="current-password" /></div><button className="btn boton-verde" type="submit">Ingresar</button>{aviso && <p role="alert" className="aviso aviso-error mt-3">{aviso}</p>}</form><hr /><h2 className="h5">Cuentas de demostración</h2><ul>{usuariosDemo.map((usuario) => <li key={usuario.correo}><strong>{usuario.rol}:</strong> {usuario.correo} / {usuario.clave}</li>)}</ul><p className="small mb-0">Son cuentas de prueba locales; no uses contraseñas personales.</p></section><p className="mt-3">¿No tienes cuenta? <a href="#registro">Regístrate</a>.</p></main>;
}
export default Login;
