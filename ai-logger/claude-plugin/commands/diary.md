---
description: Genera un resumen/diario de tu sesión con Claude Code (compatible con web)
allowed-tools: Bash, Read, Write
---

Genera un diario/resumen de mi sesión actual con Claude Code.

**IMPORTANTE:** Primero asegúrate de que existen los directorios:
```bash
mkdir -p ~/.ai-logger/diary
```

Analiza el contexto completo de nuestra conversación y crea un resumen estructurado.

## Estructura del Diario

Crea un archivo Markdown con esta estructura:

```markdown
# Diario IA - [FECHA]

## Resumen Ejecutivo
[1-2 oraciones sobre qué logramos]

## Objetivo de la Sesión
[Qué quería lograr el usuario]

## Tareas Completadas
- [ ] Tarea 1
- [ ] Tarea 2

## Herramientas Utilizadas
| Herramienta | Para qué |
|-------------|----------|
| Edit | ... |
| Bash | ... |

## Archivos Modificados
- `path/to/file1`
- `path/to/file2`

## Código Destacado
[Snippets importantes de la sesión]

## Aprendizajes
- Aprendizaje 1
- Aprendizaje 2

## Desafíos Encontrados
- Desafío y cómo se resolvió

## Próximos Pasos
- [ ] Pendiente 1
- [ ] Pendiente 2

## Reflexión
> [Espacio para reflexión personal]

---
*Sesión: [fecha y hora]*
*Proyecto: [nombre del proyecto]*
```

## Instrucciones

1. Analiza TODA la conversación actual
2. Extrae los puntos clave
3. Genera el diario completo
4. Guarda en: `~/.ai-logger/diary/diary-$(date +%Y-%m-%d).md`
5. Si ya existe, agrega como nueva sección con la hora

Muestra el contenido generado al final.
