---
title: "Cómo Construir un Sistema de Agentes con Spec Driven Development"
date: 2025-12-24
category: architecture
tags: [agentes, spec-driven-development, ia, arquitectura, cms, claude-code]
draft: false
---

# Cómo Construir un Sistema de Agentes con Spec Driven Development

## Introducción

Los agentes de IA son el siguiente nivel después de los chatbots. Un agente no solo responde preguntas: **ejecuta tareas complejas de forma autónoma**.

Pero construir agentes sin metodología es receta para el desastre. La IA alucina, pierde contexto, y hace cosas inesperadas.

La solución: **Spec Driven Development (SDD)** — definir especificaciones claras antes de que el agente ejecute cualquier cosa.

En este artículo te muestro cómo construir un sistema de agentes potente usando un caso real: **crear y publicar un artículo en un CMS**.

## ¿Qué es Spec Driven Development?

Spec Driven Development significa:

> **Primero la especificación, después la ejecución.**

En lugar de decirle al agente "crea un artículo sobre X", le das:

1. **Especificación clara** de qué debe hacer
2. **Criterios de aceptación** verificables
3. **Restricciones** que no puede violar
4. **Plan de ejecución** paso a paso

El agente sigue la spec, no improvisa.

### Analogía

Imagina contratar un constructor:

❌ **Sin spec:** "Hazme una casa bonita"
✅ **Con spec:** "Casa de 2 pisos, 3 habitaciones, 2 baños, estilo moderno, presupuesto X, en 6 meses"

La diferencia entre caos y resultados predecibles.

## Arquitectura de un Sistema de Agentes

Un sistema de agentes potente tiene estas capas:

```
┌─────────────────────────────────────────────────────────┐
│                    ORQUESTADOR                          │
│         (Decide qué agente usar y cuándo)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   AGENTE    │  │   AGENTE    │  │   AGENTE    │     │
│  │  PLANIFICADOR│ │  ESCRITOR   │  │  REVISOR    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    HERRAMIENTAS                         │
│    (APIs, Base de datos, Sistema de archivos)           │
├─────────────────────────────────────────────────────────┤
│                      SPECS                              │
│         (Especificaciones y restricciones)              │
└─────────────────────────────────────────────────────────┘
```

### Componentes Clave

| Componente | Responsabilidad |
|------------|-----------------|
| **Orquestador** | Coordina agentes, maneja el flujo |
| **Agentes especializados** | Cada uno hace una cosa bien |
| **Herramientas** | Acciones concretas (API calls, DB queries) |
| **Specs** | Definen qué hacer y qué no hacer |

## Caso de Uso: Crear Artículo en un CMS

Vamos a construir un sistema que:
1. Recibe un tema
2. Investiga el tema
3. Genera un artículo
4. Lo revisa y mejora
5. Lo publica en el CMS

### Paso 1: Definir la Spec

Antes de escribir código, escribimos la especificación:

```yaml
# spec/create-article.yaml
name: create-article
version: 1.0
description: Crea y publica un artículo en el CMS

input:
  topic: string (required)
  target_audience: string (optional, default: "desarrolladores")
  word_count: number (optional, default: 1500)
  cms_endpoint: string (required)

output:
  article_id: string
  url: string
  status: "published" | "draft" | "failed"

agents:
  - name: researcher
    role: Investigar el tema y recopilar información
    tools: [web_search, fetch_url]

  - name: writer
    role: Escribir el artículo basándose en la investigación
    tools: [none]

  - name: reviewer
    role: Revisar calidad, gramática y SEO
    tools: [none]

  - name: publisher
    role: Publicar en el CMS
    tools: [cms_api]

workflow:
  1. researcher: Investigar tema → research_notes
  2. writer: Escribir artículo usando research_notes → draft
  3. reviewer: Revisar draft → reviewed_draft + feedback
  4. writer: Aplicar feedback si necesario → final_draft
  5. publisher: Publicar final_draft → article_id, url

constraints:
  - El artículo debe tener título, introducción, cuerpo y conclusión
  - Mínimo 3 fuentes citadas
  - No contenido plagiado
  - Imágenes deben tener alt text
  - Máximo 2 iteraciones de revisión

acceptance_criteria:
  - Artículo publicado con URL válida
  - Score de legibilidad > 60 (Flesch)
  - Todas las secciones presentes
  - Al menos 1 imagen incluida
```

Esta spec define **todo** antes de ejecutar. El agente no improvisa.

### Paso 2: Implementar el Orquestador

