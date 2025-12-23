import fs from 'fs';
import path from 'path';
import {
  getDataDir,
  parseDate,
  readJsonLines,
  groupBy,
  categorizeInteraction,
  ensureDir
} from './utils.js';

/**
 * Genera un artículo basado en las experiencias registradas
 */
export async function generateArticle(options) {
  const dataDir = getDataDir();
  const logsDir = path.join(dataDir, 'logs');
  const articlesDir = ensureDir(path.join(dataDir, 'articles'));
  const sessionsDir = path.join(dataDir, 'sessions');

  let interactions = [];
  let sessionData = null;

  // Si se especifica una sesión
  if (options.session) {
    const sessionFile = path.join(sessionsDir, `session-${options.session}.json`);
    const transcriptFile = path.join(sessionsDir, `session-${options.session}.md`);

    if (fs.existsSync(sessionFile)) {
      sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf-8'));
    }

    // Buscar interacciones de esa sesión
    const logFiles = fs.readdirSync(logsDir).filter(f => f.startsWith('interactions-'));
    for (const file of logFiles) {
      const logs = readJsonLines(path.join(logsDir, file));
      interactions.push(...logs.filter(l => l.session_id === options.session));
    }
  }
  // Si se especifica una fecha
  else if (options.date) {
    const date = parseDate(options.date);
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(logsDir, `interactions-${dateStr}.jsonl`);

    if (fs.existsSync(logFile)) {
      interactions = readJsonLines(logFile);
    }
  }
  // Si no hay filtros, usar los últimos datos disponibles
  else {
    const logFiles = fs.readdirSync(logsDir)
      .filter(f => f.startsWith('interactions-'))
      .sort()
      .reverse();

    if (logFiles.length > 0) {
      interactions = readJsonLines(path.join(logsDir, logFiles[0]));
    }
  }

  // Generar el contenido del artículo
  const articleContent = generateArticleContent(interactions, sessionData, options);

  // Nombre del archivo
  const timestamp = new Date().toISOString().split('T')[0];
  const topicSlug = (options.topic || 'mi-experiencia')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const outputFileName = `draft-${timestamp}-${topicSlug}.md`;
  const outputPath = options.output || path.join(articlesDir, outputFileName);

  fs.writeFileSync(outputPath, articleContent.content);

  return {
    path: outputPath,
    preview: articleContent.preview
  };
}

/**
 * Genera el contenido del artículo
 */
function generateArticleContent(interactions, sessionData, options) {
  const topic = options.topic || 'Mi Experiencia con Claude Code';
  const today = new Date().toISOString().split('T')[0];

  // Analizar interacciones
  const analysis = analyzeInteractions(interactions);

  // Generar frontmatter
  let content = `---
title: "${topic}"
date: ${today}
category: ${analysis.mainCategory}
tags: [${analysis.tags.join(', ')}]
draft: true
---

# ${topic}

`;

  // Introducción
  content += `## Introducción

Este artículo documenta mi experiencia trabajando con Claude Code en ${analysis.projectName}.
Durante esta sesión, realicé ${interactions.length} interacciones con la IA, enfocándome principalmente en ${analysis.mainCategory}.

`;

  // El contexto
  content += `## El Contexto

**Proyecto:** ${analysis.projectName}
**Objetivo:** _[Describe aquí el objetivo de la sesión]_

`;

  // Flujo de trabajo
  content += `## Mi Flujo de Trabajo

### Herramientas Utilizadas

| Herramienta | Veces | Para qué |
|-------------|-------|----------|
`;

  for (const [tool, items] of Object.entries(analysis.toolUsage)) {
    const purpose = getToolPurpose(tool);
    content += `| ${tool} | ${items.length} | ${purpose} |\n`;
  }

  content += '\n';

  // Ejemplos de prompts
  if (analysis.interestingContexts.length > 0) {
    content += `### Ejemplos de lo que Pedí

`;
    for (const ctx of analysis.interestingContexts.slice(0, 5)) {
      content += `- ${ctx}\n`;
    }
    content += '\n';
  }

  // Archivos modificados
  if (analysis.filesModified.length > 0) {
    content += `### Archivos Trabajados

\`\`\`
${analysis.filesModified.slice(0, 10).join('\n')}
\`\`\`

`;
  }

  // Sección de aprendizajes
  content += `## Lo Que Aprendí

### ¿Qué Funcionó Bien?

_[Escribe aquí lo que funcionó]_

-

### ¿Qué No Funcionó?

_[Escribe aquí los desafíos]_

-

### Tips para Otros

_[Consejos basados en tu experiencia]_

1.
2.
3.

`;

  // Código destacado
  content += `## Código Destacado

_[Agrega aquí snippets de código relevantes]_

\`\`\`javascript
// Ejemplo de código
\`\`\`

`;

  // Conclusión
  content += `## Conclusión

_[Escribe tus conclusiones finales]_

`;

  // Recursos
  content += `## Recursos Relacionados

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- _[Agregar más recursos relevantes]_

---

*Artículo generado con ai-logger el ${new Date().toISOString()}*
*Basado en ${interactions.length} interacciones*
`;

  const preview = `📝 Artículo: "${topic}" | ${interactions.length} interacciones | Categoría: ${analysis.mainCategory}`;

  return { content, preview };
}

/**
 * Analiza las interacciones para extraer información útil
 */
function analyzeInteractions(interactions) {
  const toolUsage = groupBy(interactions, 'tool');

  // Extraer contextos interesantes
  const interestingContexts = interactions
    .filter(i => i.context && !i.context.startsWith('tool:'))
    .map(i => i.context)
    .filter((v, i, a) => a.indexOf(v) === i);  // Unique

  // Archivos modificados
  const filesModified = [...new Set(
    interactions
      .filter(i => ['Write', 'Edit', 'MultiEdit'].includes(i.tool))
      .map(i => i.input?.file_path)
      .filter(Boolean)
  )];

  // Categorizar
  const categories = interactions.map(i => categorizeInteraction(i));
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const mainCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

  // Proyecto
  const projectName = interactions[0]?.working_directory
    ? interactions[0].working_directory.split('/').pop()
    : 'mi-proyecto';

  // Tags
  const tags = [
    mainCategory,
    ...Object.keys(toolUsage).slice(0, 3).map(t => t.toLowerCase()),
    'claude-code',
    'ia'
  ].filter((v, i, a) => a.indexOf(v) === i);

  return {
    toolUsage,
    interestingContexts,
    filesModified,
    mainCategory,
    projectName,
    tags
  };
}

/**
 * Descripción de para qué se usa cada herramienta
 */
function getToolPurpose(tool) {
  const purposes = {
    Read: 'Leer y entender código',
    Write: 'Crear nuevos archivos',
    Edit: 'Modificar código existente',
    MultiEdit: 'Múltiples ediciones',
    Bash: 'Ejecutar comandos',
    Grep: 'Buscar en código',
    Glob: 'Encontrar archivos',
    Task: 'Tareas complejas',
    WebFetch: 'Consultar documentación',
    WebSearch: 'Buscar información'
  };
  return purposes[tool] || 'Operaciones varias';
}
