import { useState, useEffect } from 'react';
import { Exam, Question, AlternativeType, ExamHeader } from '../types';
import { examService, questionService } from '../services/api';

/**
 * Página de gerenciamento de provas
 */
export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    header: {
      subject: '',
      professor: '',
      date: '',
      additionalInfo: ''
    } as ExamHeader,
    questionIds: [] as string[],
    alternativeType: AlternativeType.LETTERS
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [examsData, questionsData] = await Promise.all([
        examService.getAll(),
        questionService.getAll()
      ]);
      setExams(examsData);
      setQuestions(questionsData);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await examService.update(editingId, formData.name, formData.header, formData.questionIds, formData.alternativeType);
        setSuccess('Prova atualizada com sucesso!');
      } else {
        await examService.create(formData.name, formData.header, formData.questionIds, formData.alternativeType);
        setSuccess('Prova criada com sucesso!');
      }
      resetForm();
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      name: exam.name,
      header: exam.header,
      questionIds: exam.questionIds,
      alternativeType: exam.alternativeType
    });
    setEditingId(exam.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta prova?')) return;
    try {
      await examService.delete(id);
      setSuccess('Prova removida com sucesso!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      header: {
        subject: '',
        professor: '',
        date: '',
        additionalInfo: ''
      },
      questionIds: [],
      alternativeType: AlternativeType.LETTERS
    });
    setEditingId(null);
    setShowForm(false);
  };

  const toggleQuestion = (questionId: string) => {
    const newQuestionIds = formData.questionIds.includes(questionId)
      ? formData.questionIds.filter(id => id !== questionId)
      : [...formData.questionIds, questionId];
    setFormData({ ...formData, questionIds: newQuestionIds });
  };

  if (loading) return <div className="loading">Carregando provas...</div>;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Gerenciamento de Provas</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nova Prova'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2 className="card-title">{editingId ? 'Editar Prova' : 'Nova Prova'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome da Prova</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Ex: Prova Final - Matemática"
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Disciplina</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.header.subject}
                  onChange={(e) => setFormData({ ...formData, header: { ...formData.header, subject: e.target.value }})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professor</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.header.professor}
                  onChange={(e) => setFormData({ ...formData, header: { ...formData.header, professor: e.target.value }})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.header.date}
                  onChange={(e) => setFormData({ ...formData, header: { ...formData.header, date: e.target.value }})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Identificação</label>
                <select
                  className="form-select"
                  value={formData.alternativeType}
                  onChange={(e) => setFormData({ ...formData, alternativeType: e.target.value as AlternativeType })}
                >
                  <option value={AlternativeType.LETTERS}>Letras (A, B, C...)</option>
                  <option value={AlternativeType.POWERS_OF_TWO}>Potências de 2 (1, 2, 4, 8...)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Informações Adicionais</label>
              <textarea
                className="form-textarea"
                value={formData.header.additionalInfo}
                onChange={(e) => setFormData({ ...formData, header: { ...formData.header, additionalInfo: e.target.value }})}
                placeholder="Ex: Prova sem consulta"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Questões ({formData.questionIds.length} selecionadas)</label>
              {questions.length === 0 ? (
                <p className="alert alert-info">Nenhuma questão cadastrada. Cadastre questões primeiro.</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1rem' }}>
                  {questions.map((question) => (
                    <div key={question.id} style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.questionIds.includes(question.id)}
                          onChange={() => toggleQuestion(question.id)}
                          style={{ marginRight: '0.75rem', marginTop: '0.25rem' }}
                        />
                        <div>
                          <strong>{question.statement}</strong>
                          <br />
                          <small className="text-secondary">
                            {question.alternatives.length} alternativas
                          </small>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex">
              <button type="submit" className="btn btn-primary" disabled={formData.questionIds.length === 0}>
                {editingId ? 'Atualizar' : 'Criar'} Prova
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <p>Nenhuma prova cadastrada ainda.</p>
          <p className="text-secondary">Clique em "Nova Prova" para começar.</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-title">Provas Cadastradas ({exams.length})</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Disciplina</th>
                <th>Professor</th>
                <th>Questões</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.name}</td>
                  <td>{exam.header.subject}</td>
                  <td>{exam.header.professor}</td>
                  <td>{exam.questionIds.length}</td>
                  <td>
                    <span className="badge badge-primary">
                      {exam.alternativeType === AlternativeType.LETTERS ? 'Letras' : 'Potências'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(exam)} style={{ marginRight: '0.5rem' }}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(exam.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
