import { useState } from 'react';
import { AlternativeType, CorrectionType, ExamResult } from '../types';
import { correctionService } from '../services/api';

/**
 * Página de correção de provas
 */
export default function CorrectionPage() {
  const [answerKeyCSV, setAnswerKeyCSV] = useState('');
  const [studentAnswersCSV, setStudentAnswersCSV] = useState('');
  const [correctionType, setCorrectionType] = useState(CorrectionType.STRICT);
  const [alternativeType, setAlternativeType] = useState(AlternativeType.LETTERS);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCorrect = async () => {
    if (!answerKeyCSV || !studentAnswersCSV) {
      setError('Preencha os dois CSVs');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await correctionService.correctExams(
        answerKeyCSV,
        studentAnswersCSV,
        correctionType,
        alternativeType
      );
      setResults(data);
      setSuccess(`${data.length} provas corrigidas com sucesso!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!answerKeyCSV || !studentAnswersCSV) {
      setError('Preencha os dois CSVs');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await correctionService.downloadGradesCSV(
        answerKeyCSV,
        studentAnswersCSV,
        correctionType,
        alternativeType
      );
      setSuccess('Relatório de notas baixado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = () => {
    if (results.length === 0) return 0;
    const sum = results.reduce((acc, r) => acc + r.totalScore, 0);
    return (sum / results.length).toFixed(2);
  };

  return (
    <div>
      <h1 className="mb-3">Correção de Provas</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <h2 className="card-title">Configuração da Correção</h2>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Tipo de Correção</label>
            <select
              className="form-select"
              value={correctionType}
              onChange={(e) => setCorrectionType(e.target.value as CorrectionType)}
            >
              <option value={CorrectionType.STRICT}>Estrita (erro zera a questão)</option>
              <option value={CorrectionType.PROPORTIONAL}>Proporcional (pontuação parcial)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Alternativa</label>
            <select
              className="form-select"
              value={alternativeType}
              onChange={(e) => setAlternativeType(e.target.value as AlternativeType)}
            >
              <option value={AlternativeType.LETTERS}>Letras (A, B, C...)</option>
              <option value={AlternativeType.POWERS_OF_TWO}>Potências de 2 (1, 2, 4, 8...)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">CSV do Gabarito</label>
          <textarea
            className="form-textarea"
            value={answerKeyCSV}
            onChange={(e) => setAnswerKeyCSV(e.target.value)}
            placeholder="Numero_Prova,Questao_1,Questao_2,Questao_3&#10;1,AB,C,ACD&#10;2,AC,B,ABD"
            style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
          <small className="text-secondary">Cole o conteúdo do CSV do gabarito gerado</small>
        </div>

        <div className="form-group">
          <label className="form-label">CSV das Respostas dos Alunos</label>
          <textarea
            className="form-textarea"
            value={studentAnswersCSV}
            onChange={(e) => setStudentAnswersCSV(e.target.value)}
            placeholder="Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3&#10;1,João Silva,12345678901,AB,C,ACD&#10;2,Maria Santos,98765432109,AC,B,ABD"
            style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
          />
          <small className="text-secondary">Cole o conteúdo do CSV com as respostas dos alunos</small>
        </div>

        <div className="flex">
          <button
            className="btn btn-primary"
            onClick={handleCorrect}
            disabled={loading}
          >
            {loading ? 'Corrigindo...' : '✓ Corrigir Provas'}
          </button>
          <button
            className="btn btn-success"
            onClick={handleDownloadCSV}
            disabled={loading}
          >
            📥 Baixar Relatório CSV
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="card">
          <div className="flex-between mb-3">
            <h2 className="card-title">Resultados ({results.length} alunos)</h2>
            <div className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
              Média: {calculateAverage()}
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Prova Nº</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Acertos</th>
                <th>Nota Final</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const correctQuestions = result.questionResults.filter(qr => qr.score === 1).length;
                return (
                  <tr key={`${result.examNumber}-${result.studentCPF}`}>
                    <td>{result.examNumber}</td>
                    <td>{result.studentName}</td>
                    <td>{result.studentCPF}</td>
                    <td>{correctQuestions}/{result.questionResults.length}</td>
                    <td>
                      <span className={`badge ${result.totalScore >= 7 ? 'badge-success' : result.totalScore >= 5 ? 'badge-warning' : 'badge-danger'}`}>
                        {result.totalScore.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">ℹ️ Formato dos CSVs</h2>
        
        <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Gabarito:</h3>
        <pre style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem' }}>
{`Numero_Prova,Questao_1,Questao_2,Questao_3
1,AB,C,ACD
2,AC,B,ABD`}
        </pre>

        <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Respostas dos Alunos:</h3>
        <pre style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto', fontSize: '0.75rem' }}>
{`Numero_Prova,Nome,CPF,Questao_1,Questao_2,Questao_3
1,João Silva,12345678901,AB,C,ACD
2,Maria Santos,98765432109,A,B,ABD`}
        </pre>
      </div>
    </div>
  );
}
