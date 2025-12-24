---
description: Genera un artículo para tu blog basado en tu experiencia con IA
allowed-tools: Bash, Read, Write
---

Genera un artículo para mi blog basado en mi experiencia de hoy con Claude Code.

**Tema del artículo:** $ARGUMENTS

**Directorio de datos:** Guarda en el repositorio en `ai-logger/data/articles/`

Primero verifica:
```bash
mkdir -p ai-logger/data/articles
```

## Estructura del Artículo

Analiza nuestra conversación y crea un artículo completo:

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

[Párrafo que enganche al lector. ¿Por qué debería importarle?]

## El Contexto

[Describe el proyecto/situación]

## El Desafío

[¿Cuál era el problema? ¿Por qué era difícil?]

## Mi Enfoque con Claude Code

[Cómo usé IA para resolver esto]

### Lo que Funcionó

[Ejemplos concretos de prompts exitosos]

### Lo que No Funcionó

[Intentos fallidos - valioso para otros]

### El Momento "Ajá"

[¿Cuándo se resolvió? ¿Qué insight tuviste?]

## La Solución

[Código o cambios implementados]

## Lecciones Aprendidas

1. **Lección 1:** Explicación
2. **Lección 2:** Explicación

## Tips para Ti

- Tip práctico 1
- Tip práctico 2

## Conclusión

[Reflexión final]

---
*¿Te fue útil? Comparte tu experiencia.*
```

## Instrucciones

1. Analiza TODA la conversación
2. Identifica el "arco narrativo" (problema → proceso → solución)
3. Extrae ejemplos y código relevante
4. Guarda en: `ai-logger/data/articles/draft-YYYY-MM-DD-[slug].md`

El slug = tema en minúsculas con guiones.

Muestra vista previa y confirma ubicación.
