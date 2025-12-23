# Desplegar a GitHub Pages

Todo está configurado para GitHub Pages. Solo necesitas hacer el deploy desde tu máquina local (donde tienes tus credenciales de GitHub).

## Pasos para desplegar:

### 1. Clona el repositorio en tu máquina local (si no lo has hecho):

```bash
git clone https://github.com/arazvan-ec/ai-explicative.git
cd ai-explicative
```

### 2. Cambia al branch con los cambios:

```bash
git checkout claude/ai-workflow-docs-z2fLH
git pull origin claude/ai-workflow-docs-z2fLH
```

### 3. Instala dependencias:

```bash
cd viewer
npm install
```

### 4. Despliega a GitHub Pages:

```bash
npm run deploy
```

Este comando hará:
- Build de la aplicación
- Crear/actualizar la rama `gh-pages`
- Subir los archivos compilados a GitHub

### 5. Configura GitHub Pages (solo la primera vez):

1. Ve a tu repositorio: https://github.com/arazvan-ec/ai-explicative
2. Click en **Settings**
3. En el menú lateral, click en **Pages**
4. En "Branch", selecciona `gh-pages` y `/root`
5. Click en **Save**

### 6. Accede a tu sitio:

En unos minutos, tu sitio estará disponible en:

**https://arazvan-ec.github.io/ai-explicative/**

## Actualizaciones futuras

Cuando hagas cambios al componente, simplemente:

```bash
cd viewer
npm run deploy
```

Y los cambios se desplegarán automáticamente.

## Troubleshooting

### Error de autenticación
Si obtienes un error 403, asegúrate de:
- Tener permisos de escritura en el repositorio
- Estar autenticado con GitHub (usa `gh auth login` si usas GitHub CLI)
- O configura un Personal Access Token

### El sitio muestra "404"
- Espera 2-3 minutos después del primer deploy
- Verifica que la rama `gh-pages` existe en GitHub
- Revisa la configuración en Settings > Pages

### Los estilos no cargan
- Esto ya está configurado correctamente con `base: '/ai-explicative/'` en vite.config.js
- Si aún hay problemas, verifica que el nombre del repositorio coincida

## Alternativa: GitHub Actions (Deploy automático)

Si prefieres que se despliegue automáticamente con cada push, puedo configurar GitHub Actions para ti. Solo dímelo.
