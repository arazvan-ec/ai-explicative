import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getDataDir, parseDate, readJsonLines, groupBy } from './utils.js';

/**
 * Obtiene estadísticas de uso de Claude Code
 */
export async function getStats(options) {
  const dataDir = getDataDir();
  const logsDir = path.join(dataDir, 'logs');

  // Determinar rango de fechas
  let dates = [];
  if (options.all) {
    // Todas las fechas disponibles
    const logFiles = fs.readdirSync(logsDir)
      .filter(f => f.startsWith('interactions-'))
      .map(f => f.replace('interactions-', '').replace('.jsonl', ''));
    dates = logFiles.map(d => new Date(d));
  } else if (options.month) {
    dates = getMonthDates();
  } else if (options.week) {
    dates = getWeekDates();
  } else {
    dates = [parseDate(options.date || 'today')];
  }

  // Recopilar todas las interacciones
  let allInteractions = [];

  for (const date of dates) {
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(logsDir, `interactions-${dateStr}.jsonl`);

    if (fs.existsSync(logFile)) {
      const interactions = readJsonLines(logFile);
      allInteractions.push(...interactions);
    }
  }

  if (allInteractions.length === 0) {
    return chalk.yellow('No hay datos para el período seleccionado.\n') +
           chalk.dim('Usa ai-logger install-hooks para comenzar a capturar interacciones.');
  }

  // Calcular estadísticas
  return formatStats(allInteractions, dates);
}

/**
 * Formatea las estadísticas para mostrar
 */
function formatStats(interactions, dates) {
  const byTool = groupBy(interactions, 'tool');
  const byProject = groupBy(interactions, i => {
    const parts = i.working_directory.split('/');
    return parts[parts.length - 1] || 'unknown';
  });

  const byDate = groupBy(interactions, i => i.timestamp.split('T')[0]);
  const bySesssion = groupBy(interactions, 'session_id');

  let output = '';

  // Resumen general
  output += chalk.bold('📈 Resumen General\n');
  output += `${'─'.repeat(40)}\n`;
  output += `Total interacciones:  ${chalk.cyan(interactions.length)}\n`;
  output += `Sesiones únicas:      ${chalk.cyan(Object.keys(bySesssion).length)}\n`;
  output += `Proyectos activos:    ${chalk.cyan(Object.keys(byProject).length)}\n`;
  output += `Días con actividad:   ${chalk.cyan(Object.keys(byDate).length)}\n`;
  output += '\n';

  // Por herramienta
  output += chalk.bold('🔧 Por Herramienta\n');
  output += `${'─'.repeat(40)}\n`;

  const sortedTools = Object.entries(byTool)
    .sort((a, b) => b[1].length - a[1].length);

  const maxToolLen = Math.max(...sortedTools.map(([t]) => t.length));

  for (const [tool, items] of sortedTools) {
    const pct = ((items.length / interactions.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.ceil(items.length / interactions.length * 20));
    output += `${tool.padEnd(maxToolLen)}  ${String(items.length).padStart(4)}  ${chalk.cyan(bar)} ${pct}%\n`;
  }
  output += '\n';

  // Por proyecto
  output += chalk.bold('📁 Por Proyecto\n');
  output += `${'─'.repeat(40)}\n`;

  const sortedProjects = Object.entries(byProject)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  for (const [project, items] of sortedProjects) {
    output += `${project.padEnd(20)}  ${chalk.cyan(items.length)} interacciones\n`;
  }
  output += '\n';

  // Actividad por día
  if (Object.keys(byDate).length > 1) {
    output += chalk.bold('📅 Actividad por Día\n');
    output += `${'─'.repeat(40)}\n`;

    const sortedDates = Object.entries(byDate)
      .sort((a, b) => a[0].localeCompare(b[0]));

    for (const [date, items] of sortedDates) {
      const bar = '▓'.repeat(Math.min(30, Math.ceil(items.length / 10)));
      output += `${date}  ${chalk.green(bar)} ${items.length}\n`;
    }
    output += '\n';
  }

  // Productividad
  output += chalk.bold('⚡ Métricas de Productividad\n');
  output += `${'─'.repeat(40)}\n`;

  const avgPerSession = (interactions.length / Object.keys(bySesssion).length).toFixed(1);
  const avgPerDay = (interactions.length / Object.keys(byDate).length).toFixed(1);

  const writeOps = (byTool['Write']?.length || 0) + (byTool['Edit']?.length || 0);
  const readOps = byTool['Read']?.length || 0;
  const searchOps = (byTool['Grep']?.length || 0) + (byTool['Glob']?.length || 0);

  output += `Promedio por sesión:  ${chalk.cyan(avgPerSession)} interacciones\n`;
  output += `Promedio por día:     ${chalk.cyan(avgPerDay)} interacciones\n`;
  output += `Ratio lectura/escritura: ${chalk.cyan((readOps / (writeOps || 1)).toFixed(2))}\n`;
  output += `Operaciones de búsqueda: ${chalk.cyan(searchOps)}\n`;

  return output;
}

/**
 * Obtiene las fechas de la última semana
 */
function getWeekDates() {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}

/**
 * Obtiene las fechas del último mes
 */
function getMonthDates() {
  const dates = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}
