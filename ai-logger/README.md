# AI Logger - Plugin para Claude Code

Plugin que captura automáticamente tus interacciones con Claude Code y genera resúmenes diarios y artículos para documentar tu experiencia.

## Características

- **Captura automática** de todas las interacciones con Claude Code
- **Resúmenes diarios** con estadísticas y métricas
- **Generación de artículos** basados en tus experiencias
- **Estadísticas** de uso y productividad
- **Historial de sesiones** navegable

## Instalación

### 1. Instalar dependencias

```bash
cd ai-logger
npm install
```

### 2. Instalar hooks globalmente

```bash
npm run install-hooks
# o
node bin/ai-logger.js install-hooks --global
```

Esto:
- Crea el directorio `~/.ai-logger/` para los datos
- Instala los hooks en `~/.claude/settings.json`
- Comienza a capturar automáticamente en la próxima sesión

### 3. (Opcional) Hacer el CLI disponible globalmente

```bash
npm link
```

Ahora puedes usar `ai-logger` desde cualquier lugar.

## Uso

### Comandos Principales

```bash
# Ver estadísticas de uso
ai-logger stats
ai-logger stats --week
ai-logger stats --month

# Generar diario del día
ai-logger diary
ai-logger diary --date 2024-01-15
ai-logger diary --week

# Generar artículo
ai-logger article --topic "Mi experiencia con debugging"
ai-logger article --session abc123

# Ver sesiones
ai-logger sessions
ai-logger sessions --limit 20

# Ver detalle de una sesión
ai-logger session abc123

# Agregar nota manual
ai-logger log "Hoy aprendí sobre hooks de Claude Code"
```

### Ejemplos de Flujo de Trabajo

#### Diario Diario

Al final del día:

```bash
# Ver resumen rápido
ai-logger stats

# Generar diario
ai-logger diary

# El diario se guarda en ~/.ai-logger/diary/diary-YYYY-MM-DD.md
```

#### Crear un Artículo

Cuando quieras documentar una experiencia interesante:

```bash
# Ver tus sesiones recientes
ai-logger sessions

# Generar artículo basado en una sesión
ai-logger article --session abc123 --topic "Cómo debuggeé un memory leak"

# El artículo se guarda en ~/.ai-logger/articles/draft-*.md
# Edítalo y publícalo en tu blog
```

## Estructura de Archivos

```
~/.ai-logger/
├── config.json           # Configuración del logger
├── sessions-index.jsonl  # Índice de todas las sesiones
├── logs/
│   ├── interactions-YYYY-MM-DD.jsonl  # Interacciones por día
│   └── activity-YYYY-MM-DD.log        # Log legible por día
├── sessions/
│   ├── session-{id}.json  # Metadata de cada sesión
│   └── session-{id}.md    # Transcript de cada sesión
├── diary/
│   └── diary-YYYY-MM-DD.md  # Diarios generados
└── articles/
    └── draft-*.md           # Artículos generados
```

## Hooks Instalados

El plugin instala dos hooks en Claude Code:

### PostToolUse

Se ejecuta después de cada herramienta. Captura:
- Timestamp
- Herramienta usada
- Contexto (archivo, comando, búsqueda)
- Directorio de trabajo

### SessionEnd

Se ejecuta al terminar cada sesión. Captura:
- Resumen de la sesión
- Conteo de interacciones
- Herramientas usadas
- Transcript completo

## Configuración

### Variables de Entorno

```bash
# Cambiar directorio de datos
export AI_LOGGER_DIR=/path/to/custom/dir
```

### Configuración en ~/.ai-logger/config.json

```json
{
  "version": "1.0.0",
  "dataDir": "/home/user/.ai-logger",
  "hooksDir": "/home/user/.ai-logger/hooks"
}
```

## Integración con Blog

Los artículos generados pueden publicarse en tu blog:

```bash
# Generar artículo
ai-logger article --topic "Mi experiencia"

# Copiar al blog (ejemplo)
cp ~/.ai-logger/articles/draft-2024-01-15-*.md ../docs/posts/

# Convertir a HTML si es necesario
# (usa tu pipeline existente)
```

## Privacidad

- Los datos se almacenan **solo localmente**
- No se captura el contenido completo de las respuestas de Claude
- Solo se registran metadatos y resúmenes
- Puedes eliminar datos en cualquier momento:

```bash
rm -rf ~/.ai-logger/logs/*
```

## Desarrollo

```bash
# Clonar
git clone <repo>
cd ai-logger

# Instalar
npm install

# Probar localmente
node bin/ai-logger.js stats
```

## Próximas Funcionalidades

- [ ] Dashboard web con visualizaciones
- [ ] Categorización automática con LLM
- [ ] Exportación a múltiples formatos
- [ ] Sincronización con servicios externos
- [ ] Búsqueda avanzada en historial

## Licencia

MIT
