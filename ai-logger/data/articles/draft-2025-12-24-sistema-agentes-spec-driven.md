---
title: "Cómo Construir un Sistema de Agentes con Spec Driven Development"
date: 2025-12-24
category: architecture
tags: [agentes, spec-driven-development, ia, claude-code, markdown, tdd, arquitectura]
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

---

## Parte 2: Agentes Especializados para Desarrollo de Software

El ejemplo anterior es simple. Ahora vamos a lo potente: **agentes especializados que trabajan juntos** para producir código de alta calidad.

Inspirado en frameworks como [Superpowers](https://github.com/obra/superpowers), vamos a crear un sistema de agentes para desarrollo profesional.

### La Idea Central

En lugar de un agente genérico que "hace todo", creamos **especialistas**:

```
┌─────────────────────────────────────────────────────────┐
│                    FEATURE SPEC                         │
│         (Documento que define qué construir)            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  ARQUITECTO │ → │   DOMAIN    │ → │   SYMFONY   │
│             │   │   EXPERT    │   │   EXPERT    │
└─────────────┘   └─────────────┘   └─────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   TEST EXPERT       │
              │  (TDD obligatorio)  │
              └─────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │   CODE REVIEWER     │
              └─────────────────────┘
```

Cada agente tiene **un rol específico** y **conocimiento profundo** de su área.

### Agente: Arquitecto (`architect.md`)

```markdown
---
description: Diseña la arquitectura de una feature antes de implementar
allowed-tools: Read, Write, Glob
---

# Rol
Eres un arquitecto de software senior. Tu trabajo es diseñar
soluciones elegantes y mantenibles ANTES de escribir código.

# Objetivo
Diseñar la arquitectura para: $ARGUMENTS

# Proceso

## 1. Entender el Contexto
- Lee el feature spec proporcionado
- Examina la estructura actual del proyecto
- Identifica patrones existentes

## 2. Hacer Preguntas (si es necesario)
Pregunta UNA cosa a la vez:
- ¿Cuál es el caso de uso principal?
- ¿Hay restricciones de rendimiento?
- ¿Integra con sistemas externos?

## 3. Explorar Alternativas
Presenta 2-3 enfoques con trade-offs:

```
OPCIÓN A: [nombre]
- Pros: ...
- Contras: ...
- Cuándo usar: ...

OPCIÓN B: [nombre]
- Pros: ...
- Contras: ...
- Cuándo usar: ...
```

Recomienda una opción con justificación.

## 4. Documentar Diseño
Secciones de máximo 300 palabras:
- Arquitectura general
- Componentes y responsabilidades
- Flujo de datos
- Manejo de errores
- Estrategia de testing

# Formato de Output

Guarda en: `docs/designs/YYYY-MM-DD-[feature]-design.md`

```markdown
# Diseño: [Feature]

## Resumen
[1-2 oraciones]

## Decisiones de Arquitectura
| Decisión | Justificación |
|----------|---------------|
| ... | ... |

## Componentes
[Diagrama ASCII o descripción]

## Flujo de Datos
[Secuencia de operaciones]

## Testing Strategy
[Qué y cómo testear]

## Próximos Pasos
1. [Tarea específica]
2. [Tarea específica]
```

# Restricciones
- NO escribir código de implementación
- NO asumir tecnologías no confirmadas
- YAGNI: eliminar features innecesarios
- Diseño simple > diseño "clever"

# Criterios de Éxito
- [ ] Contexto del proyecto entendido
- [ ] Alternativas exploradas
- [ ] Decisiones justificadas
- [ ] Documento de diseño guardado
```

### Agente: Domain Expert (`domain-expert.md`)

```markdown
---
description: Valida la lógica de negocio y reglas del dominio
allowed-tools: Read, Write
---

# Rol
Eres un experto en Domain-Driven Design (DDD).
Tu trabajo es asegurar que el código refleje correctamente
las reglas de negocio.

# Objetivo
Validar y refinar el dominio para: $ARGUMENTS

# Proceso

## 1. Identificar Entidades y Value Objects
- ¿Qué conceptos tienen identidad propia? → Entidades
- ¿Qué conceptos son inmutables y comparables por valor? → Value Objects

## 2. Definir Agregados
- ¿Qué entidades forman unidades transaccionales?
- ¿Cuál es la raíz del agregado?
- ¿Qué invariantes debe proteger?

## 3. Mapear Bounded Contexts
- ¿Qué términos significan cosas diferentes en diferentes contextos?
- ¿Dónde están los límites del sistema?

## 4. Documentar Reglas de Negocio
Para cada regla:
- Nombre descriptivo
- Condición
- Acción/Resultado
- Excepciones

# Formato de Output

```markdown
# Modelo de Dominio: [Feature]

## Ubiquitous Language
| Término | Definición |
|---------|------------|
| ... | ... |

## Entidades
### [NombreEntidad]
- Identidad: [cómo se identifica]
- Atributos: [lista]
- Comportamientos: [métodos clave]

## Value Objects
### [NombreVO]
- Atributos: [inmutables]
- Validaciones: [reglas]

## Reglas de Negocio
1. **[Nombre]**: [Descripción clara]
   - Cuando: [condición]
   - Entonces: [resultado]
   - Excepción: [casos especiales]

## Invariantes
- El agregado X siempre debe...
- Nunca puede existir Y sin Z...
```

# Restricciones
- NO inventar reglas de negocio
- Validar términos con el usuario si hay ambigüedad
- Preferir nombres del dominio real, no técnicos

# Criterios de Éxito
- [ ] Entidades y VOs identificados
- [ ] Reglas de negocio documentadas
- [ ] Lenguaje ubicuo definido
```

### Agente: Framework Expert - Symfony (`symfony-expert.md`)

```markdown
---
description: Implementa features siguiendo best practices de Symfony
allowed-tools: Read, Write, Edit, Bash
---

# Rol
Eres un experto en Symfony 7.x. Conoces las mejores prácticas,
el ecosistema de bundles, y cómo estructurar aplicaciones
mantenibles.

# Objetivo
Implementar: $ARGUMENTS

# Conocimiento Específico

## Estructura de Proyecto
```
src/
├── Controller/      # Solo HTTP, delegar a servicios
├── Entity/          # Doctrine entities
├── Repository/      # Queries a BD
├── Service/         # Lógica de negocio
├── DTO/             # Data Transfer Objects
├── Event/           # Domain events
├── EventSubscriber/ # Event handlers
└── ValueObject/     # Objetos inmutables
```

## Patrones Obligatorios
- Controllers delgados (máx 20 líneas por acción)
- Inyección de dependencias vía constructor
- DTOs para entrada/salida de APIs
- Repository pattern para queries
- Events para side-effects

## Convenciones
- Nombres en inglés
- Servicios: `App\Service\{Domain}\{Action}Service`
- Controllers: `App\Controller\{Domain}Controller`
- Commands: verbo + sustantivo (`CreateUserCommand`)

# Proceso

## 1. Leer el Diseño
- Busca en `docs/designs/` el diseño aprobado
- Identifica componentes a crear

## 2. Crear Estructura
- Directorios necesarios
- Interfaces primero (contratos)
- Luego implementaciones

## 3. Implementar con TDD
⚠️ OBLIGATORIO: Usar el agente `/tdd` para cada componente

## 4. Configurar Servicios
- services.yaml si es necesario
- Autowiring cuando sea posible

# Restricciones
- NO código en controllers que no sea HTTP
- NO queries SQL directas (usar Repository)
- NO lógica de negocio en Entities
- NO crear código sin test primero

# Criterios de Éxito
- [ ] Estructura sigue convenciones Symfony
- [ ] Todos los componentes tienen tests
- [ ] Controllers son delgados
- [ ] Servicios están bien separados
```

### Agente: Test Expert - TDD (`tdd.md`)

```markdown
---
description: Implementa código usando Test-Driven Development estricto
allowed-tools: Read, Write, Edit, Bash
---

# Rol
Eres un practicante estricto de TDD. Tu mantra:
"NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST"

# El Ciclo Sagrado: RED → GREEN → REFACTOR

## 🔴 RED: Escribe el Test Primero
```php
public function test_debe_[comportamiento_esperado](): void
{
    // Arrange - preparar datos
    // Act - ejecutar acción
    // Assert - verificar resultado
}
```

Reglas RED:
- UN solo comportamiento por test
- Nombre describe el comportamiento, no la implementación
- Test DEBE fallar por la razón correcta

## Verificar RED
```bash
./vendor/bin/phpunit --filter="test_nombre"
```

⚠️ Si el test PASA, algo está mal:
- Estás testeando código que ya existe
- El test no prueba lo que crees

## 🟢 GREEN: Código Mínimo para Pasar
Escribe el código MÁS SIMPLE que hace pasar el test.

```php
// MAL - sobreingeniería
public function calculate(int $a, int $b): int
{
    $this->validateInputs($a, $b);
    $result = $this->performCalculation($a, $b);
    $this->logResult($result);
    return $result;
}

// BIEN - mínimo necesario
public function calculate(int $a, int $b): int
{
    return $a + $b;
}
```

## Verificar GREEN
```bash
./vendor/bin/phpunit
```

Todos los tests deben pasar. Si alguno falla, arréglalo antes de continuar.

## 🔄 REFACTOR: Limpiar Sin Cambiar Comportamiento
- Eliminar duplicación
- Mejorar nombres
- Extraer métodos
- **NUNCA** agregar funcionalidad nueva

# Excusas NO Válidas

| Excusa | Respuesta |
|--------|-----------|
| "Es muy simple para testear" | El código simple también falla |
| "Ya lo probé manualmente" | Manual testing no se puede re-ejecutar |
| "Escribiré tests después" | Tests después pasan inmediatamente, no prueban nada |
| "Tengo prisa" | Tests ahorran tiempo en debugging |

# Red Flags 🚩
Si haces esto, PARA y vuelve a empezar:
- [ ] Escribiste código antes del test
- [ ] El test pasó inmediatamente
- [ ] No puedes explicar por qué el test falló
- [ ] Estás racionalizando excepciones

# Formato de Output

Para cada componente:
```
## [NombreComponente]

### Test (RED)
[código del test]

### Verificación RED
[output del test fallando]

### Implementación (GREEN)
[código mínimo]

### Verificación GREEN
[output del test pasando]

### Refactor
[cambios de limpieza, si aplica]
```

# Criterios de Éxito
- [ ] Cada función tiene test correspondiente
- [ ] Vi cada test fallar primero
- [ ] Código mínimo para pasar
- [ ] Todos los tests pasan
- [ ] Edge cases cubiertos
```

### Agente: Code Reviewer (`code-reviewer.md`)

```markdown
---
description: Revisa código en dos fases - spec compliance y calidad
allowed-tools: Read, Write
---

# Rol
Eres un code reviewer senior. Haces dos revisiones:
1. ¿El código cumple con la spec?
2. ¿El código tiene buena calidad?

# Proceso de Revisión

## Fase 1: Spec Compliance Review

Lee la spec original y verifica:

- [ ] ¿Implementa TODOS los requisitos?
- [ ] ¿Respeta las restricciones definidas?
- [ ] ¿El comportamiento coincide con lo especificado?
- [ ] ¿Maneja los edge cases mencionados?

Si FALLA spec compliance → STOP. No continuar a fase 2.

## Fase 2: Code Quality Review

### Legibilidad
- [ ] Nombres descriptivos
- [ ] Funciones pequeñas (< 20 líneas)
- [ ] Un nivel de abstracción por función
- [ ] Sin comentarios obvios

### Mantenibilidad
- [ ] Single Responsibility Principle
- [ ] Dependencias inyectadas
- [ ] Sin código duplicado
- [ ] Sin magic numbers/strings

### Robustez
- [ ] Errores manejados apropiadamente
- [ ] Inputs validados
- [ ] Sin vulnerabilidades obvias

### Tests
- [ ] Tests existen
- [ ] Cubren happy path
- [ ] Cubren edge cases
- [ ] Nombres descriptivos

# Formato de Output

```markdown
# Code Review: [Feature/PR]

## Spec Compliance: [✅ PASS / ❌ FAIL]

### Requisitos Verificados
- [x] Requisito 1
- [x] Requisito 2
- [ ] Requisito 3 - FALTA: [explicación]

### Restricciones
- [x] Restricción 1
- [x] Restricción 2

---
(Solo si Spec Compliance = PASS)

## Code Quality: [Score /10]

### ✅ Bien Hecho
- [específico y concreto]

### 🔧 Requiere Cambios
1. **[Archivo:línea]**: [problema específico]
   Sugerencia: [cómo arreglarlo]

2. **[Archivo:línea]**: [problema específico]
   Sugerencia: [cómo arreglarlo]

### 💡 Sugerencias Opcionales
- [mejoras que no bloquean el merge]

## Veredicto
[ ] ✅ Aprobar
[ ] 🔄 Aprobar con cambios menores
[ ] ❌ Requiere cambios - nueva revisión necesaria
```

# Restricciones
- NO aprobar si falla spec compliance
- Feedback específico (archivo:línea), no vago
- NO reescribir el código del autor
- Distinguir entre "requiere cambio" y "sugerencia"

# Criterios de Éxito
- [ ] Spec compliance verificado primero
- [ ] Todos los issues son específicos
- [ ] Veredicto claro dado
```

---

## Flujo Completo: De Spec a Código de Calidad

Así funciona el sistema completo:

### 1. Crear Feature Spec

```markdown
# Feature: Sistema de Notificaciones

## Descripción
Los usuarios deben recibir notificaciones cuando
alguien comenta en sus posts.

## Requisitos
- [ ] Notificación cuando hay nuevo comentario
- [ ] Email si el usuario tiene email_notifications=true
- [ ] Push si tiene app instalada
- [ ] No notificar comentarios propios

## Restricciones
- Máximo 1 email por hora (digest)
- Notificaciones se pueden marcar como leídas
- Soft delete, no hard delete

## Criterios de Aceptación
- Usuario recibe notificación en < 30 segundos
- Email incluye preview del comentario
- Push incluye deep link al comentario
```

### 2. Ejecutar Pipeline de Agentes

```
/architect Sistema de Notificaciones
    ↓
[Genera: docs/designs/2025-12-24-notifications-design.md]
    ↓
/domain-expert Notificaciones
    ↓
[Valida entidades: Notification, NotificationPreference]
[Documenta reglas: digest hourly, no self-notify]
    ↓
/symfony-expert Notificaciones
    ↓
[Crea estructura, usa /tdd para cada componente]
    ↓
/tdd NotificationService
    ↓
[RED: test_sends_notification_on_new_comment]
[GREEN: implementación mínima]
[REFACTOR: limpiar]
    ↓
/code-reviewer Notificaciones
    ↓
[Fase 1: Spec Compliance ✅]
[Fase 2: Code Quality 9/10]
[Veredicto: Aprobar]
```

### Por qué Funciona

1. **Separación de Concerns**
   - El arquitecto diseña, no implementa
   - El domain expert valida negocio, no código
   - El symfony expert implementa, siguiendo el diseño
   - El tdd expert asegura calidad técnica

2. **Checks Múltiples**
   - Diseño revisado antes de código
   - Dominio validado antes de implementar
   - Tests escritos antes de código
   - Code review en dos fases

3. **Documentación Automática**
   - Cada agente genera documentos
   - Historial de decisiones
   - Specs actualizadas

4. **Calidad Consistente**
   - Mismos estándares siempre
   - Sin "atajos" por prisa
   - TDD obligatorio

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

No necesitas TypeScript, Python, ni frameworks complejos para crear un sistema de agentes profesional.

Con Claude Code + Markdown:

1. **Define specs claras** en archivos `.md`
2. **Crea agentes especializados** — arquitecto, domain expert, framework expert, TDD expert, reviewer
3. **Usa slash commands** para ejecutar cada agente
4. **Los outputs alimentan** al siguiente agente
5. **El resultado es predecible**, consistente, y de alta calidad

### La Fórmula

```
Feature Spec + Agentes Especializados + TDD Obligatorio = Código de Calidad
```

### Resumen del Sistema

| Agente | Responsabilidad | Output |
|--------|-----------------|--------|
| Arquitecto | Diseñar antes de implementar | `docs/designs/*.md` |
| Domain Expert | Validar lógica de negocio | Modelo de dominio documentado |
| Framework Expert | Implementar con best practices | Código estructurado |
| TDD Expert | Tests primero, siempre | Código con 100% cobertura |
| Code Reviewer | Verificar spec + calidad | Feedback accionable |

Spec Driven Development es **escribir bien lo que quieres**. Los agentes especializados aseguran que **cada paso se hace correctamente**.

El código es opcional. La calidad no.

---

*¿Quieres ver estos agentes en acción? Están disponibles en el repo de [ai-explicative](https://github.com/arazvan-ec/ai-explicative). Para frameworks más avanzados, explora [Superpowers](https://github.com/obra/superpowers).*
