import { useState } from 'react'
import AlunosPage from './components/AlunosPage'
import AvaliacoesPage from './components/AvaliacoesPage'
import TurmasPage from './components/TurmasPage'
import './App.css'

type Page = 'alunos' | 'avaliacoes' | 'turmas'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('alunos')

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Aqys Alunos</h1>
        <div className="nav-buttons">
          <button
            className={currentPage === 'alunos' ? 'active' : ''}
            onClick={() => setCurrentPage('alunos')}
          >
            Alunos
          </button>
          <button
            className={currentPage === 'turmas' ? 'active' : ''}
            onClick={() => setCurrentPage('turmas')}
          >
            Turmas
          </button>
          <button
            className={currentPage === 'avaliacoes' ? 'active' : ''}
            onClick={() => setCurrentPage('avaliacoes')}
          >
            Avaliações
          </button>
        </div>
      </nav>

      <main className="content">
        {currentPage === 'alunos' && <AlunosPage />}
        {currentPage === 'turmas' && <TurmasPage />}
        {currentPage === 'avaliacoes' && <AvaliacoesPage />}
      </main>
    </div>
  )
}

export default App
