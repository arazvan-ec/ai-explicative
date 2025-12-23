---
description: Muestra estadísticas de tu uso de Claude Code
allowed-tools: Bash, Read
---

Analiza mis logs de interacción con Claude Code y muestra estadísticas.

Período: $ARGUMENTS (si está vacío, usa "today")

1. Lee los archivos de log en `~/.ai-logger/logs/`

2. Genera un reporte con:
   - **Total de interacciones** del período
   - **Herramientas más usadas** (top 5 con conteo)
   - **Proyectos trabajados** (basado en directorios)
   - **Archivos más modificados**
   - **Hora más productiva** (si hay datos de múltiples días)

3. Muestra el reporte en formato tabla usando caracteres ASCII.

4. Si no hay datos, sugiere cómo empezar a capturar (instalar hooks).

Formato de salida esperado:
```
📊 Estadísticas de Claude Code - [período]
═══════════════════════════════════════════

Total interacciones: XX

🔧 Herramientas más usadas:
   Edit         ████████████  45
   Read         ████████      32
   Bash         ██████        24

📁 Proyectos:
   - proyecto-1 (XX interacciones)
   - proyecto-2 (XX interacciones)

📈 Productividad:
   Promedio por sesión: XX
```