```javascript
// orchestrator.js
class ArticleOrchestrator {
  constructor(spec) {
    this.spec = spec;
    this.agents = this.initializeAgents();
    this.state = {};
  }

  async execute(input) {
    // Validar input contra spec
    this.validateInput(input);

    // Ejecutar workflow definido en spec
    for (const step of this.spec.workflow) {
      const agent = this.agents[step.agent];
      const result = await agent.execute({
        task: step.task,
        input: this.state,
        constraints: this.spec.constraints
      });

      // Guardar resultado en estado
      this.state[step.output] = result;

      // Verificar que no se violen constraints
      this.checkConstraints(result);
    }

    // Verificar criterios de aceptación
    this.verifyAcceptanceCriteria();

    return this.state.final_output;
  }

  validateInput(input) {
    for (const [key, type] of Object.entries(this.spec.input)) {
      if (type.includes('required') && !input[key]) {
        throw new Error(`Missing required input: ${key}`);
      }
    }
  }

  checkConstraints(result) {
    for (const constraint of this.spec.constraints) {
      if (!this.evaluateConstraint(constraint, result)) {
        throw new Error(`Constraint violated: ${constraint}`);
      }
    }
  }
}
```

### Paso 3: Implementar Agentes Especializados

Cada agente tiene un rol específico y solo hace eso:

```javascript
// agents/researcher.js
class ResearcherAgent {
  constructor() {
    this.tools = ['web_search', 'fetch_url'];
    this.systemPrompt = `
      Eres un investigador experto. Tu trabajo es:
      1. Buscar información relevante sobre el tema
      2. Identificar fuentes confiables
      3. Extraer datos clave y estadísticas
      4. Compilar notas de investigación estructuradas

      RESTRICCIONES:
      - Solo usar fuentes de los últimos 2 años
      - Mínimo 3 fuentes diferentes
      - Verificar que las fuentes sean confiables

      OUTPUT: JSON con estructura { sources: [], key_points: [], statistics: [] }
    `;
  }

  async execute({ task, input, constraints }) {
    // Usar LLM con el system prompt específico
    const result = await llm.chat({
      system: this.systemPrompt,
      user: `Investiga: ${input.topic} para audiencia: ${input.target_audience}`,
      tools: this.tools
    });

    return this.parseResearchNotes(result);
  }
}

// agents/writer.js
class WriterAgent {
  constructor() {
    this.systemPrompt = `
      Eres un escritor técnico experto. Tu trabajo es:
      1. Crear artículos claros y bien estructurados
      2. Usar las notas de investigación proporcionadas
      3. Adaptar el tono a la audiencia objetivo

      ESTRUCTURA OBLIGATORIA:
      - Título atractivo
      - Introducción (gancho + contexto)
      - Cuerpo (3-5 secciones)
      - Conclusión con call-to-action

      RESTRICCIONES:
      - No inventar información
      - Citar fuentes cuando uses datos
      - Párrafos máximo 4 oraciones
    `;
  }

  async execute({ task, input, constraints }) {
    const result = await llm.chat({
      system: this.systemPrompt,
      user: `
        Escribe un artículo de ${input.word_count} palabras.

        TEMA: ${input.topic}
        AUDIENCIA: ${input.target_audience}

        INVESTIGACIÓN:
        ${JSON.stringify(input.research_notes)}
      `
    });

    return this.formatArticle(result);
  }
}

// agents/reviewer.js
class ReviewerAgent {
  constructor() {
    this.systemPrompt = `
      Eres un editor experto. Tu trabajo es:
      1. Revisar calidad del contenido
      2. Verificar gramática y estilo
      3. Evaluar SEO básico
      4. Dar feedback accionable

      CHECKLIST:
      - [ ] Título claro y atractivo
      - [ ] Introducción engancha al lector
      - [ ] Estructura lógica
      - [ ] Fuentes citadas correctamente
      - [ ] Sin errores gramaticales
      - [ ] Longitud apropiada
      - [ ] Call-to-action presente

      OUTPUT: { approved: boolean, score: number, feedback: string[] }
    `;
  }

  async execute({ task, input }) {
    const result = await llm.chat({
      system: this.systemPrompt,
      user: `Revisa este artículo:\n\n${input.draft}`
    });

    return JSON.parse(result);
  }
}

// agents/publisher.js
class PublisherAgent {
  constructor(cmsEndpoint) {
    this.cmsEndpoint = cmsEndpoint;
  }

  async execute({ task, input }) {
    // Formatear para el CMS
    const payload = {
      title: input.final_draft.title,
      content: input.final_draft.body,
      excerpt: input.final_draft.excerpt,
      status: 'publish',
      categories: input.final_draft.categories,
      tags: input.final_draft.tags
    };

    // Llamar API del CMS
    const response = await fetch(`${this.cmsEndpoint}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CMS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    return {
      article_id: result.id,
      url: result.link,
      status: 'published'
    };
  }
}
```

### Paso 4: Ejecutar el Sistema

```javascript
// main.js
import { ArticleOrchestrator } from './orchestrator.js';
import spec from './spec/create-article.yaml';

