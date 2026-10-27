import { useState, type FormEvent } from "react";
function Login() {
  const [aviso, setAviso] = useState("");
  const ingresar = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setAviso("El acceso de cuentas se incorporará durante la migración de la lógica de usuario."); };
  return <main className="container py-4"><h1>Iniciar sesión</h1><section className="panel p-4"><form className="formulario" onSubmit={ingresar}><div className="mb-3"><label htmlFor="correo-ingreso">Correo electrónico</label><input id="correo-ingreso" className="form-control" type="email" required maxLength={100} autoComplete="username" /></div><div className="mb-3"><label htmlFor="clave-ingreso">Contraseña</label><input id="clave-ingreso" className="form-control" type="password" required minLength={4} maxLength={10} autoComplete="current-password" /></div><button className="btn boton-verde" type="submit">Ingresar</button>{aviso && <p role="status" className="aviso mt-3">{aviso}</p>}</form><hr /><h2 className="h5">Cuentas de demostración</h2><p>Administrador: admin@duoc.cl / Admin123</p><p>Vendedor: vendedor@duoc.cl / Venta123</p><p>Cliente: cliente@gmail.com / Cliente123</p><p className="mb-0">Estas cuentas solo existen en la versión original de demostración.</p></section><p className="mt-3">¿No tienes cuenta? <a href="#registro">Regístrate</a>.</p></main>;
}
export default Login;
