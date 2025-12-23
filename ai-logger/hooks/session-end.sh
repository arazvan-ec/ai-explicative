#!/bin/bash
# Hook SessionEnd - Captura el resumen de cada sesión
# Se ejecuta cuando termina una sesión de Claude Code

# Configuración
DATA_DIR="${AI_LOGGER_DIR:-$HOME/.ai-logger}"
SESSIONS_DIR="$DATA_DIR/sessions"
LOG_DIR="$DATA_DIR/logs"
mkdir -p "$SESSIONS_DIR"

# Leer entrada JSON del hook
input=$(cat)

# Extraer información
session_id=$(echo "$input" | jq -r '.session_id // "unknown"')
transcript_path=$(echo "$input" | jq -r '.transcript_path // ""')
cwd=$(echo "$input" | jq -r '.cwd // "unknown"')
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
date_str=$(date +"%Y-%m-%d")

# Obtener nombre del proyecto desde el directorio
project_name=$(basename "$cwd")

# Contar interacciones de esta sesión
interactions_count=0
if [ -f "$LOG_DIR/interactions-$date_str.jsonl" ]; then
  interactions_count=$(grep -c "\"session_id\":\"$session_id\"" "$LOG_DIR/interactions-$date_str.jsonl" 2>/dev/null || echo "0")
fi

# Obtener herramientas usadas en esta sesión
tools_used=""
if [ -f "$LOG_DIR/interactions-$date_str.jsonl" ]; then
  tools_used=$(grep "\"session_id\":\"$session_id\"" "$LOG_DIR/interactions-$date_str.jsonl" | \
    jq -r '.tool' | sort | uniq -c | sort -rn | head -5 | \
    awk '{print $2"("$1")"}' | tr '\n' ', ' | sed 's/,$//')
fi

# Copiar transcript si existe
if [ -n "$transcript_path" ] && [ -f "$transcript_path" ]; then
  cp "$transcript_path" "$SESSIONS_DIR/session-$session_id.md"
fi

# Crear metadata de sesión
session_meta=$(jq -n \
  --arg sid "$session_id" \
  --arg ts "$timestamp" \
  --arg cwd "$cwd" \
  --arg project "$project_name" \
  --arg count "$interactions_count" \
  --arg tools "$tools_used" \
  '{
    session_id: $sid,
    end_time: $ts,
    working_directory: $cwd,
    project: $project,
    interactions_count: ($count | tonumber),
    tools_summary: $tools,
    has_transcript: true
  }')

echo "$session_meta" > "$SESSIONS_DIR/session-$session_id.json"

# Agregar al índice de sesiones
echo "$session_meta" >> "$DATA_DIR/sessions-index.jsonl"

# Log de actividad
echo "[${timestamp}] SESSION END: $session_id | Project: $project_name | Interactions: $interactions_count" >> "$LOG_DIR/activity-$date_str.log"

exit 0
