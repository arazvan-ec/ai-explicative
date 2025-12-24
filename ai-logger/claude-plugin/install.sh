#!/bin/bash
# Instalador del plugin AI Logger para Claude Code

set -e

echo "🔧 Instalando AI Logger Plugin para Claude Code..."
echo ""

# Directorio del plugin
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
DATA_DIR="$HOME/.ai-logger"

# Crear directorios
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$DATA_DIR"/{logs,diary,articles,notes,sessions}

echo "📁 Directorios creados"

# Copiar slash commands
echo "📝 Instalando slash commands..."
cp "$PLUGIN_DIR/commands/"*.md "$CLAUDE_DIR/commands/"
echo "   ✓ /diary - Genera diario de sesión"
echo "   ✓ /article - Genera artículo para blog"
echo "   ✓ /log - Guarda notas rápidas"
echo "   ✓ /stats - Muestra estadísticas"

# Instalar MCP server
echo ""
echo "🔌 Instalando MCP Server..."
cd "$PLUGIN_DIR/mcp-server"
npm install --silent

# Configurar MCP en Claude Code
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

if [ -f "$SETTINGS_FILE" ]; then
    # Hacer backup
    cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup"
fi

# Crear o actualizar settings.json con el MCP server
node -e "
const fs = require('fs');
const path = require('path');

const settingsFile = '$SETTINGS_FILE';
let settings = {};

if (fs.existsSync(settingsFile)) {
    try {
        settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    } catch (e) {}
}

if (!settings.mcpServers) {
    settings.mcpServers = {};
}

settings.mcpServers['ai-logger'] = {
    type: 'stdio',
    command: 'node',
    args: ['$PLUGIN_DIR/mcp-server/src/index.js'],
    env: {
        AI_LOGGER_DIR: '$DATA_DIR'
    }
};

fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
console.log('   ✓ MCP Server configurado');
"

# Instalar hooks
echo ""
echo "🪝 Instalando hooks..."
HOOKS_DIR="$DATA_DIR/hooks"
mkdir -p "$HOOKS_DIR"

# Copiar hooks desde el directorio padre
if [ -d "$PLUGIN_DIR/../hooks" ]; then
    cp "$PLUGIN_DIR/../hooks/"*.sh "$HOOKS_DIR/"
    chmod +x "$HOOKS_DIR/"*.sh

    # Agregar hooks a settings.json
    node -e "
const fs = require('fs');
const settingsFile = '$SETTINGS_FILE';
let settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));

if (!settings.hooks) {
    settings.hooks = {};
}

if (!settings.hooks.PostToolUse) {
    settings.hooks.PostToolUse = [];
}

if (!settings.hooks.SessionEnd) {
    settings.hooks.SessionEnd = [];
}

// Verificar si ya existe
const hasPostHook = settings.hooks.PostToolUse.some(h =>
    h.hooks?.some(hh => hh.command?.includes('post-tool-logger'))
);

if (!hasPostHook) {
    settings.hooks.PostToolUse.push({
        matcher: '*',
        hooks: [{
            type: 'command',
            command: '$HOOKS_DIR/post-tool-logger.sh'
        }]
    });
}

const hasSessionHook = settings.hooks.SessionEnd.some(h =>
    h.hooks?.some(hh => hh.command?.includes('session-end'))
);

if (!hasSessionHook) {
    settings.hooks.SessionEnd.push({
        matcher: '',
        hooks: [{
            type: 'command',
            command: '$HOOKS_DIR/session-end.sh'
        }]
    });
}

fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
console.log('   ✓ Hooks configurados');
"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ AI Logger Plugin instalado exitosamente!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📍 Ubicaciones:"
echo "   Commands:  $CLAUDE_DIR/commands/"
echo "   Datos:     $DATA_DIR/"
echo "   Settings:  $SETTINGS_FILE"
echo ""
echo "🚀 Comandos disponibles:"
echo "   /diary    - Genera diario de tu sesión"
echo "   /article  - Crea artículo para tu blog"
echo "   /log      - Guarda una nota rápida"
echo "   /stats    - Ve estadísticas de uso"
echo ""
echo "🔧 Herramientas MCP:"
echo "   save_interaction  - Guarda interacciones"
echo "   save_note         - Guarda notas"
echo "   get_stats         - Obtiene estadísticas"
echo "   get_logs          - Lee logs"
echo ""
echo "⚡ Reinicia Claude Code para activar los cambios."
echo ""
