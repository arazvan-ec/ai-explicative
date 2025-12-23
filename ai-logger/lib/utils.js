import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Obtiene el directorio de datos del logger
 */
export function getDataDir() {
  const envDir = process.env.AI_LOGGER_DIR;
  if (envDir) return envDir;

  const homeDir = os.homedir();
  return path.join(homeDir, '.ai-logger');
}

/**
 * Parsea una fecha desde string
 */
export function parseDate(dateStr) {
  if (dateStr === 'today') {
    return new Date();
  }
  if (dateStr === 'yesterday') {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  }
  return new Date(dateStr);
}

/**
 * Lee un archivo JSONL y devuelve array de objetos
 */
export function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n').filter(l => l.trim());

  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Agrupa un array por una clave
 */
export function groupBy(array, keyFn) {
  const keyFunc = typeof keyFn === 'string'
    ? (item) => item[keyFn]
    : keyFn;

  return array.reduce((groups, item) => {
    const key = keyFunc(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Formatea duración en minutos a string legible
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Trunca texto a un máximo de caracteres
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extrae el nombre del proyecto desde un path
 */
export function extractProjectName(workingDir) {
  if (!workingDir) return 'unknown';
  const parts = workingDir.split('/').filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
}

/**
 * Genera un ID único simple
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * Asegura que un directorio existe
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

/**
 * Lee un template de archivo
 */
export function readTemplate(templateName) {
  const templatePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    '../templates',
    templateName
  );

  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8');
  }

  return null;
}

/**
 * Categorías predefinidas para interacciones
 */
export const CATEGORIES = {
  debugging: ['fix', 'bug', 'error', 'issue', 'broken', 'not working', 'debug'],
  feature: ['add', 'implement', 'create', 'new feature', 'build', 'develop'],
  refactoring: ['refactor', 'improve', 'clean up', 'restructure', 'optimize', 'simplify'],
  testing: ['test', 'spec', 'coverage', 'mock', 'assert', 'unit test'],
  documentation: ['document', 'readme', 'comment', 'explain', 'docs', 'jsdoc'],
  exploration: ['search', 'find', 'look', 'where', 'what', 'how', 'understand'],
  devops: ['deploy', 'ci', 'cd', 'docker', 'build', 'pipeline'],
  security: ['security', 'auth', 'permission', 'encrypt', 'password', 'token']
};

/**
 * Intenta categorizar una interacción basándose en el contexto
 */
export function categorizeInteraction(interaction) {
  const context = (interaction.context || '').toLowerCase();
  const tool = interaction.tool;

  // Categorización por herramienta
  if (tool === 'Grep' || tool === 'Glob') return 'exploration';
  if (tool === 'Read') return 'exploration';

  // Categorización por contexto
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => context.includes(kw))) {
      return category;
    }
  }

  return 'general';
}
