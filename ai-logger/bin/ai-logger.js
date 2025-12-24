#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDiary } from '../lib/diary.js';
import { generateArticle } from '../lib/article.js';
import { getStats } from '../lib/stats.js';
import { installHooks } from '../lib/install-hooks.js';
import { listSessions, showSession } from '../lib/sessions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('ai-logger')
  .description('Plugin para Claude Code - Captura interacciones y genera resúmenes/artículos')
  .version('1.0.0');

// Comando: diary - Generar resumen diario
program
  .command('diary')
  .description('Genera un resumen/diario de tus interacciones con Claude Code')
  .option('-d, --date <date>', 'Fecha específica (YYYY-MM-DD)', 'today')
  .option('-w, --week', 'Resumen semanal')
  .option('-o, --output <path>', 'Ruta de salida para el diario')
  .option('--format <format>', 'Formato de salida (md|html)', 'md')
  .action(async (options) => {
    const spinner = ora('Generando diario...').start();
    try {
      const result = await generateDiary(options);
      spinner.succeed(chalk.green('Diario generado exitosamente'));
      console.log(chalk.cyan(`\nArchivo: ${result.path}`));
      console.log(chalk.dim('\nResumen:'));
      console.log(result.summary);
    } catch (error) {
      spinner.fail(chalk.red('Error generando diario'));
      console.error(error.message);
    }
  });

// Comando: article - Generar artículo
program
  .command('article')
  .description('Genera un artículo basado en tus experiencias')
  .option('-t, --topic <topic>', 'Tema del artículo')
  .option('-s, --session <id>', 'Basar en una sesión específica')
  .option('-d, --date <date>', 'Basar en fecha específica')
  .option('--interactive', 'Modo interactivo para seleccionar contenido')
  .option('-o, --output <path>', 'Ruta de salida')
  .action(async (options) => {
    const spinner = ora('Generando artículo...').start();
    try {
      const result = await generateArticle(options);
      spinner.succeed(chalk.green('Artículo generado exitosamente'));
      console.log(chalk.cyan(`\nArchivo: ${result.path}`));
      console.log(chalk.dim('\nVista previa:'));
      console.log(result.preview);
    } catch (error) {
      spinner.fail(chalk.red('Error generando artículo'));
      console.error(error.message);
    }
  });

// Comando: stats - Ver estadísticas
program
  .command('stats')
  .description('Muestra estadísticas de uso de Claude Code')
  .option('-d, --date <date>', 'Fecha específica')
  .option('-w, --week', 'Estadísticas semanales')
  .option('-m, --month', 'Estadísticas mensuales')
  .option('--all', 'Todas las estadísticas')
  .action(async (options) => {
    try {
      const stats = await getStats(options);
      console.log(chalk.bold.cyan('\n📊 Estadísticas de Claude Code\n'));
      console.log(stats);
    } catch (error) {
      console.error(chalk.red('Error obteniendo estadísticas:'), error.message);
    }
  });

// Comando: sessions - Listar sesiones
program
  .command('sessions')
  .description('Lista las sesiones registradas')
  .option('-n, --limit <number>', 'Número de sesiones a mostrar', '10')
  .option('-d, --date <date>', 'Filtrar por fecha')
  .action(async (options) => {
    try {
      const sessions = await listSessions(options);
      console.log(chalk.bold.cyan('\n📝 Sesiones de Claude Code\n'));
      console.log(sessions);
    } catch (error) {
      console.error(chalk.red('Error listando sesiones:'), error.message);
    }
  });

// Comando: session - Ver detalle de una sesión
program
  .command('session <id>')
  .description('Muestra el detalle de una sesión específica')
  .action(async (id) => {
    try {
      const session = await showSession(id);
      console.log(session);
    } catch (error) {
      console.error(chalk.red('Error mostrando sesión:'), error.message);
    }
  });

// Comando: install-hooks - Instalar hooks en Claude Code
program
  .command('install-hooks')
  .description('Instala los hooks de captura en Claude Code')
  .option('--global', 'Instalar globalmente en ~/.claude/')
  .option('--local', 'Instalar localmente en el proyecto')
  .action(async (options) => {
    const spinner = ora('Instalando hooks...').start();
    try {
      await installHooks(options);
      spinner.succeed(chalk.green('Hooks instalados exitosamente'));
      console.log(chalk.dim('\nLos hooks capturarán automáticamente tus interacciones con Claude Code.'));
    } catch (error) {
      spinner.fail(chalk.red('Error instalando hooks'));
      console.error(error.message);
    }
  });

// Comando: log - Agregar nota manual
program
  .command('log <message>')
  .description('Agrega una nota manual al registro')
  .option('-c, --category <category>', 'Categoría de la nota')
  .option('-t, --tags <tags>', 'Tags separados por coma')
  .action(async (message, options) => {
    try {
      const logPath = path.join(__dirname, '../data/logs/manual.jsonl');
      const entry = {
        timestamp: new Date().toISOString(),
        type: 'manual_note',
        message,
        category: options.category || 'general',
        tags: options.tags ? options.tags.split(',').map(t => t.trim()) : []
      };
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
      console.log(chalk.green('✓ Nota agregada'));
    } catch (error) {
      console.error(chalk.red('Error agregando nota:'), error.message);
    }
  });

program.parse();
