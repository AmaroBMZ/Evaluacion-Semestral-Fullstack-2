# Sikosis Gaming

## Introducción

Sikosis Gaming es una propuesta de tienda de videojuegos, consolas y accesorios, desarrollada para practicar HTML y CSS en Desarrollo Fullstack II. El objetivo de esta etapa es construir una carcasa simple: páginas conectadas, productos de referencia, información de la tienda, artículos y formularios visuales.

La identidad utiliza un logo con las iniciales SG, fondo gris y verde `#70b541`. Este verde es una aproximación visual a lo solicitado, no una equivalencia Pantone certificada. Los documentos recibidos usan el nombre anterior GameZone; esta interfaz utiliza el nuevo nombre solicitado. Los originales no se modificaron.

## Cómo abrir el proyecto

Abre `Inicio.html` en Chrome o Edge. También puedes abrir la carpeta en VS Code y usar Live Server sobre ese archivo. No hay `index.html`: se respetaron únicamente los seis HTML que existían al comenzar.

Bootstrap y el reproductor de YouTube requieren internet. Las fotografías están en `imagenes/`. No se necesita instalar Node, Python ni una base de datos para utilizar la página.

## Páginas y navegación

| Archivo | Contenido |
| --- | --- |
| `Inicio.html` | Portada, ocho productos destacados, inicio de sesión y registro. |
| `producto.html` | Catálogo, campos de búsqueda y detalle de cada producto. |
| `nosotros.html` | Descripción de la tienda y del equipo. |
| `blog.html` | Dos noticias, dos artículos completos y un video. |
| `contacto.html` | Formulario de contacto. |
| `carrito.html` | Diseño de un carrito con tres productos de ejemplo y resumen. |
| `estilos.css` | Colores, logo, imágenes, menú y ajustes para celular. |

Se sigue el flujo público de la Figura 2 del Anexo 1. Para no crear HTML nuevos, ingreso y registro están en `Inicio.html#ingreso` y `Inicio.html#registro`. Los detalles de producto y artículos utilizan enlaces internos con `#`. Esta adaptación conserva los recorridos, aunque no los separa en páginas distintas como el diagrama original.

Se tomaron como referencia la portada de la Figura 3, los formularios de las Figuras 4, 5 y 7, las noticias de la Figura 6, el catálogo y detalle de las Figuras 8 y 9 y el carrito de la Figura 15.

## Tecnologías y comentarios

Solo HTML, CSS y la hoja de estilos de Bootstrap 5.3.3. Se usan principalmente `container`, `row`, `col`, `card`, `btn`, `form-control`, `form-select` y `ratio`. No se incluye el JavaScript de Bootstrap ni scripts propios. El video se reproduce en un servicio externo.

Los comentarios explican las partes del HTML y las reglas de CSS. Para cambiar un producto, edita su tarjeta y su detalle; los datos son estáticos. Para cambiar el diseño general, edita `estilos.css`.

Referencia de Bootstrap: https://getbootstrap.com/docs/5.3/layout/grid/

## Alcance de esta carcasa

Funcionan los enlaces entre páginas y secciones. Los campos de los formularios se pueden completar, pero los botones de envío, registro, ingreso, compras y suscripciones están deshabilitados. No se envían ni guardan datos, no se inicia sesión y no se modifica el carrito. Los precios, cantidades y el total del carrito son ejemplos escritos en HTML, no cálculos automáticos ni existencias reales.

Los atributos `required`, `maxlength`, `minlength`, `type` y `pattern` preparan reglas básicas en los campos; no equivalen a validaciones JavaScript ni validación del dígito verificador del RUN. Como no hay envío habilitado, tampoco se presenta un flujo de validación completo. Las comunas dependientes y la comparación de contraseñas quedan pendientes.

## Relación con los 22 requisitos de la planilla

