# Plan: AI Experience Logger

## Resumen Ejecutivo

Sistema para documentar automáticamente experiencias con IA, capturando interacciones desde CLIs locales, categorizándolas y generando diarios/artículos para el blog.

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AI Experience Logger                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐  │
│  │   CAPTURA    │───▶│   STORAGE    │───▶│    PROCESAMIENTO         │  │
│  │              │    │              │    │                          │  │
│  │ • CLI Hooks  │    │ • SQLite     │    │ • Categorización (LLM)   │  │
│  │ • Wrappers   │    │ • JSON logs  │    │ • Resúmenes automáticos  │  │
│  │ • Plugins    │    │ • Markdown   │    │ • Generación de artículos│  │
│  └──────────────┘    └──────────────┘    └──────────────────────────┘  │
│                                                    │                     │
│                                                    ▼                     │
│                              ┌──────────────────────────────────────┐   │
│                              │          OUTPUT                      │   │
│                              │                                      │   │
│                              │ • Diario personal (.md)              │   │
│                              │ • Artículos para blog                │   │
│                              │ • Dashboard de estadísticas          │   │
│                              │ • Export a /docs/posts/              │   │
│                              └──────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes del Sistema

### 2.1 Plugin de Captura CLI (`ai-logger`)

Un CLI tool en Node.js que puede:

```bash
# Estructura propuesta
ai-logger/
├── bin/
│   └── ai-logger.js          # CLI principal
├── lib/
│   ├── capture/
│   │   ├── claude-code.js    # Hook para Claude Code
│   │   ├── copilot.js        # Hook para GitHub Copilot CLI
│   │   ├── aider.js          # Hook para Aider
│   │   └── generic.js        # Wrapper genérico
│   ├── storage/
│   │   ├── sqlite.js         # Persistencia en SQLite
│   │   ├── json.js           # Logs en JSON
│   │   └── markdown.js       # Notas en Markdown
│   ├── process/
│   │   ├── categorizer.js    # Categorización con LLM
│   │   ├── summarizer.js     # Resúmenes automáticos
│   │   └── tagger.js         # Etiquetado automático
│   └── output/
│       ├── diary.js          # Generador de diarios
│       ├── article.js        # Generador de artículos
│       └── stats.js          # Estadísticas y métricas
├── data/
│   ├── logs/                 # Logs crudos
│   ├── diary/                # Diarios generados
│   └── articles/             # Artículos draft
├── templates/
│   ├── diary-entry.md        # Template para diarios
│   └── article.md            # Template para artículos
└── package.json
```

### 2.2 Comandos CLI Propuestos

```bash
# Captura manual de una interacción
ai-logger log "Usé Claude para refactorizar componente X"
ai-logger log --tool claude --category refactoring --file src/App.jsx

# Iniciar sesión de captura automática
ai-logger start-session "Implementando feature Y"
ai-logger end-session --summary

# Wrapper para ejecutar comandos y capturar
ai-logger wrap "claude --code 'fix bug in auth'"
ai-logger wrap "gh copilot suggest 'test for user service'"

# Procesamiento
ai-logger categorize --date today     # Categorizar logs del día
ai-logger summarize --week            # Resumen semanal
ai-logger generate-diary --date today # Generar entrada de diario
ai-logger generate-article --topic "debugging patterns"

# Consultas
ai-logger search "authentication"     # Buscar en logs
ai-logger stats --month               # Estadísticas del mes
ai-logger export --format html        # Exportar a HTML
```

---

## 3. Modelo de Datos

### 3.1 Esquema de Interacción

