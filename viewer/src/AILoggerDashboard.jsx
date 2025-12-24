import { useState, useEffect } from 'react'

// Componente para mostrar Markdown básico
function MarkdownViewer({ content }) {
  if (!content) return null

  // Conversión básica de Markdown a HTML
  const html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-cyan-400">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-cyan-300">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 px-1 rounded text-pink-300">$1</code>')
    .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center gap-2"><span class="text-green-400">✓</span> <span class="line-through text-gray-500">$1</span></div>')
    .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center gap-2"><span class="text-gray-500">○</span> $1</div>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-500 pl-4 italic text-gray-400 my-4">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="my-2">')
    .replace(/\n/g, '<br/>')

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }}
    />
  )
}

// Card para mostrar un item (diary, article, note)
function ItemCard({ title, date, type, content, onClick }) {
  const typeColors = {
    diary: 'border-cyan-500 bg-cyan-500/10',
    article: 'border-purple-500 bg-purple-500/10',
    note: 'border-yellow-500 bg-yellow-500/10'
  }

  const typeIcons = {
    diary: '📔',
    article: '📝',
    note: '📌'
  }

  return (
    <div
      className={`border-l-4 ${typeColors[type]} p-4 rounded-r-lg cursor-pointer hover:bg-gray-800 transition-colors`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <span>{typeIcons[type]}</span>
          {title}
        </h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2">
        {content?.substring(0, 150)}...
      </p>
    </div>
  )
}

// Stats Card
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border-t-4 ${color}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  )
}

export default function AILoggerDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedItem, setSelectedItem] = useState(null)
  const [data, setData] = useState({
    diaries: [],
    articles: [],
    notes: []
  })
  const [loading, setLoading] = useState(true)

  // Cargar datos
  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      // Intentar cargar el índice de datos
      const indexResponse = await fetch('/ai-explicative/ai-logger/data/index.json')
      if (indexResponse.ok) {
        const index = await indexResponse.json()
        setData(index)
      } else {
        // Si no hay índice, mostrar datos de ejemplo
        setData({
          diaries: [{
            id: '2025-12-23',
            title: 'Diario IA - 2025-12-23',
            date: '2025-12-23',
            file: 'diary-2025-12-23.md',
            preview: 'Creamos un sistema completo de logging para documentar experiencias con Claude Code...'
          }],
          articles: [],
          notes: []
        })
      }
    } catch (error) {
      console.log('Cargando datos de ejemplo...')
      // Datos de ejemplo para demostración
      setData({
        diaries: [{
          id: '2025-12-23',
          title: 'Diario IA - 2025-12-23',
          date: '2025-12-23',
          preview: 'Creamos un sistema completo de logging para documentar experiencias con Claude Code: un plugin con slash commands, MCP server y hooks.'
        }],
        articles: [],
        notes: []
      })
    }
    setLoading(false)
  }

  async function loadItemContent(type, file) {
    try {
      const response = await fetch(`/ai-explicative/ai-logger/data/${type}/${file}`)
      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.error('Error loading content:', error)
    }
    return null
  }

  async function handleItemClick(item, type) {
    if (item.file) {
      const content = await loadItemContent(type, item.file)
      setSelectedItem({ ...item, content, type })
    } else {
      setSelectedItem({ ...item, type })
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'diaries', label: 'Diarios', icon: '📔' },
    { id: 'articles', label: 'Artículos', icon: '📝' },
    { id: 'notes', label: 'Notas', icon: '📌' }
  ]

  const totalItems = data.diaries.length + data.articles.length + data.notes.length

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                AI Logger Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Documenta tu experiencia con Claude Code
              </p>
            </div>
            <a
              href="/ai-explicative/"
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              ← Volver al Workflow
            </a>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedItem(null) }}
                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Cargando datos...</p>
          </div>
        ) : selectedItem ? (
          /* Detail View */
          <div>
            <button
              onClick={() => setSelectedItem(null)}
              className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
            >
              ← Volver a la lista
            </button>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <span className="text-gray-500">{selectedItem.date}</span>
              </div>
              <div className="border-t border-gray-700 pt-6">
                <MarkdownViewer content={selectedItem.content || selectedItem.preview} />
              </div>
            </div>
          </div>
        ) : activeTab === 'overview' ? (
          /* Overview */
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="📊" label="Total Entradas" value={totalItems} color="border-cyan-500" />
              <StatCard icon="📔" label="Diarios" value={data.diaries.length} color="border-blue-500" />
              <StatCard icon="📝" label="Artículos" value={data.articles.length} color="border-purple-500" />
              <StatCard icon="📌" label="Notas" value={data.notes.length} color="border-yellow-500" />
            </div>

            {/* Recent Activity */}
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📅</span> Actividad Reciente
            </h2>
            <div className="space-y-4">
              {data.diaries.slice(0, 3).map(diary => (
                <ItemCard
                  key={diary.id}
                  title={diary.title}
                  date={diary.date}
                  type="diary"
                  content={diary.preview}
                  onClick={() => handleItemClick(diary, 'diary')}
                />
              ))}
              {data.articles.slice(0, 3).map(article => (
                <ItemCard
                  key={article.id}
                  title={article.title}
                  date={article.date}
                  type="article"
                  content={article.preview}
                  onClick={() => handleItemClick(article, 'articles')}
                />
              ))}
              {totalItems === 0 && (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-400 mb-4">No hay entradas todavía</p>
                  <p className="text-sm text-gray-500">
                    Usa <code className="bg-gray-700 px-2 py-1 rounded">/diary</code> o{' '}
                    <code className="bg-gray-700 px-2 py-1 rounded">/log</code> en Claude Code
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <span>⚡</span> Comandos Disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { cmd: '/setup', desc: 'Configura el entorno', icon: '🔧' },
                { cmd: '/diary', desc: 'Genera diario de sesión', icon: '📔' },
                { cmd: '/article [tema]', desc: 'Crea artículo para blog', icon: '📝' },
                { cmd: '/log [nota]', desc: 'Guarda nota rápida', icon: '📌' }
              ].map(item => (
                <div key={item.cmd} className="bg-gray-800 rounded-lg p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <code className="text-cyan-400">{item.cmd}</code>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* List Views */
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>{tabs.find(t => t.id === activeTab)?.icon}</span>
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="space-y-4">
              {activeTab === 'diaries' && data.diaries.map(item => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  type="diary"
                  content={item.preview}
                  onClick={() => handleItemClick(item, 'diary')}
                />
              ))}
              {activeTab === 'articles' && data.articles.map(item => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  type="article"
                  content={item.preview}
                  onClick={() => handleItemClick(item, 'articles')}
                />
              ))}
              {activeTab === 'notes' && data.notes.map(item => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  date={item.date}
                  type="note"
                  content={item.preview}
                  onClick={() => handleItemClick(item, 'notes')}
                />
              ))}
              {((activeTab === 'diaries' && data.diaries.length === 0) ||
                (activeTab === 'articles' && data.articles.length === 0) ||
                (activeTab === 'notes' && data.notes.length === 0)) && (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                  <div className="text-4xl mb-4">📭</div>
                  <p className="text-gray-400">No hay {activeTab} todavía</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          AI Logger Dashboard • Documenta tu experiencia con IA
        </div>
      </footer>
    </div>
  )
}
