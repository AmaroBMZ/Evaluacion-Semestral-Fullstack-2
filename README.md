# Sikosis Gaming

Tienda académica DSY1104 con HTML, CSS y JavaScript sencillo, separado por responsabilidades y comentado en español. Mantiene el diseño gris y verde del proyecto.

## Cómo abrir

Abre `paginas/Inicio.html` o `index.html` con **Live Server** en VS Code. Mantén la misma dirección y puerto: el almacenamiento pertenece a ese origen. No necesitas backend, base de datos ni paquetes para usar la tienda. Abrir con `file://` puede funcionar, pero la persistencia entre archivos depende del navegador; para evaluar usa un servidor estático.

Las imágenes y regiones están incluidas localmente. Bootstrap 5.3.3 se carga desde un CDN y requiere internet, al igual que el video de YouTube y las imágenes HTTPS que agregues.

## Cuentas de demostración

| Perfil | Correo | Contraseña |
| --- | --- | --- |
| Administrador | admin@duoc.cl | Admin123 |
| Vendedor | vendedor@duoc.cl | Venta123 |
| Cliente | cliente@gmail.com | Cliente123 |

Puedes registrar más clientes. Ejemplo válido de RUN: `123456785`. No se permiten RUN o correos duplicados. Usa datos ficticios y contraseñas de prueba.

## Funciones incluidas

- Catálogo desde un arreglo, búsqueda por nombre y filtro de categoría.
- Detalles actualizados y disponibilidad de productos.
- Carrito persistente con cantidades, eliminación y total automático.
- Registro con RUN módulo 11, correos permitidos, confirmación de contraseña y comunas dependientes.
- Sesión y perfiles Cliente, Vendedor y Administrador.
- Contacto: mensajes guardados y visibles al administrador; no se envían correos reales.
- Productos administrativos: listar, crear, ver, editar y eliminar; alertas de stock crítico.
- Usuarios administrativos: listar, crear, ver, editar perfiles y activar/desactivar.
- Pedido de prueba: descuenta stock y genera una orden sin cobro ni despacho.
- Vendedor: consulta listado/detalle de productos y órdenes; no modifica datos ni accede a usuarios o mensajes.
- Validaciones al escribir y enviar, errores personalizados, navegación por teclado y diseño adaptable.
- Nosotros, Blog, dos artículos y video.

## Archivos para estudiar

```text
Evaluacion Semestre/
├── index.html         Entrada del sitio
├── paginas/           Páginas HTML de la tienda y el panel
├── css/               Estilos propios
├── js/                Lógica y datos JavaScript
└── imagenes/          Fotografías y logo
```

| Archivo | Función |
| --- | --- |
| `js/datos.js` | Arreglos iniciales de productos, cuentas y categorías. |
| `js/regiones.js` | Arreglo local de 16 regiones y 346 comunas. |
| `js/app.js` | Almacenamiento, sesión, catálogo, carrito y validaciones compartidas. |
| `js/admin.js` | Permisos y vistas del panel. |
| `paginas/admin.html` | Menú y plantillas HTML para productos y usuarios. |
| `paginas/detalle-producto.html` | Detalle seleccionado mediante `?codigo=...`. |
| `paginas/detalle-*.html` anteriores | Conservan enlaces antiguos y usan el mismo código de detalle. |
| `css/estilos.css` | Diseño, colores, errores y adaptación de pantalla. |

Los scripts utilizan `defer`, en orden: datos, regiones, aplicación y administración. No hay React, clases ni compilación. El panel usa `paginas/admin.html?vista=...` para reutilizar la misma estructura sin duplicar páginas.

## Reglas del proyecto

1. Agregar un producto existente suma cantidades sin superar su stock. Solo se aceptan enteros positivos.
2. Cada cuenta tiene su carrito. Al ingresar como cliente se combina el carrito de visitante, limitado al stock disponible.
3. El carrito no reserva stock. Al confirmar se vuelve a comprobar y se descuenta la cantidad.
4. El carrito usa precios actuales. Cada orden conserva una copia de los nombres y precios del momento de confirmar.
5. Eliminar un producto lo retira también de los carritos; no borra las órdenes anteriores.
6. Se admite precio cero y decimal; se muestra con hasta dos decimales. Stock y stock crítico son enteros no negativos.
7. Código de producto y correo de usuario son identificadores estables y no se cambian al editar.
8. En edición de usuario, dejar ambas contraseñas vacías conserva la actual. Un administrador no puede desactivarse ni quitarse su propio perfil.
9. El registro público siempre crea un Cliente. El perfil se administra desde el panel.
10. El correo de contacto es opcional; si se completa se valida. Un comentario de solo espacios no es válido.

