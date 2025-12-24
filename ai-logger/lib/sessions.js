import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getDataDir, readJsonLines, parseDate } from './utils.js';

/**
 * Lista las sesiones registradas
 */
export async function listSessions(options) {
  const dataDir = getDataDir();
  const indexFile = path.join(dataDir, 'sessions-index.jsonl');

  if (!fs.existsSync(indexFile)) {
    return chalk.yellow('No hay sesiones registradas aún.\n') +
           chalk.dim('Usa ai-logger install-hooks para comenzar a capturar.');
  }

  let sessions = readJsonLines(indexFile);

  // Filtrar por fecha si se especifica
  if (options.date) {
    const targetDate = parseDate(options.date).toISOString().split('T')[0];
    sessions = sessions.filter(s => s.end_time.startsWith(targetDate));
  }

  // Ordenar por fecha (más recientes primero)
  sessions.sort((a, b) => b.end_time.localeCompare(a.end_time));

  // Limitar
  const limit = parseInt(options.limit) || 10;
  sessions = sessions.slice(0, limit);

  if (sessions.length === 0) {
    return chalk.yellow('No hay sesiones para los criterios especificados.');
  }

  let output = '';

  output += `${chalk.dim('ID'.padEnd(12))} ${'Fecha'.padEnd(20)} ${'Proyecto'.padEnd(20)} ${'Interacciones'.padEnd(14)}\n`;
  output += `${'─'.repeat(70)}\n`;

  for (const session of sessions) {
    const id = session.session_id.substring(0, 10);
    const date = new Date(session.end_time).toLocaleString();
    const project = (session.project || 'unknown').substring(0, 18);
    const count = session.interactions_count || 0;

    output += `${chalk.cyan(id.padEnd(12))} ${date.padEnd(20)} ${project.padEnd(20)} ${String(count).padEnd(14)}\n`;
  }

  output += '\n';
  output += chalk.dim(`Mostrando ${sessions.length} sesiones. Usa --limit para ver más.\n`);
  output += chalk.dim(`Para ver detalle: ai-logger session <id>\n`);

  return output;
}

/**
 * Muestra el detalle de una sesión específica
 */
export async function showSession(sessionId) {
  const dataDir = getDataDir();
  const sessionsDir = path.join(dataDir, 'sessions');

  // Buscar la sesión (puede ser ID parcial)
  const sessionFiles = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.json') && f.includes(sessionId));

  if (sessionFiles.length === 0) {
    return chalk.red(`Sesión no encontrada: ${sessionId}`);
  }

  const sessionFile = path.join(sessionsDir, sessionFiles[0]);
  const session = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));

  let output = '';

  output += chalk.bold.cyan(`\n📋 Sesión: ${session.session_id}\n`);
  output += `${'═'.repeat(50)}\n\n`;

  output += chalk.bold('Información General\n');
  output += `${'─'.repeat(30)}\n`;
  output += `Proyecto:      ${chalk.cyan(session.project)}\n`;
  output += `Directorio:    ${session.working_directory}\n`;
  output += `Finalizada:    ${new Date(session.end_time).toLocaleString()}\n`;
  output += `Interacciones: ${chalk.cyan(session.interactions_count)}\n`;
  output += `Herramientas:  ${session.tools_summary || 'N/A'}\n`;
  output += '\n';

  // Ver si hay transcript
  const transcriptFile = path.join(sessionsDir, `session-${session.session_id}.md`);
  if (fs.existsSync(transcriptFile)) {
    output += chalk.bold('Transcript Disponible\n');
    output += `${'─'.repeat(30)}\n`;
    output += chalk.dim(`Archivo: ${transcriptFile}\n`);
    output += '\n';

    // Mostrar preview del transcript
    const transcript = fs.readFileSync(transcriptFile, 'utf-8');
    const lines = transcript.split('\n').slice(0, 20);
    output += chalk.dim('Preview (primeras 20 líneas):\n');
    output += chalk.dim('─'.repeat(30) + '\n');
    output += lines.join('\n');
    output += '\n...\n';
  }

  // Buscar interacciones de esta sesión
  const logsDir = path.join(dataDir, 'logs');
  if (fs.existsSync(logsDir)) {
    const logFiles = fs.readdirSync(logsDir).filter(f => f.startsWith('interactions-'));
    let sessionInteractions = [];

    for (const file of logFiles) {
      const logs = readJsonLines(path.join(logsDir, file));
      sessionInteractions.push(...logs.filter(l => l.session_id === session.session_id));
    }

    if (sessionInteractions.length > 0) {
      output += '\n';
      output += chalk.bold('Interacciones\n');
      output += `${'─'.repeat(30)}\n`;

      for (const interaction of sessionInteractions.slice(0, 15)) {
        const time = new Date(interaction.timestamp).toLocaleTimeString();
        output += `${chalk.dim(time)} ${chalk.yellow(interaction.tool.padEnd(10))} ${interaction.context || ''}\n`;
      }

      if (sessionInteractions.length > 15) {
        output += chalk.dim(`\n... y ${sessionInteractions.length - 15} más\n`);
      }
    }
  }

  return output;
}