```typescript
interface AIInteraction {
  id: string;                    // UUID único
  timestamp: Date;               // Cuándo ocurrió

  // Contexto
  tool: string;                  // 'claude-code' | 'copilot' | 'aider' | 'chatgpt'
  session_id: string;            // Agrupa interacciones de una sesión
  project: string;               // Proyecto donde se usó

  // Contenido
  prompt: string;                // Lo que preguntaste/pediste
  response_summary: string;      // Resumen de la respuesta
  files_affected: string[];      // Archivos modificados

  // Categorización (automática o manual)
  category: Category;
  tags: string[];
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex';
  outcome: 'success' | 'partial' | 'failed' | 'learning';

  // Metadatos
  duration_seconds: number;      // Tiempo de la interacción
  tokens_used?: number;          // Si está disponible
  model?: string;                // Modelo usado

  // Reflexión personal (manual)
  notes?: string;                // Notas personales
  learnings?: string[];          // Aprendizajes clave
  would_do_different?: string;   // Qué harías diferente
}

type Category =
  | 'debugging'           // Encontrar y arreglar bugs
  | 'feature'             // Implementar nueva funcionalidad
  | 'refactoring'         // Mejorar código existente
  | 'learning'            // Aprender conceptos nuevos
  | 'documentation'       // Escribir docs
  | 'testing'             // Crear o arreglar tests
  | 'architecture'        // Decisiones de arquitectura
  | 'performance'         // Optimización
  | 'security'            // Temas de seguridad
  | 'devops'              // CI/CD, deployment
  | 'exploration';        // Explorar codebase
```

### 3.2 Esquema de Sesión

```typescript
interface AISession {
  id: string;
  title: string;
  started_at: Date;
  ended_at?: Date;

  goal: string;                  // Objetivo de la sesión
  outcome: string;               // Resultado final

  interactions: AIInteraction[];

  // Estadísticas
  total_interactions: number;
  successful_interactions: number;
  total_duration_minutes: number;

  // Reflexión
  session_summary?: string;
  key_learnings?: string[];
  productivity_rating?: 1 | 2 | 3 | 4 | 5;
}
```

---

## 4. Sistema de Categorización

### 4.1 Categorización Automática con LLM

```javascript
// Prompt para categorización automática
const categorizationPrompt = `
Analiza esta interacción con IA y categorízala:

Prompt del usuario: {prompt}
Herramienta: {tool}
Archivos afectados: {files}

Devuelve JSON con:
- category: una de [debugging, feature, refactoring, learning, documentation, testing, architecture, performance, security, devops, exploration]
- tags: array de 3-5 tags relevantes
- difficulty: trivial | easy | medium | hard | complex
- summary: resumen de 1 línea
`;
```

### 4.2 Reglas de Categorización Heurística

```javascript
const heuristicRules = {
  debugging: ['fix', 'bug', 'error', 'issue', 'broken', 'not working'],
  feature: ['add', 'implement', 'create', 'new feature', 'build'],
  refactoring: ['refactor', 'improve', 'clean up', 'restructure', 'optimize'],
  testing: ['test', 'spec', 'coverage', 'mock', 'assert'],
  documentation: ['document', 'readme', 'comment', 'explain', 'docs'],
  // ...etc
};
```

---

## 5. Generación de Contenido

### 5.1 Diario Diario (Automático)

Template: `templates/diary-entry.md`

```markdown
# Diario IA - {fecha}

## Resumen del día
{resumen_generado}

## Sesiones
{por_cada_sesion}
### {hora} - {titulo_sesion}
- **Objetivo:** {goal}
- **Resultado:** {outcome}
- **Interacciones:** {count}
- **Tiempo total:** {duration}

#### Highlights
{interacciones_destacadas}

#### Aprendizajes
{learnings}
{/por_cada_sesion}

## Estadísticas del día
- Total interacciones: {total}
- Categoría más frecuente: {top_category}
- Herramienta más usada: {top_tool}
- Tasa de éxito: {success_rate}%

## Reflexión
{reflexion_manual_o_generada}
```

### 5.2 Artículo para Blog

Template: `templates/article.md`

```markdown
---
title: "{titulo}"
date: {fecha}
category: {categoria}
tags: [{tags}]
based_on: {session_ids}
---

# {titulo}

{introduccion_generada}

## El Problema
{contexto_del_problema}

## Mi Enfoque con IA
{descripcion_del_proceso}

### Prompts que Funcionaron
```
{ejemplos_de_prompts_exitosos}
```

### Lo que Aprendí
{learnings_consolidados}

## Código Resultante
{codigo_relevante}

## Conclusiones
{conclusiones}

## Tips para Ti
{consejos_practicos}
```

---

## 6. Integración con el Blog Existente

