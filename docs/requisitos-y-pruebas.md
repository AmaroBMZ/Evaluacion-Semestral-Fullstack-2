# Requisitos y comprobaciones de GameZone

Implementación académica de frontend. Se priorizan el Anexo 1 y la pauta, seguidos del ERS y la planilla completada. Los documentos originales no se modificaron.

## Decisiones acordadas

- `index.html` es la portada; `Inicio.html` redirige allí para conservar enlaces antiguos.
- Se conserva la paleta verde, los ocho productos y sus precios de muestra.
- El login desplegable queda junto al carrito en las páginas públicas y administrativas.
- Cuentas, catálogo y carrito funcionan como demostración local, sin servidor, pagos ni despachos.
- El video y las imágenes nuevas del blog quedan pendientes por solicitud expresa del usuario.
- Las órdenes son ejemplos de solo lectura para demostrar los permisos del vendedor.

## Requisitos funcionales

| Código | Implementación | Archivos principales |
| --- | --- | --- |
| R.1 | Navegación pública y administrativa; listas, nuevo, detalle y edición mediante rutas y parámetros | HTML y `js/admin.js` |
| R.2 | Ocho productos iniciales listados desde un arreglo JavaScript | `js/datos.js`, `js/tienda.js` |
| R.3 | Detalle del producto seleccionado por código; manejo de producto inexistente | `detalle.html`, `js/tienda.js` |
| R.4 | Registro con RUN, nombres, apellidos, correo, nacimiento opcional, región, comuna, dirección y contraseña; perfil Cliente | `registro.html`, `js/formularios.js` |
| R.5 | Login local, sesión por pestaña, cierre y destino por perfil | `login.html`, `js/acceso.js`, `js/sistema.js` |
| R.6 | Información de la tienda y del equipo conservada del trabajo existente | `about.html` |
| R.7 | Dos artículos y dos detalles independientes; imágenes nuevas pendientes por decisión del usuario | `blogs.html`, `detalle-blog.html`, `detalle-blog-2.html` |
| R.8 | Contacto validado, registro local y confirmación que aclara que no se envió correo | `contacto.html`, `js/formularios.js` |
| R.9 | Agregar, cambiar cantidad, quitar, vaciar, calcular total y persistir carrito | `carrito.html`, `js/sistema.js`, `js/tienda.js` |
| R.10 | Errores por campo en tiempo real y al enviar; longitudes y dominios del Anexo | `js/formularios.js` |
| R.11 | Listar, crear, consultar, editar y eliminar productos; solo administrador modifica | `admin-productos.html`, `js/admin.js` |
| R.12 | Listar, crear, consultar y editar usuarios y perfiles | `admin-usuarios.html`, `js/admin.js` |
| R.16 | Búsqueda por nombre sin distinguir tildes y filtro combinado por categoría | `productos.html`, `js/tienda.js` |
| R.17 | Stock entero no negativo, disponibilidad y alertas por stock crítico | `js/admin.js`, `js/sistema.js` |

## Reglas y decisiones de implementación

- Anexo 1, páginas 13 a 16: RUN de 7 a 9 caracteres sin puntos ni guion, con comprobación del dígito verificador; correos de máximo 100 caracteres y dominios duoc.cl, profesor.duoc.cl o gmail.com; contraseña de 4 a 10 caracteres.
- Contacto: nombre obligatorio de máximo 100 y comentario obligatorio de máximo 500. Correo opcional porque el Anexo no lo marca como requerido; si se ingresa, se valida su longitud y dominio.
- Registro: nombre máximo 50, apellidos máximo 100 y dirección máxima 300; no se permite elegir perfil desde el registro público. Se rechazan RUN o correo duplicados.
- Productos: código mínimo 3, nombre máximo 100, descripción opcional máxima 500, precio decimal no negativo (incluye cero), stock y stock crítico enteros no negativos. La categoría se elige entre las categorías iniciales aprobadas. Imagen opcional con ruta local de la carpeta img; si falta se usa una imagen existente.
- El código del producto queda fijo al editar para no romper enlaces ni líneas del carrito. El administrador puede cambiar el resto de los datos o crear otro producto.
- Los ocho productos empiezan con 10 unidades y umbral crítico 2 como inventario ficticio editable; no se presentan como existencias reales de un comercio.
- El carrito consolida productos repetidos; no reserva ni descuenta inventario porque no existe confirmación de compra. Si se reduce stock o se elimina un producto, ajusta sus líneas. Cada cambio vuelve a consultar el catálogo.
- Los datos se separan en claves `gamezone.v1.*`. El almacenamiento no se borra automáticamente ante errores; se informa al usuario. El contacto conserva los últimos 100 mensajes de prueba.
- La recuperación de contraseña sigue pendiente según el ERS 2.6. El botón informa que no se envió correo.