async function main() {
  const orchestrator = new ArticleOrchestrator(spec);

  try {
    const result = await orchestrator.execute({
      topic: "Cómo implementar autenticación OAuth2 en Node.js",
      target_audience: "desarrolladores backend junior",
      word_count: 2000,
      cms_endpoint: "https://mi-cms.com/api"
    });

    console.log('✅ Artículo publicado:', result.url);

  } catch (error) {
    console.error('❌ Error:', error.message);
    // El sistema falló de forma predecible por violar spec
  }
}

main();
```

## Beneficios de Spec Driven Development

### 1. Predecibilidad

Con specs claras, sabes exactamente qué esperar. No hay sorpresas.

```yaml
# Si el agente viola esto:
constraints:
  - Mínimo 3 fuentes citadas

# El sistema falla inmediatamente con error claro:
# "Constraint violated: Mínimo 3 fuentes citadas"
```

### 2. Debuggabilidad

Cuando algo falla, sabes exactamente dónde:

```
Step 1: researcher ✅
Step 2: writer ✅
Step 3: reviewer ❌ - Score 45 < 60 required
```

### 3. Iterabilidad

Mejorar el sistema es cambiar la spec:

```yaml
# Versión 1.0
word_count: 1500

# Versión 1.1 - Artículos más largos
word_count: 2500
```

### 4. Testabilidad

Puedes escribir tests contra la spec:

```javascript
test('article meets acceptance criteria', async () => {
  const result = await orchestrator.execute(testInput);

  expect(result.status).toBe('published');
  expect(result.url).toMatch(/^https:\/\//);
  expect(result.readability_score).toBeGreaterThan(60);
});
```

## Patrones Avanzados

### Agentes con Memoria

```javascript
class AgentWithMemory {
  constructor() {
    this.shortTermMemory = []; // Conversación actual
    this.longTermMemory = new VectorDB(); // Conocimiento persistente
  }

  async execute(task) {
    // Buscar contexto relevante
    const context = await this.longTermMemory.search(task.query);

    // Ejecutar con contexto
    const result = await this.run(task, context);

    // Guardar para futuro
    await this.longTermMemory.store(result);

    return result;
  }
}
```

### Agentes que se Auto-corrigen

```javascript
async executeWithRetry(task, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await this.execute(task);
    const review = await this.reviewer.evaluate(result);

    if (review.approved) {
      return result;
    }

    // Auto-corrección basada en feedback
    task.feedback = review.feedback;
    task.previousAttempt = result;
  }

  throw new Error('Max retries exceeded');
}
```

### Orquestación Condicional

```yaml
workflow:
  1. researcher: Investigar → research_notes
  2. writer: Escribir → draft
  3. reviewer: Revisar → review
  4. IF review.score < 60:
       writer: Reescribir con feedback → draft
       GOTO 3
  5. publisher: Publicar → output
```

## Errores Comunes a Evitar

### ❌ Specs Vagas

```yaml
# MAL
constraints:
  - El artículo debe ser bueno

# BIEN
constraints:
  - Score de legibilidad > 60
  - Entre 1500-2000 palabras
  - Mínimo 3 secciones con headers H2
```

### ❌ Agentes Todoterreno

```javascript
// MAL - Un agente hace todo
const superAgent = new Agent({
  role: "Investigar, escribir, revisar y publicar"
});

// BIEN - Agentes especializados
const researcher = new ResearcherAgent();
const writer = new WriterAgent();
const reviewer = new ReviewerAgent();
```

### ❌ Sin Validación

```javascript
// MAL - Confiar ciegamente en el output
const article = await writer.execute(task);
publishDirectly(article);

// BIEN - Validar contra spec
const article = await writer.execute(task);
const validation = await validator.check(article, spec.constraints);
if (validation.passed) {
  publish(article);
}
```

## Conclusión

Spec Driven Development transforma agentes caóticos en sistemas predecibles:

1. **Define la spec primero** — qué, cómo, restricciones
2. **Agentes especializados** — cada uno hace una cosa bien
3. **Orquestador central** — coordina el flujo
4. **Validación constante** — verificar contra spec en cada paso

El resultado: agentes que **hacen lo que esperas**, fallan de forma **predecible**, y son **fáciles de mejorar**.

La IA sin metodología es un juguete. Con Spec Driven Development, es una herramienta de producción.

---

## Recursos

- [Agent Protocol Spec](https://agentprotocol.ai/)
- [LangChain Agents](https://python.langchain.com/docs/modules/agents/)
- [Claude Code Hooks](https://docs.anthropic.com/claude-code/hooks)

---

*¿Implementaste algo similar? Cuéntame tu experiencia.*
