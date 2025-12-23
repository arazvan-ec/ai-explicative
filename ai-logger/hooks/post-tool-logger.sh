#!/bin/bash
# Hook PostToolUse - Captura cada uso de herramienta en Claude Code
# Este hook se ejecuta DESPUÉS de cada herramienta

# Configuración
LOG_DIR="${AI_LOGGER_DIR:-$HOME/.ai-logger}/logs"
mkdir -p "$LOG_DIR"

# Leer entrada JSON del hook
input=$(cat)

# Extraer información
session_id=$(echo "$input" | jq -r '.session_id // "unknown"')
tool_name=$(echo "$input" | jq -r '.tool_name // "unknown"')
tool_input=$(echo "$input" | jq -c '.tool_input // {}')
tool_response=$(echo "$input" | jq -c '.tool_response // {}')
cwd=$(echo "$input" | jq -r '.cwd // "unknown"')
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
date_str=$(date +"%Y-%m-%d")

# Extraer información útil según el tipo de herramienta
case "$tool_name" in
  "Read"|"Write"|"Edit"|"MultiEdit")
    file_path=$(echo "$tool_input" | jq -r '.file_path // .path // "unknown"')
    context="file:$file_path"
    ;;
  "Bash")
    command=$(echo "$tool_input" | jq -r '.command // "unknown"' | head -c 200)
    context="cmd:$command"
    ;;
  "Grep"|"Glob")
    pattern=$(echo "$tool_input" | jq -r '.pattern // "unknown"')
    context="search:$pattern"
    ;;
  "Task")
    description=$(echo "$tool_input" | jq -r '.description // "unknown"')
    context="task:$description"
    ;;
  *)
    context="tool:$tool_name"
    ;;
esac

# Crear registro estructurado
log_entry=$(jq -n \
  --arg ts "$timestamp" \
  --arg sid "$session_id" \
  --arg tool "$tool_name" \
  --arg ctx "$context" \
  --arg cwd "$cwd" \
  --argjson input "$tool_input" \
  '{
    timestamp: $ts,
    session_id: $sid,
    tool: $tool,
    context: $ctx,
    working_directory: $cwd,
    input: $input
  }')

# Guardar en archivo de log diario (JSONL)
echo "$log_entry" >> "$LOG_DIR/interactions-$date_str.jsonl"

# Guardar resumen en log legible
echo "[${timestamp}] ${tool_name}: ${context}" >> "$LOG_DIR/activity-$date_str.log"

exit 0
