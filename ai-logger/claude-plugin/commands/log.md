---
description: Registra una nota o reflexión sobre tu experiencia con IA
allowed-tools: Bash
---

Registra esta nota en mi diario de experiencias con IA:

"$ARGUMENTS"

1. Crea el directorio si no existe: `mkdir -p ~/.ai-logger/notes`

2. Agrega la nota al archivo de notas del día con este formato:
```
## [HH:MM] Nota

$ARGUMENTS

---
```

3. Guárdala en: `~/.ai-logger/notes/notes-$(date +%Y-%m-%d).md`

4. Confirma que se guardó exitosamente.
