---
title: "Cómo Construir un Sistema de Agentes con Spec Driven Development"
date: 2025-12-24
category: architecture
tags: [agentes, spec-driven-development, ia, claude-code, markdown]
draft: false
---

# Cómo Construir un Sistema de Agentes con Spec Driven Development

## Introducción

¿Crees que necesitas saber programar para crear un sistema de agentes de IA? **No.**

Con Claude Code y Markdown, puedes construir flujos de trabajo potentes usando solo archivos `.md`. Los "agentes" son simplemente **especificaciones bien escritas**.

En este artículo te muestro cómo crear un sistema de agentes real usando **solo Markdown** — con un caso práctico: crear y publicar un artículo en un CMS.

## ¿Qué es Spec Driven Development?

Spec Driven Development (SDD) significa:

> **Primero defines QUÉ quieres, CÓMO lo quieres, y las RESTRICCIONES. Después ejecutas.**

En lugar de decirle a la IA "escríbeme un artículo", le das:

1. **Especificación clara** — qué debe hacer exactamente
2. **Formato esperado** — cómo debe verse el output
3. **Restricciones** — qué NO debe hacer
4. **Criterios de éxito** — cómo saber si está bien

### Sin Spec vs Con Spec

❌ **Sin spec:**
```
"Escribe un artículo sobre OAuth2"
```
Resultado: Artículo genérico, longitud aleatoria, sin estructura clara.

✅ **Con spec:**
```
Escribe un artículo técnico sobre OAuth2.

AUDIENCIA: Desarrolladores backend junior
LONGITUD: 1500-2000 palabras
ESTRUCTURA:
- Título atractivo
- Introducción con gancho (por qué importa)
- Sección "El Problema"
- Sección "La Solución"
- Ejemplo práctico con código
- Errores comunes
- Conclusión con siguiente paso

RESTRICCIONES:
- No asumir conocimiento previo de OAuth
- Incluir al menos un diagrama (describir en texto)
- Citar fuentes si usas estadísticas

FORMATO: Markdown con frontmatter YAML
```
Resultado: Exactamente lo que necesitas.

## Los "Agentes" son Specs en Markdown

Un "agente" no es más que un archivo `.md` con instrucciones específicas. En Claude Code, estos son **slash commands**.

### Estructura de un Agente/Spec

```markdown
---
description: Qué hace este agente (una línea)
allowed-tools: Herramientas que puede usar
---

# Rol
[Quién es este agente]

# Objetivo
[Qué debe lograr]

# Instrucciones
[Pasos específicos]

# Formato de Output
[Cómo debe verse el resultado]

# Restricciones
[Qué NO hacer]

# Criterios de Éxito
[Cómo saber si está bien]
```

## Caso de Uso: Sistema para Crear Artículos en CMS

Vamos a crear un sistema de 4 "agentes" (archivos .md) que trabajan juntos:

```
~/.claude/commands/
├── research.md      # Agente Investigador
├── write.md         # Agente Escritor
├── review.md        # Agente Revisor
└── publish.md       # Agente Publicador
```

### Agente 1: Investigador (`research.md`)

```markdown
---
description: Investiga un tema y genera notas estructuradas
allowed-tools: WebSearch, WebFetch, Read
---

# Rol
Eres un investigador experto. Tu trabajo es recopilar información
de calidad sobre un tema.

# Objetivo
Investigar: $ARGUMENTS

# Instrucciones

1. **Buscar información**
   - Usa WebSearch para encontrar artículos relevantes
   - Prioriza fuentes de los últimos 2 años
   - Busca: tutoriales, documentación oficial, casos de estudio

2. **Extraer información clave**
   - Definiciones claras
   - Estadísticas relevantes
   - Ejemplos prácticos
   - Errores comunes mencionados

3. **Compilar notas**
   - Organizar por temas
   - Incluir URLs de fuentes
   - Marcar lo más importante

# Formato de Output

Guarda en: `ai-logger/data/research/research-[tema]-[fecha].md`

```markdown
# Investigación: [Tema]

## Fuentes Consultadas
- [Título](URL) - Resumen en 1 línea

## Puntos Clave
- Punto 1
- Punto 2

## Estadísticas
- Stat 1 (fuente)
- Stat 2 (fuente)

## Ejemplos Encontrados
[Ejemplos relevantes]