### 6.1 Pipeline de Publicación

```
ai-logger/data/articles/draft-*.md
         │
         ▼
    [Revisión manual]
         │
         ▼
    docs/posts/articulo.html (convertido)
         │
         ▼
    viewer/src/articles/ (si se quiere React)
         │
         ▼
    GitHub Actions → Deploy
```

### 6.2 Comandos de Publicación

```bash
# Generar draft de artículo
ai-logger generate-article --topic "Mi experiencia con Claude Code"

# Revisar y editar draft
ai-logger edit-draft draft-2024-01-15-claude-code.md

# Publicar (mover a docs/posts/)
ai-logger publish draft-2024-01-15-claude-code.md

# Generar página de blog actualizada
ai-logger rebuild-blog
```

---

## 7. Fases de Implementación

### Fase 1: Core Logger (MVP)
- [ ] Estructura del proyecto `ai-logger/`
- [ ] CLI básico con comandos `log`, `list`, `search`
- [ ] Storage en JSON local
- [ ] Logging manual de interacciones

### Fase 2: Captura Automática
- [ ] Hook para Claude Code (usando hooks de Claude Code)
- [ ] Wrapper para otros CLIs
- [ ] Gestión de sesiones (`start-session`, `end-session`)

### Fase 3: Categorización
- [ ] Reglas heurísticas básicas
- [ ] Integración con API de Claude para categorización automática
- [ ] Sistema de tags

### Fase 4: Generación de Contenido
- [ ] Template de diario diario
- [ ] Comando `generate-diary`
- [ ] Template de artículo
- [ ] Comando `generate-article`

### Fase 5: Integración Blog
- [ ] Pipeline de publicación
- [ ] Conversión Markdown → HTML
- [ ] Actualización automática del índice del blog

### Fase 6: Dashboard y Estadísticas
- [ ] Comando `stats`
- [ ] Visualización de métricas
- [ ] Exportación de reportes

---

## 8. Stack Tecnológico Propuesto

| Componente | Tecnología | Razón |
|------------|------------|-------|
| CLI | Node.js + Commander.js | Familiar, mismo stack que el proyecto |
| Storage | SQLite + better-sqlite3 | Ligero, sin servidor, consultas SQL |
| Templates | Handlebars/EJS | Simple, flexible |
| LLM Integration | Anthropic SDK | Para categorización y generación |
| Markdown Parser | marked + gray-matter | Para frontmatter y conversión |
| Config | cosmiconfig | Estándar para configs de CLI |

---

## 9. Configuración

### 9.1 Archivo de Configuración

`~/.ai-logger/config.json` o `.ai-loggerrc`

```json
{
  "storage": {
    "type": "sqlite",
    "path": "~/.ai-logger/data.db"
  },
  "output": {
    "diary_path": "./diary/",
    "articles_path": "./articles/",
    "blog_path": "../docs/posts/"
  },
  "categorization": {
    "use_llm": true,
    "llm_provider": "anthropic",
    "fallback_to_heuristics": true
  },
  "capture": {
    "auto_capture_claude_code": true,
    "capture_prompts": true,
    "capture_responses": false,  // Privacidad
    "capture_files": true
  },
  "templates": {
    "diary": "./templates/diary.md",
    "article": "./templates/article.md"
  }
}
```

---

## 10. Próximos Pasos Inmediatos

1. **Crear estructura base del proyecto** `ai-logger/`
2. **Implementar CLI mínimo** con `log` y `list`
3. **Crear storage JSON básico**
4. **Probar con algunas interacciones manuales**
5. **Iterar y expandir**

---

## Preguntas para Definir

1. **¿Quieres que el logger sea un paquete npm separado o parte de este repo?**
2. **¿Prefieres SQLite para queries complejos o JSON para simplicidad?**
3. **¿Capturar respuestas completas de la IA o solo resúmenes (privacidad)?**
4. **¿Qué CLIs de IA usas actualmente?** (Claude Code, Copilot, Aider, otros)
5. **¿Quieres un hook automático para Claude Code o empezar con logging manual?**

---

*Plan creado: 2024-12-23*
*Proyecto: ai-explicative*
