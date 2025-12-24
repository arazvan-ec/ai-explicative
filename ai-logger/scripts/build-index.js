#!/usr/bin/env bun
/**
 * Script para generar el índice de datos del AI Logger
 * Ejecutar con: bun run ai-logger/scripts/build-index.js
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const DATA_DIR = join(import.meta.dir, '../data')

async function getFiles(dir) {
  try {
    const files = await readdir(join(DATA_DIR, dir))
    return files.filter(f => f.endsWith('.md') && !f.startsWith('.'))
  } catch {
    return []
  }
}

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1] : 'Sin título'
}

function extractPreview(content) {
  // Buscar el primer párrafo después del título
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      return trimmed.substring(0, 200)
    }
  }
  return ''
}

function extractDate(filename) {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : new Date().toISOString().split('T')[0]
}

async function buildIndex() {
  console.log('🔍 Escaneando directorios...')

  const index = {
    diaries: [],
    articles: [],
    notes: [],
    lastUpdated: new Date().toISOString()
  }

  // Procesar diarios
  const diaryFiles = await getFiles('diary')
  for (const file of diaryFiles) {
    const content = await readFile(join(DATA_DIR, 'diary', file), 'utf-8')
    index.diaries.push({
      id: file.replace('.md', ''),
      title: extractTitle(content),
      date: extractDate(file),
      file,
      preview: extractPreview(content)
    })
  }
  console.log(`📔 ${index.diaries.length} diarios encontrados`)

  // Procesar artículos
  const articleFiles = await getFiles('articles')
  for (const file of articleFiles) {
    const content = await readFile(join(DATA_DIR, 'articles', file), 'utf-8')
    index.articles.push({
      id: file.replace('.md', ''),
      title: extractTitle(content),
      date: extractDate(file),
      file,
      preview: extractPreview(content)
    })
  }
  console.log(`📝 ${index.articles.length} artículos encontrados`)

  // Procesar notas
  const noteFiles = await getFiles('notes')
  for (const file of noteFiles) {
    const content = await readFile(join(DATA_DIR, 'notes', file), 'utf-8')
    index.notes.push({
      id: file.replace('.md', ''),
      title: extractTitle(content),
      date: extractDate(file),
      file,
      preview: extractPreview(content)
    })
  }
  console.log(`📌 ${index.notes.length} notas encontradas`)

  // Ordenar por fecha (más reciente primero)
  index.diaries.sort((a, b) => b.date.localeCompare(a.date))
  index.articles.sort((a, b) => b.date.localeCompare(a.date))
  index.notes.sort((a, b) => b.date.localeCompare(a.date))

  // Guardar índice
  const indexPath = join(DATA_DIR, 'index.json')
  await writeFile(indexPath, JSON.stringify(index, null, 2))
  console.log(`\n✅ Índice generado: ${indexPath}`)
  console.log(`   Total: ${index.diaries.length + index.articles.length + index.notes.length} entradas`)
}

buildIndex().catch(console.error)
