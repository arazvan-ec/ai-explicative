---
title: "{{title}}"
date: {{date}}
category: {{category}}
tags: [{{tags}}]
draft: true
---

# {{title}}

## Introducción

_Describe brevemente el contexto y objetivo de este artículo._

## El Problema

_¿Qué estabas tratando de resolver o lograr?_

## Mi Enfoque con IA

_Describe cómo usaste Claude Code para abordar el problema._

### Herramientas Utilizadas

| Herramienta | Veces | Para qué |
|-------------|-------|----------|
{{#each tools}}
| {{name}} | {{count}} | {{purpose}} |
{{/each}}

### Prompts que Funcionaron

```
{{examplePrompts}}
```

## El Proceso

_Describe paso a paso lo que hiciste._

### 1. Exploración

_¿Cómo empezaste a entender el problema?_

### 2. Implementación

_¿Qué cambios hiciste?_

### 3. Verificación

_¿Cómo verificaste que funcionaba?_

## Código Destacado

```{{language}}
{{codeSnippet}}
```

## Lo Que Aprendí

### ¿Qué Funcionó Bien?

-

### ¿Qué No Funcionó?

-

### Tips para Otros

1.
2.
3.

## Conclusión

_Resume los puntos principales y el valor obtenido._

## Recursos Relacionados

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
-

---

*Artículo basado en {{interactionsCount}} interacciones con Claude Code*
*Generado el {{generatedAt}}*
