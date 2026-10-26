# Biorigen · sitio web

Sitio estático de **Biorigen**, marca de biotecnología alimentaria nacida en el ITESCO. Reúne la línea de yogurt **Gluco-Control**, la línea de **kéfir de leche**, el proyecto de salud **SANO-DERMA** y los proyectos de **Biorigen Labs**.

> **Estado:** demostración académica. El carrito, las cuentas, los pedidos, las degustaciones y los formularios funcionan en el navegador, pero no hay pagos, envíos, correos ni base de datos real.

---

## 1. Qué incluye

- Inicio con presentación de marca, líneas, proceso, ciencia y proyectos.
- Catálogo con filtros por línea.
- Fichas de producto con sabor, presentación, cantidad, favoritos, carrito y solicitud de degustación.
- Carrito lateral y checkout simulado de tres pasos.
- Cuentas locales, perfil, historial de pedidos y favoritos.
- Páginas de Nosotros, Ciencia, Proyectos, Contacto, Aviso académico y Logotipos.
- Página 404 con detección de raíz o subcarpeta para GitHub Pages.
- Diseño responsive y navegación móvil.
- URLs limpias mediante carpetas con `index.html`.

---

## 2. Ver el sitio

### Opción recomendada: servidor local

Desde la carpeta del proyecto:

```powershell
python -m http.server 8123
```

Abre `http://127.0.0.1:8123/`.

También puedes usar cualquier servidor estático, por ejemplo:

```powershell
npx serve .
```

### Abrir el archivo directamente

También funciona abrir `index.html` con doble clic. La página 404 y algunas rutas están pensadas para un servidor, así que para probar enlaces y rutas limpias es mejor usar el servidor local.

---

## 3. Estructura del proyecto

```text
biorigen/
├─ build.js                 Generador del sitio
├─ index.html               Inicio generado
├─ 404.html                 Página no encontrada generada
├─ robots.txt
├─ LEEME.md
├─ assets/
│  ├─ css/
│  │  ├─ _base.css          Variables, tipografía, navegación y pie
│  │  ├─ _home.css          Inicio, proceso, ciencia y tarjetas
│  │  ├─ _pages.css         Páginas internas y fichas
│  │  ├─ _shop.css          Tienda, carrito y modales
│  │  ├─ _responsive.css    Adaptación a móvil y tablet
│  │  └─ styles.css         CSS final generado; no editar a mano
│  ├─ js/
│  │  ├─ data.js            Productos, proyectos, equipo y textos base
│  │  ├─ art.js             Logotipos e ilustraciones SVG
│  │  ├─ components.js      Header, footer, carrito y modales
│  │  └─ app.js             Carrito, cuentas, checkout y formularios
│  └─ img/
│     └─ favicon.svg        Generado por build.js
├─ productos/
│  ├─ index.html            Catálogo
│  ├─ gluco-control/        Línea de yogurt
│  └─ kefir/                Línea de kéfir
├─ nosotros/index.html
├─ ciencia/index.html
├─ proyectos/
│  ├─ index.html
│  ├─ sano-derma/
│  ├─ barras-energeticas/
│  └─ fertilizante-hongos/
├─ contacto/index.html
├─ aviso-academico/index.html
└─ logotipos/index.html
```

### Regla importante

Los archivos `index.html`, `404.html`, `assets/css/styles.css` y `assets/img/favicon.svg` son **generados**. Si los editas a mano, el siguiente `node build.js` los sobrescribirá.

Edita las fuentes:

- `assets/js/data.js`
- `assets/js/art.js`
- `assets/js/components.js`
- `assets/js/app.js`
- `assets/css/_*.css`
- `build.js`

---

## 4. Editar contenido

### 4.1 Datos globales

En `assets/js/data.js`, dentro de `SITE`, están el correo, teléfono, dirección, escuela, ciudad, año y nombre de la feria.

```js
const SITE = {
  name: 'Biorigen',
  email: 'biorigen.itesco@gmail.com',
  phone: '961 702 1594',
  address: 'Nardo 7, Iquisa, 96540 Coatzacoalcos, Veracruz',
  // ...
};
```

### 4.2 Productos

Los productos viven en `PRODUCTS`. Cada objeto genera su ficha y su tarjeta en el catálogo.

Campos principales:

- `id`: identificador interno, sin espacios.
- `line`: `gluco-control` o `kefir`.
- `slug`: parte final de la URL.
- `name`, `shortName`, `flavor`.
- `short`, `desc`: textos de tarjeta y ficha.
- `sizes`: presentaciones con `id`, `label`, `price` y `compare`.
- `badges`, `benefits`.
- `ingredients`, `nutrition`, `conservation`, `usage`.
- `faq`: preguntas y advertencias.
- `art`: tipo de ilustración (`jar`, `bottle`, etc.).
- `tint`, `tint2`: colores de la ficha.
- `featured`: si aparece destacado.

