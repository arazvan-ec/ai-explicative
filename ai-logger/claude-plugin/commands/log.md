---
description: Registra una nota o reflexión rápida
allowed-tools: Bash, Write
---

Registra esta nota en mi diario de experiencias con IA:

**Nota:** $ARGUMENTS

**Directorio:** `ai-logger/data/notes/`

## Instrucciones

1. Crea el directorio si no existe:
```bash
mkdir -p ai-logger/data/notes
```

2. Agrega la nota al archivo del día con formato:

```markdown
## [HH:MM] Nota

$ARGUMENTS

---
```

3. Guarda en: `ai-logger/data/notes/notes-YYYY-MM-DD.md`

4. Si el archivo no existe, créalo con header:
```markdown
# Notas - YYYY-MM-DD

```

5. Confirma que se guardó.
