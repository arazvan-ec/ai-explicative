import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDataDir, parseDate, readJsonLines, groupBy } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera un diario/resumen de las interacciones con Claude Code
 */
export async function generateDiary(options) {
  const dataDir = getDataDir();
  const logsDir = path.join(dataDir, 'logs');
  const diaryDir = path.join(dataDir, 'diary');
  const sessionsDir = path.join(dataDir, 'sessions');

  // Crear directorio de diarios si no existe
  if (!fs.existsSync(diaryDir)) {
    fs.mkdirSync(diaryDir, { recursive: true });
  }

  // Determinar fecha(s) a procesar
  const dates = options.week
    ? getLastWeekDates()
    : [parseDate(options.date)];

  // Recopilar todas las interacciones
  let allInteractions = [];
  let allSessions = [];

  for (const date of dates) {
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(logsDir, `interactions-${dateStr}.jsonl`);

    if (fs.existsSync(logFile)) {
      const interactions = readJsonLines(logFile);
      allInteractions.push(...interactions);
    }
  }

  // Leer sesiones del índice
  const sessionsIndex = path.join(dataDir, 'sessions-index.jsonl');
  if (fs.existsSync(sessionsIndex)) {
    const sessions = readJsonLines(sessionsIndex);
    // Filtrar por fechas
    allSessions = sessions.filter(s => {
      const sessionDate = s.end_time.split('T')[0];
      return dates.some(d => d.toISOString().split('T')[0] === sessionDate);
    });
  }

  // Generar contenido del diario
  const diaryContent = generateDiaryContent(allInteractions, allSessions, dates, options);

  // Determinar nombre del archivo
  const outputFileName = options.week
    ? `diary-week-${dates[0].toISOString().split('T')[0]}.md`
    : `diary-${dates[0].toISOString().split('T')[0]}.md`;

  const outputPath = options.output || path.join(diaryDir, outputFileName);

  // Escribir archivo
  fs.writeFileSync(outputPath, diaryContent.content);

  return {
    path: outputPath,
    summary: diaryContent.summary,
    stats: diaryContent.stats
  };
}

/**
 * Genera el contenido del diario en Markdown
 */
function generateDiaryContent(interactions, sessions, dates, options) {
  const isWeek = options.week;
  const dateRange = isWeek
    ? `${dates[0].toISOString().split('T')[0]} al ${dates[dates.length-1].toISOString().split('T')[0]}`
    : dates[0].toISOString().split('T')[0];

  // Estadísticas
  const stats = calculateStats(interactions, sessions);

  // Agrupar por herramienta
  const byTool = groupBy(interactions, 'tool');

  // Agrupar por proyecto
  const byProject = groupBy(interactions, i => {
    const parts = i.working_directory.split('/');
    return parts[parts.length - 1] || 'unknown';
  });

  // Generar Markdown
  let content = `# Diario de IA - ${dateRange}\n\n`;

  content += `## Resumen\n\n`;
  content += `- **Total de interacciones:** ${stats.totalInteractions}\n`;
  content += `- **Sesiones:** ${stats.totalSessions}\n`;
  content += `- **Herramienta más usada:** ${stats.topTool}\n`;
  content += `- **Proyecto más activo:** ${stats.topProject}\n\n`;

  // Actividad por herramienta
  content += `## Actividad por Herramienta\n\n`;
  content += `| Herramienta | Usos | % |\n`;
  content += `|-------------|------|---|\n`;

  const sortedTools = Object.entries(byTool)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [tool, items] of sortedTools) {
    const pct = ((items.length / stats.totalInteractions) * 100).toFixed(1);
    content += `| ${tool} | ${items.length} | ${pct}% |\n`;
  }
  content += '\n';

  // Sesiones del día
  if (sessions.length > 0) {
    content += `## Sesiones\n\n`;

    for (const session of sessions) {
      content += `### ${session.project} (${session.session_id.substring(0, 8)})\n\n`;
      content += `- **Hora:** ${new Date(session.end_time).toLocaleTimeString()}\n`;
      content += `- **Interacciones:** ${session.interactions_count}\n`;
      content += `- **Herramientas:** ${session.tools_summary || 'N/A'}\n\n`;
    }
  }

  // Archivos modificados
  const fileOperations = interactions.filter(i =>
    ['Write', 'Edit', 'MultiEdit'].includes(i.tool)
  );

  if (fileOperations.length > 0) {
    content += `## Archivos Modificados\n\n`;
    const files = [...new Set(fileOperations.map(i => i.input?.file_path).filter(Boolean))];
    files.forEach(f => {
      content += `- \`${f}\`\n`;
    });
    content += '\n';
  }

  // Comandos ejecutados
  const bashOps = interactions.filter(i => i.tool === 'Bash');
  if (bashOps.length > 0) {
    content += `## Comandos Ejecutados\n\n`;
    const uniqueCmds = [...new Set(bashOps.map(i => i.input?.command).filter(Boolean))];
    content += '```bash\n';
    uniqueCmds.slice(0, 20).forEach(cmd => {
      content += `${cmd.substring(0, 100)}${cmd.length > 100 ? '...' : ''}\n`;
    });
    content += '```\n\n';
  }

  // Reflexión (placeholder para agregar manualmente)
  content += `## Reflexión del Día\n\n`;
  content += `> _Agrega aquí tus reflexiones sobre el uso de IA hoy..._\n\n`;
  content += `### ¿Qué funcionó bien?\n\n- \n\n`;
  content += `### ¿Qué podría mejorar?\n\n- \n\n`;
  content += `### Aprendizajes clave\n\n- \n\n`;

  // Pie de página
  content += `---\n`;
  content += `*Generado automáticamente por ai-logger el ${new Date().toISOString()}*\n`;

  const summary = `📊 ${stats.totalInteractions} interacciones | ${stats.totalSessions} sesiones | Top: ${stats.topTool}`;

  return { content, summary, stats };
}

/**
 * Calcula estadísticas de las interacciones
 */
function calculateStats(interactions, sessions) {
  const byTool = groupBy(interactions, 'tool');
  const byProject = groupBy(interactions, i => {
    const parts = i.working_directory.split('/');
    return parts[parts.length - 1] || 'unknown';
  });

  const topTool = Object.entries(byTool)
    .sort((a, b) => b[1].length - a[1].length)[0];

  const topProject = Object.entries(byProject)
    .sort((a, b) => b[1].length - a[1].length)[0];

  return {
    totalInteractions: interactions.length,
    totalSessions: sessions.length,
    topTool: topTool ? `${topTool[0]} (${topTool[1].length})` : 'N/A',
    topProject: topProject ? `${topProject[0]} (${topProject[1].length})` : 'N/A',
    toolBreakdown: byTool,
    projectBreakdown: byProject
  };
}

/**
 * Obtiene las fechas de la última semana
 */
function getLastWeekDates() {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}
