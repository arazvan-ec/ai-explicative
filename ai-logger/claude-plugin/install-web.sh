#!/bin/bash
# Instalador de AI Logger para Claude Code Web
# Solo instala los slash commands (compatible con web)

set -e

echo "🌐 Instalando AI Logger para Claude Code Web..."
echo ""

# Directorio del plugin
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
DATA_DIR="$HOME/.ai-logger"

# Crear directorios
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$DATA_DIR"/{diary,articles,notes,logs,sessions}

echo "📁 Directorios creados"

# Copiar solo los slash commands
echo ""
echo "📝 Instalando slash commands..."
cp "$PLUGIN_DIR/commands/"*.md "$CLAUDE_DIR/commands/"

echo "   ✓ /setup   - Configura el entorno (ejecutar al inicio)"
echo "   ✓ /diary   - Genera diario de sesión"
echo "   ✓ /article - Genera artículo para blog"
echo "   ✓ /log     - Guarda notas rápidas"
echo "   ✓ /stats   - Muestra estadísticas"

echo ""
echo "═══════════════════════════════════════════════════"
echo "✅ AI Logger Web instalado exitosamente!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "📍 Ubicaciones:"
echo "   Commands: $CLAUDE_DIR/commands/"
echo "   Datos:    $DATA_DIR/"
echo ""
echo "🚀 En Claude Code Web:"
echo ""
echo "   1. Al iniciar sesión: /setup"
echo "   2. Durante el trabajo: /log \"Mi nota\""
echo "   3. Al terminar:        /diary"
echo "   4. Para blog:          /article mi-tema"
echo ""
echo "⚠️  Nota: En la web, MCP servers no funcionan."
echo "    Los slash commands usan herramientas nativas."
echo ""
