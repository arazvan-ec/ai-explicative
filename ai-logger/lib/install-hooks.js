import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Instala los hooks de captura en Claude Code
 */
export async function installHooks(options) {
  const homeDir = os.homedir();

  // Determinar ubicación de instalación
  const isGlobal = options.global || !options.local;
  const settingsDir = isGlobal
    ? path.join(homeDir, '.claude')
    : path.join(process.cwd(), '.claude');

  const hooksDir = isGlobal
    ? path.join(homeDir, '.ai-logger', 'hooks')
    : path.join(process.cwd(), '.ai-logger', 'hooks');

  const dataDir = isGlobal
    ? path.join(homeDir, '.ai-logger')
    : path.join(process.cwd(), '.ai-logger');

  // Crear directorios necesarios
  const dirs = [
    settingsDir,
    hooksDir,
    path.join(dataDir, 'logs'),
    path.join(dataDir, 'sessions'),
    path.join(dataDir, 'diary'),
    path.join(dataDir, 'articles')
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.dim(`Creado: ${dir}`));
    }
  }

  // Copiar hooks al directorio de destino
  const sourceHooksDir = path.join(__dirname, '../hooks');
  const hookFiles = ['post-tool-logger.sh', 'session-end.sh'];

  for (const hookFile of hookFiles) {
    const source = path.join(sourceHooksDir, hookFile);
    const dest = path.join(hooksDir, hookFile);

    if (fs.existsSync(source)) {
      let content = fs.readFileSync(source, 'utf-8');

      // Reemplazar el directorio de datos
      content = content.replace(
        /AI_LOGGER_DIR:-\$HOME\/\.ai-logger/g,
        `AI_LOGGER_DIR:-${dataDir}`
      );

      fs.writeFileSync(dest, content, { mode: 0o755 });
      console.log(chalk.green(`✓ Hook instalado: ${hookFile}`));
    }
  }

  // Configurar settings.json de Claude Code
  const settingsFile = path.join(settingsDir, 'settings.json');
  let settings = {};

  if (fs.existsSync(settingsFile)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
    } catch (e) {
      console.log(chalk.yellow('Advertencia: No se pudo leer settings.json existente'));
    }
  }

  // Configurar hooks
  if (!settings.hooks) {
    settings.hooks = {};
  }

  // Hook PostToolUse
  const postToolHook = {
    matcher: "*",
    hooks: [{
      type: "command",
      command: path.join(hooksDir, 'post-tool-logger.sh')
    }]
  };

  // Hook SessionEnd
  const sessionEndHook = {
    matcher: "",
    hooks: [{
      type: "command",
      command: path.join(hooksDir, 'session-end.sh')
    }]
  };

  // Agregar hooks sin duplicar
  if (!settings.hooks.PostToolUse) {
    settings.hooks.PostToolUse = [];
  }
  if (!settings.hooks.SessionEnd) {
    settings.hooks.SessionEnd = [];
  }

  // Verificar si ya existe el hook de ai-logger
  const hasPostToolHook = settings.hooks.PostToolUse.some(h =>
    h.hooks?.some(hh => hh.command?.includes('ai-logger') || hh.command?.includes('post-tool-logger'))
  );

  const hasSessionEndHook = settings.hooks.SessionEnd.some(h =>
    h.hooks?.some(hh => hh.command?.includes('ai-logger') || hh.command?.includes('session-end'))
  );

  if (!hasPostToolHook) {
    settings.hooks.PostToolUse.push(postToolHook);
  }

  if (!hasSessionEndHook) {
    settings.hooks.SessionEnd.push(sessionEndHook);
  }

  // Guardar settings
  fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
  console.log(chalk.green(`✓ Configuración guardada: ${settingsFile}`));

  // Resumen
  console.log('\n' + chalk.bold.cyan('Instalación completada'));
  console.log('─'.repeat(40));
  console.log(`Hooks:        ${hooksDir}`);
  console.log(`Datos:        ${dataDir}`);
  console.log(`Settings:     ${settingsFile}`);
  console.log('\n' + chalk.dim('Los hooks comenzarán a capturar en la próxima sesión de Claude Code.'));

  // Crear archivo de configuración del logger
  const loggerConfig = {
    version: '1.0.0',
    dataDir: dataDir,
    hooksDir: hooksDir,
    installedAt: new Date().toISOString(),
    location: isGlobal ? 'global' : 'local'
  };

  fs.writeFileSync(
    path.join(dataDir, 'config.json'),
    JSON.stringify(loggerConfig, null, 2)
  );
}
