# AI Logger - Plugin Nativo para Claude Code

Plugin que se integra directamente con Claude Code usando slash commands, MCP server y hooks.

## Instalación Rápida

```bash
cd ai-logger/claude-plugin
./install.sh
```

Esto instala:
- ✅ Slash commands (`/diary`, `/article`, `/log`, `/stats`)
- ✅ MCP Server con herramientas nativas
- ✅ Hooks para captura automática

## Uso

### Slash Commands

Después de instalar, puedes usar estos comandos en cualquier sesión de Claude Code:

```
/diary              # Genera resumen de tu sesión actual
/article debugging  # Crea artículo sobre debugging
/log "Aprendí X"    # Guarda una nota rápida
/stats week         # Estadísticas de la semana
```

### Herramientas MCP

El MCP server proporciona herramientas que Claude puede usar automáticamente:

| Herramienta | Descripción |
|-------------|-------------|
| `save_interaction` | Guarda una interacción en el log |
| `save_note` | Guarda una nota o reflexión |
| `get_stats` | Obtiene estadísticas de uso |
| `get_logs` | Lee los logs de interacciones |
| `list_diaries` | Lista los diarios generados |
| `list_articles` | Lista los artículos generados |

### Captura Automática (Hooks)

Los hooks capturan automáticamente:

- **PostToolUse**: Cada herramienta que usas (Edit, Bash, Read, etc.)
- **SessionEnd**: Resumen y transcript de cada sesión

## Estructura de Archivos

```
~/.ai-logger/
├── logs/
│   └── interactions-YYYY-MM-DD.jsonl   # Interacciones automáticas
├── notes/
│   └── notes-YYYY-MM-DD.md             # Notas con /log
├── diary/
│   └── diary-YYYY-MM-DD.md             # Diarios con /diary
├── articles/
│   └── draft-*.md                      # Artículos con /article
└── sessions/
    ├── session-{id}.json               # Metadata de sesión
    └── session-{id}.md                 # Transcript

~/.claude/
├── commands/
│   ├── diary.md
│   ├── article.md
│   ├── log.md
│   └── stats.md
└── settings.json                       # Configuración de MCP y hooks
```

## Flujo de Trabajo

### Diario Diario

1. Trabaja normalmente con Claude Code
2. Al terminar: `/diary`
3. Claude analiza la sesión y genera el resumen
4. Revisa y edita `~/.ai-logger/diary/diary-YYYY-MM-DD.md`

### Crear Artículo

1. Después de una sesión interesante: `/article mi tema`
2. Claude genera un borrador basado en tu experiencia
3. Edita `~/.ai-logger/articles/draft-*.md`
4. Publica en tu blog

### Notas Rápidas

Durante una sesión:
```
/log Descubrí que usar contexto específico mejora las respuestas
/log Tip: siempre leer el archivo antes de editar
```

## Configuración Manual

Si prefieres configurar manualmente:

### 1. Slash Commands

Copia los archivos `.md` a `~/.claude/commands/`

### 2. MCP Server

Agrega a `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "ai-logger": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/ai-logger/claude-plugin/mcp-server/src/index.js"]
    }
  }
}
```

### 3. Hooks

Agrega a `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "/path/to/hooks/post-tool-logger.sh"
      }]
    }],
    "SessionEnd": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "/path/to/hooks/session-end.sh"
      }]
    }]
  }
}
```

## Desinstalar

```bash
# Eliminar commands
rm ~/.claude/commands/{diary,article,log,stats}.md

# Eliminar MCP server de settings.json
# (editar manualmente y quitar "ai-logger" de mcpServers)

# Eliminar hooks de settings.json
# (editar manualmente)

# Opcional: eliminar datos
rm -rf ~/.ai-logger/
```

## Desarrollo

```bash
# Probar MCP server
cd claude-plugin/mcp-server
npm install
node src/index.js

# Los slash commands son markdown, edítalos directamente
```

## Licencia

MIT
