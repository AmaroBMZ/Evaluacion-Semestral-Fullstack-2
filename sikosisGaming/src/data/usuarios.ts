export interface UsuarioDemo {
  run: string;
  nombre: string;
  apellidos: string;
  correo: string;
  clave: string;
  rol: "Administrador" | "Vendedor" | "Cliente";
  activo: boolean;
}

// Cuentas académicas de demostración; no usar contraseñas reales.
export const usuariosDemo: UsuarioDemo[] = [
  { run: "111111111", nombre: "Administrador", apellidos: "Demo", correo: "admin@duoc.cl", clave: "Admin123", rol: "Administrador", activo: true },
  { run: "222222222", nombre: "Vendedor", apellidos: "Demo", correo: "vendedor@duoc.cl", clave: "Venta123", rol: "Vendedor", activo: true },
  { run: "333333333", nombre: "Cliente", apellidos: "Demo", correo: "cliente@gmail.com", clave: "Cliente123", rol: "Cliente", activo: true },
];