| Requisito | Aplicación y estado en esta etapa |
| --- | --- |
| R.1 Navegación | Implementada entre los seis HTML y sus secciones públicas. Administración fuera del alcance. |
| R.2 Catálogo | Visible con imágenes, nombres, categorías y precios. Arreglo JavaScript pendiente. |
| R.3 Detalle | Cada tarjeta enlaza a su detalle estático en `producto.html`. |
| R.4 Registro | Formulario visual en `Inicio.html#registro`; creación de cuentas pendiente. |
| R.5 Inicio de sesión | Formulario visual en `Inicio.html#ingreso`; sesión y perfiles pendientes. |
| R.6 Nosotros | Información de la propuesta y nombres del equipo en `nosotros.html`. |
| R.7 Blog | Dos noticias y dos artículos completos con imágenes en `blog.html`. |
| R.8 Contacto | Formulario con etiquetas y límites; envío pendiente. |
| R.9 Carrito | Vista de ejemplo; agregar, quitar, cantidades, cálculo y persistencia pendientes. |
| R.10 Validación | Atributos HTML y ayudas estáticas; mensajes dinámicos y reglas JavaScript pendientes. |
| R.11 Administración de productos | Pendiente; el usuario limitó esta etapa a la tienda pública. |
| R.12 Administración de usuarios | Pendiente; no se crearon páginas administrativas. |
| R.13 Diseño responsivo | Columnas Bootstrap, menú que se ajusta y media query; revisión visual en dispositivos pendiente. |
| R.14 Seguridad y permisos | Contraseñas ocultas al escribir. Autenticación, permisos y seguridad real pendientes. |
| R.15 Mantenibilidad | HTML y CSS separados, nombres comprensibles y comentarios. Sin JS en esta etapa. |
| R.16 Búsqueda y filtros | Controles visibles deshabilitados en `producto.html`; lógica pendiente. |
| R.17 Stock | Se informa disponibilidad por confirmar; no se administra inventario. |
| R.18 Accesibilidad | Etiquetas, textos alternativos, idioma español, foco visible y enlace para saltar al contenido. |
| R.19 Rendimiento | Imágenes locales y carga diferida; no se certificaron los límites de 3 y 2 segundos. |
| R.20 Fiabilidad | Comprobación estática de enlaces y estructura; no se certifica el 95 % funcional. |
| R.21 Disponibilidad | Pendiente de publicación y medición; no se puede certificar el 95 % localmente. |
| R.22 Compatibilidad | Tecnologías web sin dependencia del sistema operativo; pruebas reales en Chrome, Edge y móvil pendientes. |

## Pauta del encargo: 40 %

| Indicador | Peso de la evaluación | Situación |
| --- | --- | --- |
| IE1.1.1 HTML y elementos web | 8 % | Estructura, imágenes, enlaces, video, formularios y footer presentes. Acciones comerciales deshabilitadas por alcance. No se declara cumplimiento total. |
| IE1.1.2 CSS externo personalizado | 10 % | Implementado con Bootstrap básico y `estilos.css`. |
| IE1.2.1 Validaciones JavaScript | 10 % | Pendiente: la etapa solicitada excluye JavaScript. |
| IE1.3.1 Git y colaboración | 12 % | Depende del historial real, commits descriptivos y reparto de tareas. Este trabajo no crea commits ni hace push. |

La carcasa no completa el 40 % por sí sola. Para la entrega completa deberán habilitarse las funciones y validaciones exigidas, verificar los recorridos y preparar la evidencia de colaboración. La presentación individual corresponde al otro 60 %.

## Comprobación manual sugerida

1. Abrir `Inicio.html` y recorrer los seis enlaces principales.
2. Entrar a ingreso y registro desde la cabecera.
3. Abrir el detalle de cada producto y volver al catálogo.
4. Abrir los dos artículos del blog y reproducir el video con conexión.
5. Revisar contacto y carrito; sus botones deben permanecer deshabilitados.
6. Probar anchos de 360, 768 y 1366 píxeles y navegar con Tab.

## Fuentes y materiales

- Anexo 1 Instrucciones y pauta Evaluación Parcial 1 de DSY1104, leídos desde los PDF proporcionados.
- `ERS_GameZone_corregido.docx` y `Planilla_Requerimientos_GameZone_completada.xlsx`, consultados sin modificar.
- Fotografías reutilizadas del historial del mismo proyecto. Son referencias visuales; no acreditan marcas, modelos o características definitivas. Ver `imagenes/FUENTES.md` para la atribución existente.
- Tráiler oficial de Minecraft: https://www.youtube.com/watch?v=MmB9b5njVbA (canal oficial Minecraft). Se enlaza e integra el reproductor; no se aloja el video.

Desarrolladores indicados en el ERS: Amaro Barria y Felipe Hernández.