## Errores Comunes
[Lo que la gente hace mal]
```

# Restricciones
- NO inventar información
- NO usar fuentes anteriores a 2023
- Mínimo 3 fuentes diferentes
- NO incluir opiniones, solo hechos

# Criterios de Éxito
- [ ] Al menos 3 fuentes citadas
- [ ] Puntos clave claros y accionables
- [ ] Archivo guardado correctamente
```

### Agente 2: Escritor (`write.md`)

```markdown
---
description: Escribe un artículo basado en investigación previa
allowed-tools: Read, Write
---

# Rol
Eres un escritor técnico experto. Transformas investigación
en artículos claros y atractivos.

# Objetivo
Escribir artículo sobre: $ARGUMENTS

# Instrucciones

1. **Leer investigación**
   - Busca el archivo de investigación más reciente sobre el tema
   - Ubicación: `ai-logger/data/research/`

2. **Planificar estructura**
   - Título atractivo (promete valor)
   - Hook en la introducción
   - 3-5 secciones principales
   - Conclusión con call-to-action

3. **Escribir el artículo**
   - Usa las notas de investigación
   - Adapta al nivel de la audiencia
   - Incluye ejemplos prácticos
   - Párrafos cortos (máx 4 oraciones)

# Formato de Output

Guarda en: `ai-logger/data/drafts/draft-[fecha]-[slug].md`

```markdown
---
title: "[Título]"
date: [YYYY-MM-DD]
category: [categoría]
tags: [tag1, tag2]
status: draft
---

# [Título]

## Introducción
[Gancho + Por qué importa + Qué aprenderá]

## [Sección 1]
[Contenido]

## [Sección 2]
[Contenido]

## [Sección 3]
[Contenido]

## Conclusión
[Resumen + Siguiente paso]

---
*Fuentes: [listar fuentes usadas]*
```

# Restricciones
- NO inventar datos que no estén en la investigación
- NO exceder 2500 palabras
- NO usar jerga sin explicar
- Citar fuentes cuando uses estadísticas

# Criterios de Éxito
- [ ] Título claro y atractivo
- [ ] Introducción engancha en 2 oraciones
- [ ] Estructura lógica con headers
- [ ] Ejemplos prácticos incluidos
- [ ] Entre 1500-2500 palabras
```

### Agente 3: Revisor (`review.md`)

```markdown
---
description: Revisa y mejora un artículo draft
allowed-tools: Read, Write
---

# Rol
Eres un editor experto. Tu trabajo es mejorar artículos
sin cambiar la voz del autor.

# Objetivo
Revisar el artículo más reciente en `ai-logger/data/drafts/`

# Instrucciones

1. **Leer el draft**
   - Lee el artículo completo
   - Identifica el objetivo y audiencia

2. **Evaluar con checklist**

   **Contenido:**
   - [ ] ¿El título promete valor claro?
   - [ ] ¿La intro engancha en 10 segundos?
   - [ ] ¿Cada sección aporta valor?
   - [ ] ¿Los ejemplos son claros?
   - [ ] ¿La conclusión da siguiente paso?

   **Claridad:**
   - [ ] ¿Párrafos de máx 4 oraciones?
   - [ ] ¿Sin jerga inexplicada?
   - [ ] ¿Flujo lógico entre secciones?

   **Técnico:**
   - [ ] ¿Código formateado correctamente?
   - [ ] ¿Fuentes citadas?
   - [ ] ¿Sin errores gramaticales?

3. **Generar feedback**
   - Lista de mejoras específicas
   - Sugerencias concretas (no vagas)

4. **Aplicar correcciones menores**
   - Errores de gramática
   - Formato de código
   - Typos

# Formato de Output

Actualiza el draft con correcciones menores.

Crea archivo de feedback: `ai-logger/data/reviews/review-[fecha].md`

```markdown
# Review: [Título del Artículo]

## Score: [X/10]

## ✅ Lo que está bien
- Punto 1
- Punto 2

## 🔧 Mejoras Necesarias
1. **[Sección]**: [Qué mejorar y cómo]
2. **[Sección]**: [Qué mejorar y cómo]

## 📝 Correcciones Aplicadas
- [Lista de correcciones menores hechas]

## Recomendación
[ ] Listo para publicar
[ ] Necesita otra revisión
[ ] Reescribir sección X
```

# Restricciones
- NO reescribir el artículo completo
- NO cambiar la voz del autor
- NO agregar información nueva
- Feedback específico, no vago ("mejorar intro" ❌, "agregar ejemplo en línea 45" ✅)

# Criterios de Éxito
- [ ] Checklist completado
- [ ] Feedback accionable generado
- [ ] Correcciones menores aplicadas
- [ ] Recomendación clara dada
```

