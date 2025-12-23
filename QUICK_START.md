# Guía Rápida de Inicio

## Ver el Contenido Localmente (2 minutos)

```bash
# 1. Navega al visualizador
cd viewer

# 2. Instala dependencias
npm install

# 3. Ejecuta el servidor de desarrollo
npm run dev

# 4. Abre tu navegador en: http://localhost:5173
```

## Compartir con Otros - Opciones Rápidas

### Opción 1: Vercel (Más Rápido - 1 minuto)

```bash
# Desde la carpeta viewer/
npm install -g vercel
vercel
```

Sigue las instrucciones y obtendrás una URL pública como: `https://tu-proyecto.vercel.app`

### Opción 2: Netlify Drop (Sin Terminal)

1. Ejecuta `npm run build` en la carpeta `viewer/`
2. Ve a https://app.netlify.com/drop
3. Arrastra la carpeta `dist/` a la página
4. Obtén tu URL instantáneamente

### Opción 3: CodeSandbox (Para Editar en Línea)

1. Ve a https://codesandbox.io
2. Click en "Import from GitHub"
3. Pega la URL de tu repositorio
4. Comparte el enlace generado

## Ver el Componente Solo

Si solo quieres ver el componente React sin montar toda la app:

- Archivo: `docs/OsmaniWorkflow.jsx`
- Copia y pega en tu proyecto React existente
- Asegúrate de tener Tailwind CSS configurado

## Troubleshooting

### "npm no encontrado"
Instala Node.js desde https://nodejs.org

### "Puerto 5173 en uso"
El servidor de desarrollo usará automáticamente otro puerto (5174, 5175, etc.)

### Build falla
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

## Siguientes Pasos

- Lee `viewer/README.md` para opciones avanzadas de despliegue
- Personaliza los colores y contenido en `OsmaniWorkflow.jsx`
- Añade tus propios workflows de IA

## Soporte

Abre un issue en GitHub para preguntas o problemas.