Ejemplo de presentación:

```js
sizes: [
  { id: '150g', label: '150 g', price: 45, compare: 55 },
  { id: '400g', label: '400 g', price: 105, compare: 125 }
]
```

Para agregar un producto a una línea existente:

1. Añade el objeto a `PRODUCTS`.
2. Ejecuta `node build.js`.
3. Se genera `productos/<linea>/<slug>/index.html`.

Para una línea nueva, además hay que:

1. Añadirla a `LINES`.
2. Incluirla en el filtro de generación de `build.js` (hoy genera solo `gluco-control` y `kefir`).
3. Añadir sus enlaces en el header, el menú móvil y el footer de `build.js`.

> El generador no borra carpetas viejas. Si eliminas un producto o proyecto, borra manualmente su carpeta para que no quede publicada.

### 4.3 Proyectos

Los proyectos viven en `PROJECTS`. Cada uno genera una página en `proyectos/<slug>/`.

Campos útiles:

- `name`, `subtitle`, `summary`, `description`, `long`.
- `status`, `statusTone`: texto y color del estado.
- `highlights`, `process`, `next`.
- `team`, `advisors`, `tags`.
- `disclaimer`: aviso importante.
- `cta`, `ctaHref`: llamado a la acción.
- `art`, `color`, `tint`, `accent`.

SANO-DERMA debe mantenerse como **proyecto de investigación en validación**, sin carrito y sin presentarse como medicamento. Su llamado a la acción es de contacto.

### 4.4 Textos, equipo y preguntas

- `TEAM` y `ADVISOR`: equipo y asesor.
- `VALUES`: principios de la marca.
- `PROCESS`: pasos del proceso.
- `SCIENCE`: temas científicos.
- `FAQ`: preguntas frecuentes.

Parte de los textos editoriales de Inicio, Nosotros, Ciencia y Contacto están directamente en las funciones de `build.js`. Si necesitas cambiar una frase que no aparece en `data.js`, búscala en `build.js`.

### 4.5 Logotipo

La propuesta **A, “brote orbital”**, es la que se usa en el header y el footer mediante `ART.logoMark('A')` en `build.js`.

- Las cuatro propuestas están en `assets/js/art.js` y se muestran en `logotipos/index.html`.
- El favicon se genera con un SVG escrito en `build.js`; si cambias de propuesta, actualiza también ese SVG.
- Para cambiar la propuesta principal, busca `ART.logoMark('A')` en `build.js` y ajusta el favicon.

---

## 5. Generar el sitio

Requisitos: **Node.js 18 o superior**. No hay dependencias externas ni `npm install`.

```powershell
node build.js
```

El comando:

1. Concatena los parciales CSS en `assets/css/styles.css`.
2. Calcula un hash de versión.
3. Genera las 20 páginas HTML.
4. Añade `?v=<hash>` a CSS y JS para evitar caché vieja.
5. Genera `favicon.svg` y `robots.txt`.

Después de cambiar cualquier archivo fuente, vuelve a ejecutar `node build.js` y recarga con `Ctrl + F5`.

---

## 6. Publicar en GitHub Pages

El sitio ya está pensado para publicarse como archivos estáticos.

1. Ejecuta `node build.js` antes de subir.
2. Sube **el contenido de la carpeta `biorigen/`** a la raíz del repositorio, no la carpeta completa dentro de otra carpeta.
3. En GitHub, entra a **Settings → Pages**.
4. Elige la rama y la carpeta que correspondan (por ejemplo, `main` y `/ (root)`).
5. Guarda y espera uno o dos minutos.

La URL quedará así:

```text
https://usuario.github.io/repositorio/
```

Las URLs limpias funcionan porque cada ruta es una carpeta con `index.html`:

```text
/productos/
/productos/kefir/
/productos/kefir/fresa/
/proyectos/sano-derma/
```

### 404 en GitHub Pages

`404.html` debe quedar en la raíz del sitio publicado. Su script detecta si el sitio está en la raíz o en una subcarpeta como `/repositorio/`, y ajusta la base para que los estilos y enlaces funcionen.

Para probarlo en local:

```powershell
# Desde la carpeta que contiene a biorigen/
python -m http.server 8124
```

Abre:

```text
http://127.0.0.1:8124/biorigen/404.html
```

### Si el sitio ya estaba publicado

Reemplaza los archivos generados y haz commit. No necesitas ejecutar `build.js` en GitHub Pages: el repositorio debe contener el HTML ya generado.

Si ves una versión vieja, espera a que GitHub termine de publicar o fuerza la recarga. El hash `?v=` ayuda con CSS y JS, pero el HTML puede tardar unos minutos en actualizarse.

### Nota sobre Jekyll