## Persistencia y límites

`localStorage` guarda la clave `sikosis-datos-v1`: productos, usuarios, carritos, órdenes y mensajes. `sessionStorage` guarda `sikosis-sesion-v1`.

Es una **simulación de frontend**, no autenticación segura de producción. Las credenciales de prueba son visibles/editables en el navegador. Los permisos controlan el recorrido de la interfaz; la seguridad real requiere un servidor que verifique identidad/permisos y almacene credenciales de forma segura. No hay pagos reales, despacho ni sincronización entre equipos.

Para reiniciar voluntariamente la demostración, elimina solo esas dos claves en las herramientas de almacenamiento del navegador y recarga. Se perderán los datos creados en ese origen y volverán los ejemplos de `js/datos.js`. Los datos corruptos no se sobrescriben automáticamente: la aplicación muestra un aviso.

## Entrega y colaboración

Remoto configurado: https://github.com/AmaroBMZ/Evaluacion-Semestre

El historial existente incluye aportes de AmaroBMZ y Felipe546 y merges. Esta actualización no inventa contribuciones, no reescribe commits ni hace push. El equipo debe comprender los cambios, hacer commits descriptivos reales y comprobar que la versión final esté en el repositorio público.

La disponibilidad del 95 % solo puede medirse después de publicar durante el período de evaluación. Las pruebas locales no sustituyen esa medición ni la presentación individual.

## Fuentes

- Los tres PDF proporcionados: pauta, Anexo 1 y ERS. Los originales se conservaron.
- Bootstrap 5.3.3: https://getbootstrap.com/; cargado desde CDN, bajo licencia MIT.
- Regiones/comunas: https://github.com/climoralesg/api-regiones-provincias-comunas-Chile/blob/main/territoriochile.json. Se usa una copia local porque no se recibió el arreglo complementario del curso.
- Fotografías existentes: `imagenes/FUENTES.md`.
- Video oficial de Minecraft: https://www.youtube.com/watch?v=MmB9b5njVbA.

Desarrolladores indicados en el ERS original: Amaro Barria y Felipe Hernández.

## Panel de cliente

Desde **Mi perfil y compras**, una cuenta Cliente puede consultar sus propios pedidos y desplegar productos, cantidades, precios, total, estado y direcci?n registrada. Tambi?n puede editar nombre, apellidos, tel?fono opcional, nacimiento, direcci?n, regi?n y comuna. Correo y RUN se muestran como identificadores de la cuenta.

Los pedidos nuevos conservan una copia de los datos de entrega al confirmar. Cambiar el perfil no modifica pedidos anteriores; los antiguos que no tienen direcci?n lo indican expresamente. El estado sigue siendo el del pedido de demostraci?n, sin seguimiento de despacho real. El carrito permite revisar la direcci?n y acceder al perfil antes de confirmar.

## Productos y futura base SQL

Las tarjetas se generan con `tarjetaProducto(producto)` y el detalle con `mostrarDetalle()`, en `js/productos-vista.js`. El HTML contiene el contenedor `lista-productos`, sin tarjetas individuales. El filtro de categorias tambien se completa con JavaScript.

`js/productos-datos.js` contiene la carga inicial de ejemplo. Actualmente se copia a `localStorage`; los cambios del administrador siguen siendo la fuente de los productos mostrados. Modificar los ejemplos no reemplaza datos ya guardados en un navegador.

Contrato actual de cada producto:

| Campo | Tipo | Uso |
| --- | --- | --- |
| codigo | string | Identificador unico y estable |
| nombre | string | Nombre visible |
| descripcion | string | Texto del detalle |
| precio | number | Precio no negativo |
| stock | integer | Unidades disponibles |
| critico | integer o null | Umbral opcional de alerta |
| imagen | string | Ruta local o URL HTTPS |
| categoria | string | Nombre de la categoria |

La futura conexion sera: pagina ? API del backend ? SQL. La API puede devolver estos mismos campos en JSON para reutilizar las plantillas. Endpoints propuestos: GET /api/productos, GET /api/productos/:codigo, POST /api/productos, PUT /api/productos/:codigo y DELETE /api/productos/:codigo.

Esta preparacion separa datos y presentacion; todavia no implementa API ni conexion SQL. Al incorporar el backend habra que adaptar carga asincrona, estados de carga/error y operaciones administrativas. La confirmacion de pedidos y el descuento de stock deberan ejecutarse juntos en una transaccion del servidor. Las credenciales SQL pertenecen al backend.
