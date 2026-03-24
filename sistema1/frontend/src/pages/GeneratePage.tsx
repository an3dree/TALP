import { useState, useEffect } from 'react';
import { Exam } from '../types';
import { examService } from '../services/api';

/**
 * Página de geração de provas individuais
 */
export default function GeneratePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await examService.getAll();
      setExams(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerate = async () => {
    if (!selectedExamId) {
      setError('Selecione uma prova');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await examService.generateIndividual(selectedExamId, count);
      setSuccess(`${count} provas individuais geradas com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!selectedExamId) {
      setError('Selecione uma prova');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await examService.downloadAnswerKeyCSV(selectedExamId, count);
      setSuccess('Gabarito baixado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-3">Gerar Provas Individuais</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h2 className="card-title">Configuração</h2>

        {exams.length === 0 ? (
          <div className="alert alert-info">
            Nenhuma prova cadastrada. Cadastre uma prova primeiro.
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Selecione a Prova</label>
              <select
                className="form-select"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} - {exam.header.subject} ({exam.questionIds.length} questões)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Número de Provas Individuais</label>
              <input
                type="number"
                className="form-input"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                min="1"
                max="100"
              />
              <small className="text-secondary">Cada prova terá questões e alternativas em ordem diferente</small>
            </div>

            <div className="flex">
              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={loading || !selectedExamId}
              >
                {loading ? 'Gerando...' : '🎲 Gerar Provas'}
              </button>
              <button
                className="btn btn-success"
                onClick={handleDownloadCSV}
                disabled={loading || !selectedExamId}
              >
                📥 Baixar Gabarito CSV
              </button>
            </div>
          </>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">ℹ️ Informações</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>Cada prova individual terá as questões em ordem aleatória</li>
          <li>As alternativas de cada questão também serão embaralhadas</li>
          <li>O gabarito CSV contém as respostas corretas para cada prova gerada</li>
          <li>Use o gabarito CSV para corrigir as respostas dos alunos</li>
        </ul>
      </div>
    </div>
  );
}
