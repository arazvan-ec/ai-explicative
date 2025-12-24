#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import os from "os";

// Directorio de datos
const DATA_DIR = process.env.AI_LOGGER_DIR || path.join(os.homedir(), ".ai-logger");
const LOGS_DIR = path.join(DATA_DIR, "logs");
const DIARY_DIR = path.join(DATA_DIR, "diary");
const ARTICLES_DIR = path.join(DATA_DIR, "articles");
const NOTES_DIR = path.join(DATA_DIR, "notes");

// Asegurar que existen los directorios
[DATA_DIR, LOGS_DIR, DIARY_DIR, ARTICLES_DIR, NOTES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Crear el servidor MCP
const server = new Server(
  {
    name: "ai-logger",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Definir las herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "save_interaction",
        description: "Guarda una interacción o experiencia con IA en el log",
        inputSchema: {
          type: "object",
          properties: {
            tool: {
              type: "string",
              description: "Herramienta usada (Edit, Bash, Read, etc.)",
            },
            context: {
              type: "string",
              description: "Contexto de la interacción (archivo, comando, etc.)",
            },
            outcome: {
              type: "string",
              enum: ["success", "partial", "failed"],
              description: "Resultado de la interacción",
            },
            notes: {
              type: "string",
              description: "Notas adicionales sobre la interacción",
            },
          },
          required: ["tool", "context"],
        },
      },
      {
        name: "save_note",
        description: "Guarda una nota o reflexión personal",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Contenido de la nota",
            },
            category: {
              type: "string",
              description: "Categoría (learning, idea, tip, reflection)",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Tags para la nota",
            },
          },
          required: ["content"],
        },
      },
      {
        name: "get_stats",
        description: "Obtiene estadísticas de uso de Claude Code",
        inputSchema: {
          type: "object",
          properties: {
            period: {
              type: "string",
              enum: ["today", "week", "month", "all"],
              description: "Período de tiempo para las estadísticas",
            },
          },
        },
      },
      {
        name: "get_logs",
        description: "Obtiene los logs de interacciones",
        inputSchema: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Fecha en formato YYYY-MM-DD (default: hoy)",
            },
            limit: {
              type: "number",
              description: "Número máximo de entradas a devolver",
            },
          },
        },
      },
      {
        name: "list_diaries",
        description: "Lista los diarios generados",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Número máximo de diarios a listar",
            },
          },
        },
      },
      {
        name: "list_articles",
        description: "Lista los artículos generados",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Número máximo de artículos a listar",
            },
          },
        },
      },
    ],
  };
});

// Manejar llamadas a herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "save_interaction":
        return saveInteraction(args);

      case "save_note":
        return saveNote(args);

      case "get_stats":
        return getStats(args);

      case "get_logs":
        return getLogs(args);

      case "list_diaries":
        return listDiaries(args);

      case "list_articles":
        return listArticles(args);

      default:
        throw new Error(`Herramienta desconocida: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Implementación de herramientas

function saveInteraction(args) {
  const today = new Date().toISOString().split("T")[0];
  const logFile = path.join(LOGS_DIR, `interactions-${today}.jsonl`);

  const entry = {
    timestamp: new Date().toISOString(),
    tool: args.tool,
    context: args.context,
    outcome: args.outcome || "success",
    notes: args.notes || "",
    cwd: process.cwd(),
  };

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");

  return {
    content: [
      {
        type: "text",
        text: `✓ Interacción guardada: ${args.tool} - ${args.context}`,
      },
    ],
  };
}

function saveNote(args) {
  const today = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString();
  const notesFile = path.join(NOTES_DIR, `notes-${today}.md`);

  let content = "";
  if (!fs.existsSync(notesFile)) {
    content = `# Notas - ${today}\n\n`;
  }

  content += `## ${time}\n\n`;
  content += `${args.content}\n\n`;

  if (args.category) {
    content += `**Categoría:** ${args.category}\n`;
  }
  if (args.tags && args.tags.length > 0) {
    content += `**Tags:** ${args.tags.join(", ")}\n`;
  }
  content += "\n---\n\n";

  fs.appendFileSync(notesFile, content);

  return {
    content: [
      {
        type: "text",
        text: `✓ Nota guardada en ${notesFile}`,
      },
    ],
  };
}

