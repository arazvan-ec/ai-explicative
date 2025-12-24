---
title: "Cómo Creé un Plugin para Documentar mi Experiencia con Claude Code"
date: 2025-12-24
category: feature
tags: [claude-code, plugin, logging, documentacion, ia, productividad]
draft: false
---

# Cómo Creé un Plugin para Documentar mi Experiencia con Claude Code

## Introducción

¿Alguna vez terminaste una sesión de programación con IA y pensaste "esto debería documentarlo"? Yo sí, constantemente. El problema es que cuando terminas, ya olvidaste la mitad de lo que hiciste.

Hoy resolví ese problema creando **AI Logger**, un plugin para Claude Code que captura automáticamente mis interacciones y genera diarios y artículos como este que estás leyendo.

## El Contexto

Tengo un proyecto educativo sobre desarrollo con IA llamado **ai-explicative**. Quería expandirlo para:

1. Registrar todas mis interacciones con Claude Code
2. Categorizar las acciones automáticamente
3. Generar resúmenes diarios
4. Crear artículos para mi blog basados en experiencias reales

La idea era simple: **usar IA para documentar mi uso de IA**. Meta, ¿verdad?

## El Desafío

Claude Code tiene un sistema de extensiones, pero no es obvio cómo usarlo. Hay:

- **Hooks** - Scripts que se ejecutan en eventos específicos
- **MCP Servers** - Herramientas personalizadas
- **Slash Commands** - Comandos como `/diary` o `/article`
- **Skills** - Instrucciones que Claude puede invocar

¿Cuál usar? ¿Cómo combinarlos? ¿Funcionan igual en CLI y en la web?

## Mi Enfoque con Claude Code

Le pedí a Claude que investigara la documentación oficial y me ayudara a diseñar la arquitectura. Esto es lo que funcionó.

### Lo que Funcionó

**1. Empezar con un plan detallado**

```
"Crea un plan para documentar mis experiencias con IA"
```

Claude generó un documento completo con arquitectura, modelo de datos, y fases de implementación. Esto me dio claridad antes de escribir código.

**2. Usar slash commands como interfaz principal**

Los slash commands funcionan tanto en CLI como en web. Son archivos Markdown simples:

```markdown
---
description: Genera un diario de tu sesión
allowed-tools: Bash, Read, Write
---

Analiza la conversación y genera un resumen...
```

**3. Hooks para captura automática (solo CLI)**

```bash
# post-tool-logger.sh
input=$(cat)
tool_name=$(echo "$input" | jq -r '.tool_name')
echo "$log_entry" >> ~/.ai-logger/logs/interactions.jsonl
```

**4. Dashboard web para visualización**

Un componente React que lee los datos y los muestra bonito.

### Lo que No Funcionó

**MCP Servers en la web** - Descubrí que hay un bug conocido: los MCP servers no se cargan en Claude Code Web. Tuve que hacer que todo funcionara solo con slash commands.

**Guardar en `~/.ai-logger/`** - Funcionaba, pero los datos no se versionaban. Mejor guardar en el repo en `ai-logger/data/`.

### El Momento "Ajá"

Cuando ejecuté `/diary` por primera vez y Claude analizó toda nuestra conversación y generó un resumen estructurado automáticamente.

Ver mi sesión de trabajo documentada sin esfuerzo fue... satisfactorio.

## La Solución

El plugin tiene tres capas:

```
┌─────────────────────────────────────────┐
│           SLASH COMMANDS                │
│   /setup /diary /article /log /stats    │
├─────────────────────────────────────────┤
│              STORAGE                    │
│   ai-logger/data/{diary,articles,notes} │
├─────────────────────────────────────────┤
│            DASHBOARD                    │
│   React app para visualizar todo        │
└─────────────────────────────────────────┘
```

### Comandos disponibles

| Comando | Qué hace |
|---------|----------|
| `/setup` | Configura el entorno |
| `/diary` | Genera resumen de la sesión |
| `/article [tema]` | Crea artículo para blog |
| `/log [nota]` | Guarda nota rápida |
| `/stats` | Muestra estadísticas |

### Instalación

```bash
# Clonar
git clone https://github.com/usuario/ai-explicative

# Instalar comandos
cp ai-logger/claude-plugin/commands/*.md ~/.claude/commands/

# Listo!
```

## Lecciones Aprendidas

1. **Los slash commands son la forma más portable** de extender Claude Code. Funcionan en CLI y Web sin cambios.

2. **Empezar simple, iterar rápido**. Primero hice logging manual, luego lo automaticé con hooks, luego agregué el dashboard.

3. **Guardar datos en el repo** permite versionarlos y compartirlos. Mejor que un directorio oculto en home.

4. **La documentación oficial existe**, pero hay que saber buscarla. Claude Code tiene más extensibilidad de la que parece.

5. **Meta-programming funciona**. Usar IA para crear herramientas que mejoran el uso de IA es un loop virtuoso.

## Tips para Ti

Si quieres crear tu propio plugin:

- **Empieza con slash commands**. Son archivos Markdown, no necesitas compilar nada.

- **Usa `allowed-tools`** para especificar qué herramientas puede usar el comando.

- **Guarda en el repo**, no en `~/.ai-logger/`. Así puedes versionar y compartir.

- **Prueba en web primero**. Si funciona ahí, funciona en todos lados.

- **No dependas de MCP servers** si quieres compatibilidad web.

## Conclusión

En una sesión de ~1 hora, creé un sistema completo para documentar mi experiencia con IA. El plugin ahora:

- Captura mis sesiones automáticamente
- Genera diarios estructurados
- Crea borradores de artículos como este
- Tiene un dashboard para visualizar todo

Lo mejor: **este artículo fue generado usando el mismo plugin que describe**.

El código está disponible en el repo. Siéntete libre de usarlo, modificarlo, o crear tu propia versión.

---

*¿Te fue útil? El siguiente paso es agregar categorización automática con LLM. Stay tuned.*

## Recursos

- [Documentación de Hooks - Claude Code](https://docs.anthropic.com/claude-code/hooks)
- [Slash Commands - Claude Code](https://docs.anthropic.com/claude-code/slash-commands)
- [Repo del proyecto](https://github.com/arazvan-ec/ai-explicative)