## Órdenes: diferencia entre los documentos

El Anexo 1, página 16, permite al Vendedor visualizar lista y detalle de productos y de órdenes, y exige ocultar los demás accesos. Por eso se incluyen `admin-ordenes.html` y dos órdenes ficticias de consulta.

El ERS, sección 2.6 «Requisitos Futuros», menciona historial de compras y seguimiento de pedidos. Esas funciones futuras no equivalen a la consulta de órdenes del vendedor. No se agregó pago, creación de compras ni seguimiento logístico.

## Regiones y comunas

El archivo JavaScript complementario mencionado en el Anexo no fue proporcionado. Se preparó `js/regiones.js` con una copia local de los reportes comunales BCN 2025: 16 regiones y 345 comunas presentes en esa fuente. No depende de una API al usar el formulario. Esta fuente no incluye Antártica en sus reportes comunales; no se afirma que sea el archivo original del docente.

Fuente consultada: https://www.bcn.cl/siit/reportescomunales/comunas_json.html?alfab=&anno=2025
Referencia territorial: https://www.subdere.gov.cl/documentacion/códigos-únicos-territoriales-actualizados-al-06-de-septiembre-2018

## Requisitos no funcionales y límites

| Código | Evidencia y alcance |
| --- | --- |
| R.13 | Páginas públicas probadas en 360, 768 y 1440 px sin desbordamiento horizontal. Tablas con desplazamiento propio en móvil. |
| R.14 | Restricciones locales por perfil en vistas y acciones; contraseñas ocultas y derivados PBKDF2 con sal. Al ser frontend, el usuario puede manipular almacenamiento y JavaScript: NO constituye autorización segura de producción. |
| R.15 | HTML, CSS y JS separados, identificadores en español y comentarios por sección. |
| R.18 | Etiquetas, texto alternativo existente, enlaces de salto, foco visible, errores asociados, estados anunciados y cierre del desplegable con Escape. No se declara certificación WCAG completa. |
| R.19 | Carga local de portada observada: aproximadamente 182 ms y 83 ms en Chrome con CSS de Bootstrap servido desde copia de prueba. No prueba rendimiento de una publicación ni incluye la variación de una conexión externa. |
| R.20 | 17 comprobaciones de recorridos principales y 7 comprobaciones adicionales de usuarios/errores superadas. No equivale a medir todas las funciones posibles ni un período de fiabilidad en producción. |
| R.21 | Pendiente de publicación y medición del período de evaluación. No se puede asegurar disponibilidad del 95 % a partir de una prueba local. |
| R.22 | Recorridos principales comprobados en Microsoft Edge y Google Chrome. Otros navegadores no fueron probados. |

## Validación realizada

- Catálogo, enlaces a detalles, búsqueda con tildes y filtro combinado.
- Desplegable, ojo de contraseña, cierre con Escape y sesión.
- Registro válido, errores de RUN/dominio y relación región/comuna.
- Precio cero, creación/edición/eliminación de producto y alerta de stock crítico.
- Carrito persistente, límite de stock, ajuste de cantidades y eliminación de productos.
- Cliente sin administración; vendedor sin altas, cambios ni usuarios; órdenes de solo lectura.
- Creación/edición de usuarios, conservación de contraseña y protección del último administrador.
- Mensaje de contacto local, cierre de sesión y navegación ante datos locales dañados.
- Ausencia de errores JavaScript durante los recorridos, enlaces locales existentes e identificadores HTML únicos.

La pauta evalúa commits colaborativos y su explicación en la presentación. Estos cambios no crean commits atribuibles al compañero ni publican el repositorio automáticamente. El video y las imágenes de los artículos permanecen pendientes conforme a la indicación del usuario.
