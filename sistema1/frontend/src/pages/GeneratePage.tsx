import { useState, useEffect } from 'react';
import { Exam, GeneratedExam } from '../types';
import { examService } from '../services/api';
import { pdfService } from '../services/PdfService';

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
  const [generatedExams, setGeneratedExams] = useState<GeneratedExam[]>([]);

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
      const result = await examService.generateIndividual(selectedExamId, count);
      setGeneratedExams(result.generatedExams);
      setSuccess(`${count} provas individuais geradas com sucesso! Agora você pode baixar os PDFs.`);
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

  const handleDownloadAllPDFs = () => {
    if (generatedExams.length === 0) {
      setError('Gere as provas primeiro');
      return;
    }

    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) {
      setError('Prova não encontrada');
      return;
    }

    try {
      setLoading(true);
      setError('');
      pdfService.downloadAllExams(generatedExams, exam.header, exam.alternativeType, exam.name);
      setSuccess('PDF com todas as provas baixado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSinglePDF = (examNumber: number) => {
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) {
      setError('Prova não encontrada');
      return;
    }

    const generatedExam = generatedExams.find(ge => ge.examNumber === examNumber);
    if (!generatedExam) {
      setError('Prova gerada não encontrada');
      return;
    }

    try {
      pdfService.downloadSingleExam(generatedExam, exam.header, exam.alternativeType, exam.name);
    } catch (err: any) {
      setError(err.message);
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

      {generatedExams.length > 0 && (
        <div className="card">
          <h2 className="card-title">📄 Provas Geradas ({generatedExams.length})</h2>
          <p className="mb-3">Baixe os PDFs das provas individuais ou todas de uma vez:</p>
          
          <div className="flex mb-3">
            <button
              className="btn btn-primary"
              onClick={handleDownloadAllPDFs}
              disabled={loading}
            >
              📦 Baixar Todas as Provas (PDF Único)
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '1rem',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {generatedExams.map((exam) => (
              <button
                key={exam.examNumber}
                className="btn btn-secondary"
                onClick={() => handleDownloadSinglePDF(exam.examNumber)}
                style={{ padding: '0.75rem' }}
              >
                📄 Prova {exam.examNumber}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">ℹ️ Informações</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>Cada prova individual terá as questões em ordem aleatória</li>
          <li>As alternativas de cada questão também serão embaralhadas</li>
          <li>O gabarito CSV contém as respostas corretas para cada prova gerada</li>
          <li>Use o gabarito CSV para corrigir as respostas dos alunos</li>
          <li>Após gerar, baixe os PDFs das provas individuais ou todas de uma vez</li>
        </ul>
      </div>
    </div>
  );
}