### Agente 4: Publicador (`publish.md`)

```markdown
---
description: Publica un artículo aprobado en el CMS
allowed-tools: Read, Bash, Write
---

# Rol
Eres el publicador. Tu trabajo es tomar artículos aprobados
y publicarlos en el destino correcto.

# Objetivo
Publicar el artículo: $ARGUMENTS

# Instrucciones

1. **Verificar aprobación**
   - Leer el review más reciente
   - Solo continuar si dice "Listo para publicar"

2. **Preparar para publicación**
   - Leer el draft final
   - Cambiar status de "draft" a "published"
   - Verificar que tiene todos los campos requeridos

3. **Mover a carpeta de publicación**
   - Origen: `ai-logger/data/drafts/`
   - Destino: `ai-logger/data/articles/`
   - Renombrar quitando "draft-" del nombre

4. **Actualizar índice**
   - Ejecutar: `bun ai-logger/scripts/build-index.js`

5. **Commit y push**
   - Agregar archivo al git
   - Commit con mensaje descriptivo
   - Push a la rama

# Formato de Output

Confirmar publicación:

```
✅ Artículo Publicado

Título: [título]
Archivo: [path]
Fecha: [fecha]

Próximo paso: Merge a main para deploy
```

# Restricciones
- NO publicar si el review no aprueba
- NO modificar el contenido del artículo
- NO hacer push a main directamente

# Criterios de Éxito
- [ ] Review dice "Listo para publicar"
- [ ] Archivo movido correctamente
- [ ] Índice actualizado
- [ ] Commit realizado
```

## Flujo de Trabajo Completo

Con estos 4 agentes, el flujo es:

```
/research OAuth2 para principiantes
    ↓
[Genera: research-oauth2-2025-12-24.md]
    ↓
/write OAuth2 para principiantes
    ↓
[Genera: draft-2025-12-24-oauth2.md]
    ↓
/review
    ↓
[Genera: review-2025-12-24.md + correcciones]
    ↓
/publish oauth2
    ↓
[Mueve a articles/ + commit]
```

**4 comandos. Artículo publicado.**

## Beneficios de Specs en Markdown

### 1. Sin Código
No necesitas saber programar. Solo escribir instrucciones claras.

### 2. Versionable
Los archivos `.md` van en git. Puedes ver historial, hacer rollback.

### 3. Colaborativo
Cualquiera puede mejorar las specs. No se necesita un desarrollador.

### 4. Reutilizable
Los mismos agentes sirven para cualquier artículo.

### 5. Predecible
Con specs claras, el output es consistente.

## Tips para Escribir Buenas Specs

### ✅ Sé Específico

```markdown
# MAL
"Escribe un buen artículo"

# BIEN
"Escribe un artículo de 1500-2000 palabras, con 4-5 secciones,
para desarrolladores junior, incluyendo al menos 2 ejemplos de código"
```

### ✅ Define el Output Exacto

```markdown
# MAL
"Guarda el resultado"

# BIEN
"Guarda en: ai-logger/data/articles/[fecha]-[slug].md
Con formato:
---
title: ...
date: ...
---
[contenido]"
```

### ✅ Lista Restricciones

```markdown
# RESTRICCIONES
- NO inventar estadísticas
- NO exceder 2500 palabras
- NO usar jerga sin explicar
- Máximo 4 oraciones por párrafo
```

### ✅ Incluye Criterios de Éxito

```markdown
# CRITERIOS DE ÉXITO
- [ ] Título menor a 60 caracteres
- [ ] Introducción engancha en 2 oraciones
- [ ] Al menos 3 fuentes citadas
- [ ] Código con syntax highlighting
```

## Conclusión

No necesitas TypeScript, Python, ni frameworks complejos para crear un sistema de agentes.

Con Claude Code + Markdown:

1. **Define specs claras** en archivos `.md`
2. **Usa slash commands** para ejecutar cada agente
3. **Los outputs alimentan** al siguiente agente
4. **El resultado es predecible** y consistente

Spec Driven Development es **escribir bien lo que quieres**. El código es opcional.

---

*¿Quieres ver estos agentes en acción? Están disponibles en el repo de ai-explicative.*
