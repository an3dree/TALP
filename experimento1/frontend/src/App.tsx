import { useState } from 'react';
import QuestionsPage from './pages/QuestionsPage';
import ExamsPage from './pages/ExamsPage';
import GeneratePage from './pages/GeneratePage';
import CorrectionPage from './pages/CorrectionPage';
import Tabs from './components/Tabs';
import './styles/global.css';
import './styles/tabs.css';

/**
 * Componente principal da aplicação
 */
function App() {
  const [activeTab, setActiveTab] = useState('questions');

  const tabs = [
    { id: 'questions', label: '📝 Questões' },
    { id: 'exams', label: '📄 Provas' },
    { id: 'generate', label: '🎲 Gerar' },
    { id: 'correction', label: '✓ Corrigir' }
  ];

  return (
    <div>
      <header style={{
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>AqysProvas</h1>
        <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9 }}>Sistema de Gerenciamento de Provas</p>
      </header>

      <div className="container">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div style={{ marginTop: '2rem' }}>
          {activeTab === 'questions' && <QuestionsPage />}
          {activeTab === 'exams' && <ExamsPage />}
          {activeTab === 'generate' && <GeneratePage />}
          {activeTab === 'correction' && <CorrectionPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
