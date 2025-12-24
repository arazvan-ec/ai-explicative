---
description: Muestra estadísticas de tu uso de Claude Code
allowed-tools: Bash, Read
---

Analiza mis logs y muestra estadísticas de uso de Claude Code.

**Período:** $ARGUMENTS (si vacío, usa "today")

**Directorio de datos:** `ai-logger/data/`

## Instrucciones

1. Lee los archivos en `ai-logger/data/`:
   - `diary/` - Diarios generados
   - `articles/` - Artículos creados
   - `notes/` - Notas guardadas
   - `logs/` - Logs de interacciones

2. Cuenta y analiza:
   - Número de diarios
   - Número de artículos
   - Número de notas
   - Archivos por fecha

3. Muestra reporte:

```
📊 Estadísticas de AI Logger
═══════════════════════════════

📔 Diarios:    X archivos
📝 Artículos:  X archivos
📌 Notas:      X archivos

📅 Actividad reciente:
   - YYYY-MM-DD: diary, 2 notas
   - YYYY-MM-DD: article, 1 nota

📁 Espacio usado: X KB
```

4. Si no hay datos, sugiere usar `/diary` o `/log` para empezar.
