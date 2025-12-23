# AI Explicative

Documentación y recursos para explicar cómo aplicar la IA en un entorno de desarrollo.

## 🎯 Contenido

### Workflows de Desarrollo con IA

- **[Osmani Workflow](./docs/OsmaniWorkflow.jsx)**: Componente React interactivo que explica el flujo de trabajo de 10 pasos de Addy Osmani para desarrollo asistido por IA.

## 🚀 Visualizador Web Interactivo

Hemos creado una aplicación web para visualizar el workflow de forma interactiva:

### Ejecutar localmente

```bash
cd viewer
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Desplegar

Consulta [viewer/README.md](./viewer/README.md) para instrucciones completas de despliegue en:
- Vercel (recomendado)
- Netlify
- GitHub Pages
- CodeSandbox

## 📁 Estructura del Proyecto

```
ai-explicative/
├── docs/                   # Documentación y componentes educativos
│   └── OsmaniWorkflow.jsx  # Flujo de trabajo LLM Coding 2026
├── viewer/                 # Aplicación web interactiva
│   ├── src/
│   │   ├── OsmaniWorkflow.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── README.md          # Guía completa de despliegue
└── README.md              # Este archivo
```

## 🎨 Características del Visualizador

- **Interactivo**: Click en cada paso para ver detalles completos
- **Filtros por fase**: Planificación, Ejecución, Calidad, Mentalidad
- **Visual**: Diagrama de flujo de trabajo
- **Ejemplos prácticos**: Prompts y anti-patrones
- **Herramientas**: Lista de CLI agents, async agents y context tools

## 🔗 Compartir

Opciones para compartir el contenido:

1. **Deploy online**: Usa Vercel/Netlify para obtener una URL pública
2. **GitHub Pages**: Publica en tu dominio de GitHub
3. **CodeSandbox**: Comparte un enlace editable
4. **Export estático**: `npm run build` genera HTML/CSS/JS estáticos

## 🤝 Contribuir

Este repositorio está en desarrollo activo. Las contribuciones son bienvenidas.

## 📖 Recursos

- Basado en "Beyond Vibe Coding" de Addy Osmani
- Engineering Leader @ Google Chrome

## 📄 Licencia

MIT