Los parciales CSS empiezan con `_` y son archivos fuente; el sitio publicado usa `styles.css`. Si quieres que GitHub Pages sirva también todos los archivos que empiezan con `_`, agrega un archivo vacío llamado `.nojekyll` en la raíz del repositorio. No es obligatorio para que el sitio funcione.

---

## 7. Carrito, cuentas y datos locales

El estado se guarda en `localStorage` con la clave:

```text
biorigen_v1_state
```

Incluye:

- Carrito.
- Favoritos.
- Cuentas.
- Sesión activa.
- Pedidos simulados.
- Solicitudes de degustación.

### Importante

- No hay backend ni autenticación real.
- Las contraseñas se guardan como hash SHA-256 en el navegador, sin sal. **No uses contraseñas reales.**
- Las cuentas y los pedidos no se sincronizan entre dispositivos.
- Los formularios no envían correos; solo guardan datos en el navegador.
- Los pedidos son simulados y no procesan pagos.

Para limpiar la demo desde la consola del navegador:

```js
localStorage.removeItem('biorigen_v1_state');
location.reload();
```

También puedes borrar el almacenamiento del sitio desde **DevTools → Application → Local Storage**.

---

## 8. Límites de la demostración

- **Precios:** son de demostración, en pesos mexicanos. No son una cotización.
- **Fichas nutrimentales:** son estimaciones del prototipo. Están marcadas como tal y no sustituyen un análisis de laboratorio.
- **Procesos y tiempos:** son descripciones académicas del prototipo, no un protocolo industrial validado.
- **SANO-DERMA:** proyecto de investigación en validación. No es un medicamento, no se vende y no sustituye atención médica.
- **Barras energéticas:** concepto en formulación.
- **Biofertilizante fúngico:** investigación temprana.
- **Kéfir:** contiene lactosa. La fermentación puede producir trazas de alcohol por debajo del 0.5 %. No es una bebida alcohólica. Personas con intolerancia severa, inmunocomprometidas, embarazadas o niños pequeños deben consultar a un profesional de la salud.
- **Gluco-Control:** no es un tratamiento para diabetes ni sustituye una dieta o un tratamiento médico.

El detalle legal está en `aviso-academico/index.html`.

---

## 9. Accesibilidad y comprobaciones

Se revisó el sitio con Lighthouse en las páginas principales: Inicio, catálogo, línea de yogurt, línea de kéfir, ficha de producto, Nosotros, Ciencia, Proyectos, SANO-DERMA, Contacto, Aviso académico, Logotipos y 404.

Resultado en las últimas comprobaciones:

- Accesibilidad: 100.
- Buenas prácticas: 100.
- SEO: 100.

También se comprobó:

- Sin desbordamiento horizontal en 1440, 1024, 768 y 390 px.
- Enlaces internos y anclas sin destinos rotos.
- Navegación por teclado, menú móvil, carrito y checkout.
- Página 404 en raíz y en subcarpeta.

Si agregas contenido, vuelve a revisar:

1. Contraste de texto.
2. Orden de encabezados (`h1` → `h2` → `h3`).
3. Nombres accesibles de botones y enlaces.
4. Foco visible y navegación con teclado.
5. Que las imágenes decorativas no dupliquen información.

---

## 10. Mantenimiento rápido

### Cambiar un precio

En `data.js`, dentro del producto y la presentación:

```js
{ id: '1l', label: '1 L', price: 145, compare: 170 }
```

### Cambiar el correo o teléfono

En `SITE`, dentro de `data.js`.

### Cambiar el estado de un proyecto

En `PROJECTS`, ajusta `status` y `statusTone`.

Tonos disponibles: `active`, `soon`, `research`.

### Agregar una pregunta frecuente

En `FAQ` de `data.js` o en el `faq` de un producto.

### Cambiar un color

En `assets/css/_base.css`, dentro de `:root`. Los principales son:

- `--forest`
- `--moss`
- `--cream`
- `--paper`
- `--clay`
- `--blue`
- `--gold`

Después ejecuta `node build.js`.

### Cambiar el aviso de la demo

En `build.js`, busca el texto del footer y la página `legalPage`. El aviso completo está en `aviso-academico/index.html`, generado desde `legalPage`.

---

## 11. Respaldo

El proyecto anterior de Gluco-Control se conserva intacto en:

```text
C:\Users\mendo\Downloads\gluco-control
```

No lo elimines ni lo sobrescribas si necesitas comparar o recuperar el diseño anterior.

---

## 12. Contacto

- Correo: `biorigen.itesco@gmail.com`
- Teléfono: `961 702 1594`
- Dirección: Nardo 7, Iquisa, 96540 Coatzacoalcos, Veracruz
- Institución: Instituto Tecnológico Superior de Coatzacoalcos (ITESCO)

---

Hecho con ciencia, fermentación y bastante café. Si algo no cuadra, primero revisa `data.js`, luego `build.js`, y al final ejecuta `node build.js` otra vez.
