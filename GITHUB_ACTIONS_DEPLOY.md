# Deploy Automático con GitHub Actions (Opción Alternativa)

Si prefieres que tu sitio se despliegue automáticamente cada vez que hagas push a la rama principal, usa GitHub Actions.

## Ventajas

- ✅ Deploy automático en cada push
- ✅ No requiere ejecutar comandos manualmente
- ✅ No necesitas tener Node.js instalado localmente
- ✅ Más moderno y recomendado por GitHub

## Configuración (3 pasos)

### 1. Habilita GitHub Pages con Actions

1. Ve a tu repositorio: https://github.com/arazvan-ec/ai-explicative
2. Click en **Settings**
3. En el menú lateral, click en **Pages**
4. En "Source", selecciona **GitHub Actions**
5. ¡Eso es todo! No necesitas seleccionar rama

### 2. Merge tu branch a main/master

```bash
# Opción 1: Merge directo
git checkout main  # o master
git merge claude/ai-workflow-docs-z2fLH
git push origin main

# Opción 2: Crear Pull Request (recomendado)
# Ve a GitHub y crea un PR de claude/ai-workflow-docs-z2fLH a main
```

### 3. Espera el deploy

- GitHub Actions ejecutará automáticamente el workflow
- Puedes ver el progreso en la pestaña "Actions" de tu repositorio
- En 2-3 minutos estará listo

### URL de tu sitio:

**https://arazvan-ec.github.io/ai-explicative/**

## ¿Cómo funciona?

He creado el archivo `.github/workflows/deploy.yml` que:

1. Se activa automáticamente cuando haces push a `main` o `master`
2. Instala las dependencias
3. Hace build de la aplicación
4. Despliega a GitHub Pages

## Actualizaciones futuras

Simplemente haz push a la rama principal:

```bash
git add .
git commit -m "Update content"
git push origin main
```

Y GitHub Actions hará el resto automáticamente.

## Verificar el deploy

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **Actions**
3. Verás el workflow "Deploy to GitHub Pages" ejecutándose
4. Cuando aparezca un ✅ verde, tu sitio está actualizado

## Deploy manual

También puedes activar el deploy manualmente:

1. Ve a **Actions**
2. Selecciona "Deploy to GitHub Pages"
3. Click en "Run workflow"

## ¿Cuál método elegir?

| GitHub Actions (Recomendado) | gh-pages manual |
|------------------------------|-----------------|
| ✅ Automático                 | ⚠️ Manual        |
| ✅ Moderno                    | ⚠️ Obsoleto      |
| ✅ Sin dependencias locales   | ⚠️ Requiere npm  |
| ⚠️ Requiere configuración     | ✅ Más simple    |

**Recomendación:** Usa GitHub Actions si vas a actualizar el contenido frecuentemente.
