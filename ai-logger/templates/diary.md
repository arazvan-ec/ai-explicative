# Diario de IA - {{date}}

## Resumen

- **Total de interacciones:** {{totalInteractions}}
- **Sesiones:** {{totalSessions}}
- **Herramienta más usada:** {{topTool}}
- **Proyecto más activo:** {{topProject}}

## Actividad por Herramienta

| Herramienta | Usos | % |
|-------------|------|---|
{{#each tools}}
| {{name}} | {{count}} | {{percentage}}% |
{{/each}}

## Sesiones del Día

{{#each sessions}}
### {{project}} ({{time}})

- **Interacciones:** {{interactionsCount}}
- **Herramientas:** {{toolsSummary}}
- **Duración:** {{duration}}

{{/each}}

## Archivos Modificados

{{#each filesModified}}
- `{{this}}`
{{/each}}

## Reflexión del Día

> _Agrega aquí tus reflexiones sobre el uso de IA hoy..._

### ¿Qué funcionó bien?

-

### ¿Qué podría mejorar?

-

### Aprendizajes clave

-

---

*Generado automáticamente por ai-logger el {{generatedAt}}*
