# AI Logger - Plugin para Claude Code

Plugin que documenta tus experiencias con Claude Code y genera diarios/artículos.

## Instalación

### Para Claude Code Web 🌐

```bash
cd ai-logger/claude-plugin
./install-web.sh
```

Instala solo los **slash commands** (100% compatible con web).

### Para Claude Code CLI 💻

```bash
cd ai-logger/claude-plugin
./install.sh
```

Instala todo: slash commands + MCP server + hooks de captura automática.

---

## Comparativa Web vs CLI

| Característica | Web | CLI |
|----------------|-----|-----|
| `/diary` | ✅ | ✅ |
| `/article` | ✅ | ✅ |
| `/log` | ✅ | ✅ |
| `/stats` | ✅ | ✅ |
| `/setup` | ✅ | ✅ |
| MCP tools | ❌ | ✅ |
| Auto-captura (hooks) | ❌ | ✅ |

---

## Uso

### Slash Commands

```
/setup              # Configura el entorno (ejecutar al inicio en web)
/diary              # Genera resumen de tu sesión actual
/article debugging  # Crea artículo sobre debugging
/log "Aprendí X"    # Guarda una nota rápida
/stats              # Muestra estadísticas
```

### Flujo de Trabajo Recomendado

**En Claude Code Web:**
```
1. /setup                    # Al iniciar
2. [trabajar normalmente]
3. /log "nota interesante"   # Durante la sesión
4. /diary                    # Al terminar
5. /article mi-tema          # Si hay algo para blog
```

**En Claude Code CLI:**
```
1. [trabajar normalmente]    # Captura automática con hooks
2. /diary                    # Al terminar
3. /article mi-tema          # Para blog
```

---

## Estructura de Archivos

```
~/.ai-logger/
├── diary/                    # Diarios generados
│   └── diary-YYYY-MM-DD.md
├── articles/                 # Artículos para blog
│   └── draft-*.md
├── notes/                    # Notas rápidas
│   └── notes-YYYY-MM-DD.md
├── logs/                     # Logs de interacciones (solo CLI)
│   └── interactions-*.jsonl
└── sessions/                 # Transcripts (solo CLI)

~/.claude/
└── commands/                 # Slash commands instalados
    ├── setup.md
    ├── diary.md
    ├── article.md
    ├── log.md
    └── stats.md
```

---

## Herramientas MCP (Solo CLI)

El MCP server proporciona herramientas adicionales:

| Herramienta | Descripción |
|-------------|-------------|
| `save_interaction` | Guarda una interacción |
| `save_note` | Guarda una nota |
| `get_stats` | Obtiene estadísticas |
| `get_logs` | Lee los logs |
| `list_diaries` | Lista diarios |
| `list_articles` | Lista artículos |

---

## Desinstalar

```bash
# Eliminar commands
rm ~/.claude/commands/{setup,diary,article,log,stats}.md

# Eliminar datos (opcional)
rm -rf ~/.ai-logger/
```

---

## Licencia

MIT
