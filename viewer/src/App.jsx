import { useState, useEffect } from 'react'
import OsmaniWorkflow from './OsmaniWorkflow'
import AILoggerDashboard from './AILoggerDashboard'

function App() {
  const [view, setView] = useState('workflow')

  // Detectar hash en URL
  useEffect(() => {
    const handleHash = () => {
      setView(window.location.hash === '#dashboard' ? 'dashboard' : 'workflow')
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const changeView = (newView) => {
    window.location.hash = newView === 'dashboard' ? 'dashboard' : ''
  }

  if (view === 'dashboard') {
    return <AILoggerDashboard />
  }

  return (
    <div className="relative">
      {/* Botón flotante para ir al dashboard */}
      <button
        onClick={() => changeView('dashboard')}
        className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 transition-colors"
        title="AI Logger Dashboard"
      >
        <span className="text-xl">🤖</span>
        <span className="hidden md:inline">AI Logger</span>
      </button>
      <OsmaniWorkflow />
    </div>
  )
}

export default App
