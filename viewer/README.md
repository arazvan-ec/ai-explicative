# LLM Coding Workflow 2026 - Visualizador Interactivo

Aplicación web interactiva que muestra el flujo de trabajo de desarrollo asistido por IA de Addy Osmani.

## 🚀 Ejecutar Localmente

### Requisitos Previos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar en modo desarrollo**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
La aplicación estará disponible en `http://localhost:5173`

## 📦 Build para Producción

```bash
npm run build
```

Los archivos compilados estarán en el directorio `dist/`.

## 🌐 Opciones de Despliegue

### Opción 1: Vercel (Recomendado - Más Fácil)

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Despliega:
```bash
vercel
```

O conecta tu repositorio de GitHub a [vercel.com](https://vercel.com) para despliegue automático.

### Opción 2: Netlify

1. Instala Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Despliega:
```bash
npm run build
netlify deploy --prod --dir=dist
```

O arrastra la carpeta `dist/` a [netlify.com/drop](https://app.netlify.com/drop).

### Opción 3: GitHub Pages

1. Instala gh-pages:
```bash
npm install -D gh-pages
```

2. Añade al `package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://[tu-usuario].github.io/[tu-repo]"
}
```

3. Actualiza `vite.config.js`:
```js
export default defineConfig({
  base: '/[nombre-repo]/',
  plugins: [react()],
})
```

4. Build y despliega:
```bash
npm run build
npm run deploy
```

### Opción 4: Compartir Rápidamente con CodeSandbox

1. Ve a [codesandbox.io](https://codesandbox.io)
2. Importa desde GitHub o arrastra la carpeta `viewer/`
3. Comparte el enlace generado

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **Vite** - Build tool y dev server
- **Tailwind CSS 4** - Estilos
- **ESLint** - Linting

## 📝 Estructura del Proyecto

```
viewer/
├── src/
│   ├── OsmaniWorkflow.jsx  # Componente principal
│   ├── App.jsx             # Aplicación raíz
│   └── index.css           # Estilos globales (Tailwind)
├── public/                 # Assets estáticos
├── index.html             # HTML principal
└── vite.config.js         # Configuración Vite
```

## 🎨 Personalización

El componente `OsmaniWorkflow.jsx` es completamente personalizable. Puedes:
- Modificar los colores en el objeto `phases`
- Añadir o modificar pasos en el array `steps`
- Ajustar los estilos de Tailwind CSS

## 📖 Más Información

Basado en el artículo y libro "Beyond Vibe Coding" de Addy Osmani (Engineering Leader @ Google Chrome).
