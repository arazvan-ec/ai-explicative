---
description: Genera un artículo para tu blog basado en tu experiencia con IA (compatible con web)
allowed-tools: Bash, Read, Write
---

Genera un artículo para mi blog basado en mi experiencia de hoy con Claude Code.

**Tema del artículo:** $ARGUMENTS

**IMPORTANTE:** Primero crea los directorios:
```bash
mkdir -p ~/.ai-logger/articles
```

## Estructura del Artículo

Analiza nuestra conversación y crea un artículo completo en Markdown:

```markdown
---
title: "[Título atractivo y descriptivo]"
date: YYYY-MM-DD
category: [debugging|feature|refactoring|learning|devops|architecture]
tags: [tag1, tag2, tag3, claude-code, ia]
draft: true
---

# [Título]

## Introducción

[Párrafo que enganche al lector. ¿Por qué debería importarle este tema?]

## El Contexto

[Describe el proyecto/situación. ¿Qué estabas haciendo? ¿Cuál era el objetivo?]

## El Desafío

[¿Cuál era el problema específico? ¿Por qué era difícil?]

## Mi Enfoque con Claude Code

[Cómo decidiste usar IA para resolver esto]

### Lo que Funcionó

[Ejemplos concretos de prompts o interacciones exitosas]

```
Ejemplo de prompt que funcionó bien
```

### Lo que No Funcionó

[Intentos fallidos - esto es valioso para otros]

### El Momento "Ajá"

[¿Cuándo se resolvió? ¿Qué insight tuviste?]

## La Solución

[Código o cambios implementados]

```[lenguaje]
// Código resultante
```

## Lecciones Aprendidas

1. **Lección 1:** Explicación
2. **Lección 2:** Explicación
3. **Lección 3:** Explicación

## Tips para Ti

Si te encuentras en una situación similar:

- Tip práctico 1
- Tip práctico 2
- Tip práctico 3

## Conclusión

[Reflexión final. ¿Qué valor obtuviste? ¿Cómo cambió tu forma de trabajar?]

---

*¿Te fue útil? Comparte tu experiencia en los comentarios.*
```

## Instrucciones

1. Analiza TODA la conversación buscando momentos interesantes
2. Identifica el "arco narrativo" (problema → proceso → solución)
3. Extrae ejemplos concretos y código relevante
4. Genera el artículo completo
5. Guarda en: `~/.ai-logger/articles/draft-$(date +%Y-%m-%d)-[slug].md`

El slug debe ser el tema en minúsculas con guiones (ej: "debugging-memory-leak")

Muestra una vista previa del artículo al final.
