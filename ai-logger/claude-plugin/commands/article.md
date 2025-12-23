---
description: Genera un artículo para tu blog basado en tu experiencia con Claude Code
allowed-tools: Bash, Read, Write
---

Genera un artículo para mi blog basado en mi experiencia de hoy con Claude Code.

Tema o enfoque del artículo: $ARGUMENTS

Analiza nuestra conversación y crea un artículo en Markdown con esta estructura:

```markdown
---
title: "[Título descriptivo]"
date: [fecha de hoy]
category: [debugging|feature|refactoring|learning|documentation]
tags: [tags relevantes]
draft: true
---

# [Título]

## Introducción
[Contexto del problema/objetivo]

## El Desafío
[¿Qué estaba tratando de resolver?]

## Mi Enfoque con IA
[Cómo usé Claude Code para abordarlo]

### Prompts que Funcionaron
[Ejemplos de lo que pedí y funcionó bien]

### Lo que No Funcionó
[Intentos fallidos y por qué]

## La Solución
[Código resultante o cambios implementados]

## Aprendizajes Clave
[Bullet points de lo aprendido]

## Tips para Otros
[Consejos prácticos]

## Conclusión
[Resumen y reflexión final]
```

Guarda el artículo en: `~/.ai-logger/articles/draft-$(date +%Y-%m-%d)-[slug-del-tema].md`

Al final muestra el path del archivo y un preview del artículo.
