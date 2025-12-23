---
description: Configura el entorno de AI Logger para esta sesión
allowed-tools: Bash
---

Configura el entorno de AI Logger para esta sesión.

## Instrucciones

1. Crea la estructura de directorios en el repo:

```bash
mkdir -p ai-logger/data/{diary,articles,notes,logs,sessions}
```

2. Verifica que todo está listo:

```bash
ls -la ai-logger/data/
```

3. Confirma y muestra los comandos disponibles:

```
✅ AI Logger configurado

📁 Datos se guardarán en: ai-logger/data/

🚀 Comandos disponibles:
   /diary            Genera resumen de la sesión
   /article [tema]   Crea artículo para blog
   /log [nota]       Guarda nota rápida
   /stats            Estadísticas de uso

💡 Tip: Usa /log durante la sesión para capturar ideas
        Usa /diary al final para generar el resumen
```
