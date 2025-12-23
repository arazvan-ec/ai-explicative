---
description: Configura el entorno de AI Logger (ejecutar al inicio de sesión)
allowed-tools: Bash
---

Configura el entorno de AI Logger para esta sesión.

Ejecuta estos comandos para preparar el sistema:

```bash
# Crear estructura de directorios
mkdir -p ~/.ai-logger/{diary,articles,notes,logs,sessions}

# Crear archivo de sesión con timestamp
echo "Session started: $(date -Iseconds)" >> ~/.ai-logger/logs/sessions.log

# Verificar que todo está listo
ls -la ~/.ai-logger/
```

Confirma que el entorno está listo y menciona los comandos disponibles:
- `/diary` - Genera resumen de la sesión
- `/article [tema]` - Crea artículo para blog
- `/log [nota]` - Guarda nota rápida
- `/stats` - Estadísticas de uso
