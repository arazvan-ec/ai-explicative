---
description: Genera un resumen/diario de tu sesión actual con Claude Code
allowed-tools: Bash, Read, Write
---

Genera un diario/resumen de mi sesión actual con Claude Code.

Analiza el contexto de nuestra conversación y crea un resumen estructurado en Markdown que incluya:

1. **Resumen ejecutivo** - ¿Qué logramos hoy?
2. **Tareas completadas** - Lista de lo que se hizo
3. **Herramientas usadas** - Qué tools se utilizaron y para qué
4. **Archivos modificados** - Lista de archivos creados/editados
5. **Código destacado** - Snippets importantes
6. **Aprendizajes** - ¿Qué aprendí de esta sesión?
7. **Próximos pasos** - ¿Qué queda pendiente?

Guarda el diario en: `~/.ai-logger/diary/diary-$(date +%Y-%m-%d).md`

Si ya existe un diario de hoy, agrégalo como una nueva sección con la hora.

Al final, muestra un resumen corto de lo generado.
