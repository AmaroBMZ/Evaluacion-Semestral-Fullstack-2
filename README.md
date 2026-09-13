# GameZone

Tienda académica de videojuegos y accesorios para DSY1104, desarrollada con HTML, CSS, Bootstrap 5.3.3 y JavaScript según el Anexo 1, la pauta, el ERS y la planilla completada.

## Funciones implementadas

- Navegación pública, catálogo desde un arreglo, búsqueda, filtro y detalle por producto.
- Registro validado, login desplegable, sesión local y perfiles Cliente, Vendedor y Administrador.
- Carrito persistente con cantidades limitadas por stock.
- Administración de productos y usuarios; consulta de órdenes ficticias para el vendedor.
- Nosotros, contacto local y dos artículos de blog con detalles separados.
- Paleta verde, código comentado y disposición adaptable a dispositivos móviles.

## Organización del código

```text
index.html                 Portada principal
Inicio.html                Redirección compatible
productos.html             Catálogo y búsqueda
detalle.html               Producto seleccionado
carrito.html               Carrito local
registro.html / login.html  Cuentas locales
admin*.html                Vistas administrativas
about.html / contacto.html Información de la tienda
blogs.html / detalle-blog*.html Artículos
estilos.css                Diseño verde compartido
css/acceso.css             Login desplegable
css/funciones.css          Formularios, tablas y administración
js/datos.js                Productos de muestra
js/regiones.js             Regiones y comunas de BCN
js/sistema.js              Datos, sesión y reglas del carrito
js/formularios.js          Validaciones, registro y contacto
js/acceso.js               Interacción de la cabecera
js/tienda.js               Catálogo, detalle y carrito
js/admin.js                Administración y permisos locales
docs/requisitos-y-pruebas.md Trazabilidad y límites de evaluación
```

## Referencias

- Anexo 1: flujos de las Figuras 1 y 2, estructura visual y reglas de las páginas 13 a 16.
- ERS_GameZone_corregido.docx y Planilla_Requerimientos_GameZone_completada.xlsx: R.1 a R.22.
- Fotografías existentes de referencia: consulta `img/FUENTES.md`.
- Bootstrap se carga por CDN; los estilos propios mantienen la distribución si no está disponible.

## Integración de requisitos y demostración local

La portada principal es `index.html`; `Inicio.html` conserva una redirección. Se mantiene la paleta verde y el login desplegable junto al carrito.

Para probar, sirve la carpeta raíz del proyecto mediante un servidor estático (por ejemplo, Live Server de VS Code). Si tienes Python disponible, ejecuta `python -m http.server 5500` en la carpeta que contiene `index.html` y abre `http://localhost:5500/index.html`. No ejecutes el servidor dentro de `.git`.

Cuentas iniciales ficticias:

| Perfil | Correo | Contraseña inicial |
| --- | --- | --- |
| Administrador | administrador@duoc.cl | Demo1234 |
| Vendedor | vendedor@duoc.cl | Demo1234 |
| Cliente | cliente@duoc.cl | Demo1234 |

Las cuentas se crean solo la primera vez en ese navegador/origen. El registro público crea clientes. Los datos quedan localmente; no se realizan pagos, despachos ni envíos reales de correos. Usa datos ficticios. Los controles por rol son una simulación de frontend, no seguridad de servidor.

Consulta [la relación de requisitos, archivos y pruebas](docs/requisitos-y-pruebas.md). El video y las imágenes nuevas del blog se dejaron pendientes por decisión del usuario.
