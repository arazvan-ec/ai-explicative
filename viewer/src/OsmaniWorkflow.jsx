import React, { useState } from 'react';

const OsmaniWorkflow = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [activePhase, setActivePhase] = useState('all');

  const phases = {
    planning: { color: 'bg-blue-500', label: 'Planificación', icon: '📋' },
    execution: { color: 'bg-green-500', label: 'Ejecución', icon: '⚡' },
    quality: { color: 'bg-purple-500', label: 'Calidad', icon: '✅' },
    mindset: { color: 'bg-orange-500', label: 'Mentalidad', icon: '🧠' }
  };

  const steps = [
    {
      id: 1,
      phase: 'planning',
      title: '1. Planifica Primero',
      subtitle: 'Specs antes de código',
      icon: '📝',
      keyPoints: [
        'Crea un spec.md detallado con requisitos',
        'Haz que el LLM te haga preguntas para refinar',
        'Genera un plan de proyecto paso a paso',
        '"Waterfall en 15 minutos" - planificación rápida estructurada'
      ],
      example: 'Prompt: "Iterativamente hazme preguntas hasta definir requisitos y casos edge"',
      antiPattern: '❌ Lanzar deseos vagos al LLM sin contexto'
    },
    {
      id: 2,
      phase: 'execution',
      title: '2. Divide en Trozos Pequeños',
      subtitle: 'Iteraciones manejables',
      icon: '🧩',
      keyPoints: [
        'Una función, un bug, una feature a la vez',
        'Evita outputs monolíticos grandes',
        'Lleva el contexto de lo construido entre iteraciones',
        'Compatible con TDD - tests por cada pieza'
      ],
      example: 'Prompt: "Implementemos el Paso 1 del plan" → test → "Ahora Paso 2"',
      antiPattern: '❌ Pedir apps enteras = "10 devs sin comunicarse"'
    },
    {
      id: 3,
      phase: 'execution',
      title: '3. Provee Contexto Extenso',
      subtitle: 'El LLM es tan bueno como su contexto',
      icon: '📚',
      keyPoints: [
        'Incluye código relevante, docs y restricciones',
        'Usa herramientas como gitingest o repo2txt',
        'Implementa Claude Skills para conocimiento reutilizable',
        'Guía con comentarios inline y reglas en el prompt'
      ],
      example: 'Brain dump: objetivos, invariantes, ejemplos buenos, enfoques a evitar',
      antiPattern: '❌ Hacer que el AI opere con información parcial'
    },
    {
      id: 4,
      phase: 'execution',
      title: '4. Elige el Modelo Correcto',
      subtitle: 'Usa múltiples si es necesario',
      icon: '🔄',
      keyPoints: [
        'Cada modelo tiene su "personalidad"',
        'Si uno se atasca, prueba otro',
        'Usa la mejor versión disponible (tiers pro)',
        'Cross-check con modelos paralelos'
      ],
      example: 'Claude escribe → Gemini revisa, o viceversa',
      antiPattern: '❌ Quedarse atascado con un solo modelo'
    },
    {
      id: 5,
      phase: 'execution',
      title: '5. AI en Todo el Ciclo',
      subtitle: 'Herramientas especializadas',
      icon: '🔧',
      keyPoints: [
        'CLI: Claude Code, Codex CLI, Gemini CLI',
        'Agentes async: Jules, Copilot Agent (PRs automáticos)',
        'IDE: Cursor, Copilot, Windsurf',
        'Supervisión activa - no son infalibles'
      ],
      example: '~90% del código de Claude Code está escrito por Claude Code',
      antiPattern: '❌ Dejar agentes trabajar sin supervisión'
    },
    {
      id: 6,
      phase: 'quality',
      title: '6. Humano en el Loop',
      subtitle: 'Verifica, testea, revisa TODO',
      icon: '👁️',
      keyPoints: [
        'Trata cada output como de un junior developer',
        'Lee el código línea por línea',
        'Usa Chrome DevTools MCP para debugging',
        'AI revisando AI puede captar errores sutiles'
      ],
      example: 'Si algo es confuso: "Añade comentarios explicando" o reescríbelo',
      antiPattern: '❌ Merge código sin entenderlo'
    },
    {
      id: 7,
      phase: 'quality',
      title: '7. Commits Frecuentes',
      subtitle: 'Git como red de seguridad',
      icon: '💾',
      keyPoints: [
        'Commits como "save points" en un juego',
        'Ultra-granular: después de cada tarea pequeña',
        'Usa branches/worktrees para experimentos AI',
        'Nunca commitear código que no puedas explicar'
      ],
      example: 'Finish task → run tests → commit → next task',
      antiPattern: '❌ Un giant commit "AI changes"'
    },
    {
      id: 8,
      phase: 'planning',
      title: '8. Personaliza el Comportamiento',
      subtitle: 'Reglas, ejemplos y archivos de config',
      icon: '⚙️',
      keyPoints: [
        'CLAUDE.md / GEMINI.md con reglas del proyecto',
        'Custom instructions en Copilot/Cursor',
        'Ejemplos inline del formato deseado',
        '"No hallucination" clauses en prompts'
      ],
      example: '"Si no estás seguro, pregunta en vez de inventar"',
      antiPattern: '❌ Aceptar el estilo default del AI'
    },
    {
      id: 9,
      phase: 'quality',
      title: '9. Testing & Automation',
      subtitle: 'Multiplicadores de fuerza',
      icon: '🔬',
      keyPoints: [
        'CI/CD robusto en cada repo con AI',
        'Linters y type checkers como guías',
        'Feedback logs de fallos al AI para debug',
        'AI-on-AI code reviews'
      ],
      example: 'AI abre PR → CI falla → feedback al AI → fix → iterate',
      antiPattern: '❌ Sin tests = bugs sutiles pasan'
    },
    {
      id: 10,
      phase: 'mindset',
      title: '10. Aprende Continuamente',
      subtitle: 'AI amplifica tus habilidades',
      icon: '📈',
      keyPoints: [
        'AI expone nuevos lenguajes y técnicas',
        'Prácticas senior = mejores resultados con AI',
        'Revisa código AI → aprendes nuevos idioms',
        'Codea sin AI ocasionalmente para mantener skills'
      ],
      example: 'Pide al AI que explique su código - como entrevistar candidatos',
      antiPattern: '❌ Depender sin entender = Dunning-Kruger'
    }
  ];

  const coreMessage = {
    title: 'Filosofía Central',
    quote: '"El LLM es un pair programmer poderoso que requiere dirección clara, contexto y supervisión — no juicio autónomo"',
    author: '— Addy Osmani'
  };

  const filteredSteps = activePhase === 'all'
    ? steps
    : steps.filter(s => s.phase === activePhase);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            LLM Coding Workflow 2026
          </h1>
          <p className="text-gray-400">Flujo de trabajo de Addy Osmani para desarrollo asistido por IA</p>
        </div>

        {/* Core Philosophy */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💡</span>
            <h2 className="text-xl font-semibold text-blue-300">{coreMessage.title}</h2>
          </div>
          <blockquote className="text-lg italic text-gray-300 border-l-4 border-blue-500 pl-4">
            {coreMessage.quote}
          </blockquote>
          <p className="text-right text-gray-500 mt-2">{coreMessage.author}</p>
        </div>

        {/* Phase Filter */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => setActivePhase('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activePhase === 'all'
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📊 Todos
          </button>
          {Object.entries(phases).map(([key, { label, icon }]) => (
            <button
              key={key}
              onClick={() => setActivePhase(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activePhase === key
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSteps.map((step) => (
            <div
              key={step.id}
              onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              className={`bg-gray-800 rounded-xl p-5 cursor-pointer transition-all duration-300 border-2 ${
                activeStep === step.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${phases[step.phase].color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${phases[step.phase].color} bg-opacity-20 text-gray-300`}>
                      {phases[step.phase].label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{step.subtitle}</p>

                  {activeStep === step.id && (
                    <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                      <div>
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Puntos Clave:</h4>
                        <ul className="space-y-1">
                          {step.keyPoints.map((point, i) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-green-400 mb-1">💡 Ejemplo:</h4>
                        <p className="text-sm text-gray-300 font-mono">{step.example}</p>
                      </div>

                      <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                        <h4 className="text-sm font-medium text-red-400 mb-1">Anti-patrón:</h4>
                        <p className="text-sm text-gray-300">{step.antiPattern}</p>
                      </div>
                    </div>
                  )}

                  {activeStep !== step.id && (
                    <p className="text-xs text-gray-500 mt-2">Click para expandir →</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="mt-10 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-center">🔄 Flujo de Trabajo Visual</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
            {[
              { step: 'Spec.md', icon: '📝', color: 'bg-blue-500' },
              { step: '→', icon: '', color: '' },
              { step: 'Plan', icon: '📋', color: 'bg-blue-500' },
              { step: '→', icon: '', color: '' },
              { step: 'Chunk 1', icon: '🧩', color: 'bg-green-500' },
              { step: '→', icon: '', color: '' },
              { step: 'Test', icon: '🔬', color: 'bg-purple-500' },
              { step: '→', icon: '', color: '' },
              { step: 'Review', icon: '👁️', color: 'bg-purple-500' },
              { step: '→', icon: '', color: '' },
              { step: 'Commit', icon: '💾', color: 'bg-purple-500' },
              { step: '↩️', icon: '', color: '' },
            ].map((item, i) => (
              item.color ? (
                <div key={i} className={`${item.color} px-3 py-2 rounded-lg flex items-center gap-2`}>
                  <span>{item.icon}</span>
                  <span>{item.step}</span>
                </div>
              ) : (
                <span key={i} className="text-gray-500 text-lg">{item.step}</span>
              )
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Repetir para cada chunk hasta completar el plan
          </p>
        </div>

        {/* Tools Mentioned */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-blue-400 mb-3">🖥️ CLI Agents</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Claude Code</li>
              <li>• Codex CLI (OpenAI)</li>
              <li>• Gemini CLI</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-green-400 mb-3">🤖 Async Agents</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Jules (Google)</li>
              <li>• GitHub Copilot Agent</li>
              <li>• Conductor (orchestration)</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-purple-400 mb-3">📁 Context Tools</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Claude Skills</li>
              <li>• gitingest / repo2txt</li>
              <li>• Chrome DevTools MCP</li>
            </ul>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="mt-8 bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-xl p-6 border border-green-500/30 text-center">
          <h2 className="text-xl font-bold mb-2">🎯 Conclusión Principal</h2>
          <p className="text-lg text-gray-300">
            "AI coding assistants son <span className="text-green-400 font-semibold">multiplicadores de fuerza increíbles</span>,
            pero el <span className="text-blue-400 font-semibold">ingeniero humano sigue siendo el director del show</span>."
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Basado en el artículo de Addy Osmani (Engineering Leader @ Google Chrome)</p>
          <p className="mt-1">Libro: "Beyond Vibe Coding" - O'Reilly</p>
        </div>
      </div>
    </div>
  );
};

export default OsmaniWorkflow;