function getStats(args) {
  const period = args?.period || "today";
  const dates = getDatesForPeriod(period);

  let allInteractions = [];

  for (const date of dates) {
    const logFile = path.join(LOGS_DIR, `interactions-${date}.jsonl`);
    if (fs.existsSync(logFile)) {
      const lines = fs.readFileSync(logFile, "utf-8").trim().split("\n");
      for (const line of lines) {
        try {
          allInteractions.push(JSON.parse(line));
        } catch (e) {}
      }
    }
  }

  // Calcular estadísticas
  const byTool = {};
  const byOutcome = { success: 0, partial: 0, failed: 0 };

  for (const interaction of allInteractions) {
    byTool[interaction.tool] = (byTool[interaction.tool] || 0) + 1;
    if (interaction.outcome) {
      byOutcome[interaction.outcome]++;
    }
  }

  const sortedTools = Object.entries(byTool)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  let statsText = `📊 Estadísticas (${period})\n`;
  statsText += `═══════════════════════════\n\n`;
  statsText += `Total interacciones: ${allInteractions.length}\n\n`;
  statsText += `🔧 Por herramienta:\n`;

  for (const [tool, count] of sortedTools) {
    const bar = "█".repeat(Math.min(20, Math.ceil((count / allInteractions.length) * 20)));
    statsText += `   ${tool.padEnd(12)} ${bar} ${count}\n`;
  }

  statsText += `\n📈 Resultados:\n`;
  statsText += `   ✓ Éxitos:   ${byOutcome.success}\n`;
  statsText += `   ◐ Parcial:  ${byOutcome.partial}\n`;
  statsText += `   ✗ Fallidos: ${byOutcome.failed}\n`;

  return {
    content: [
      {
        type: "text",
        text: statsText,
      },
    ],
  };
}

function getLogs(args) {
  const date = args?.date || new Date().toISOString().split("T")[0];
  const limit = args?.limit || 50;
  const logFile = path.join(LOGS_DIR, `interactions-${date}.jsonl`);

  if (!fs.existsSync(logFile)) {
    return {
      content: [
        {
          type: "text",
          text: `No hay logs para ${date}`,
        },
      ],
    };
  }

  const lines = fs.readFileSync(logFile, "utf-8").trim().split("\n");
  const interactions = lines
    .slice(-limit)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  let output = `📝 Logs de ${date} (${interactions.length} entradas)\n`;
  output += `─────────────────────────────────\n\n`;

  for (const i of interactions) {
    const time = new Date(i.timestamp).toLocaleTimeString();
    output += `[${time}] ${i.tool}: ${i.context}\n`;
  }

  return {
    content: [
      {
        type: "text",
        text: output,
      },
    ],
  };
}

function listDiaries(args) {
  const limit = args?.limit || 10;

  if (!fs.existsSync(DIARY_DIR)) {
    return {
      content: [{ type: "text", text: "No hay diarios aún" }],
    };
  }

  const files = fs
    .readdirSync(DIARY_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse()
    .slice(0, limit);

  let output = `📔 Diarios (${files.length})\n`;
  output += `─────────────────\n\n`;

  for (const file of files) {
    const filePath = path.join(DIARY_DIR, file);
    const stats = fs.statSync(filePath);
    output += `- ${file} (${formatBytes(stats.size)})\n`;
  }

  return {
    content: [{ type: "text", text: output }],
  };
}

function listArticles(args) {
  const limit = args?.limit || 10;

  if (!fs.existsSync(ARTICLES_DIR)) {
    return {
      content: [{ type: "text", text: "No hay artículos aún" }],
    };
  }

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse()
    .slice(0, limit);

  let output = `📄 Artículos (${files.length})\n`;
  output += `─────────────────\n\n`;

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const stats = fs.statSync(filePath);
    output += `- ${file} (${formatBytes(stats.size)})\n`;
  }

  return {
    content: [{ type: "text", text: output }],
  };
}

// Utilidades

function getDatesForPeriod(period) {
  const dates = [];
  const today = new Date();

  const daysMap = {
    today: 1,
    week: 7,
    month: 30,
    all: 365,
  };

  const days = daysMap[period] || 1;

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Iniciar el servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AI Logger MCP Server iniciado");
}

main().catch(console.error);
