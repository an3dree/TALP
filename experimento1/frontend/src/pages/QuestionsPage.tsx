import { useState, useEffect } from 'react';
import { Question, Alternative } from '../types';
import { questionService } from '../services/api';

/**
 * Página de gerenciamento de questões
 */
export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    statement: '',
    alternatives: [
      { description: '', shouldBeMarked: false },
      { description: '', shouldBeMarked: false }
    ] as Alternative[]
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getAll();
      setQuestions(data);
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
        await questionService.update(editingId, formData.statement, formData.alternatives);
        setSuccess('Questão atualizada com sucesso!');
      } else {
        await questionService.create(formData.statement, formData.alternatives);
        setSuccess('Questão criada com sucesso!');
      }
      resetForm();
      loadQuestions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (question: Question) => {
    setFormData({
      statement: question.statement,
      alternatives: question.alternatives.map(alt => ({
        description: alt.description,
        shouldBeMarked: alt.shouldBeMarked
      }))
    });
    setEditingId(question.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta questão?')) return;
    try {
      await questionService.delete(id);
      setSuccess('Questão removida com sucesso!');
      loadQuestions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      statement: '',
      alternatives: [
        { description: '', shouldBeMarked: false },
        { description: '', shouldBeMarked: false }
      ]
    });
    setEditingId(null);
    setShowForm(false);
  };

  const addAlternative = () => {
    setFormData({
      ...formData,
      alternatives: [...formData.alternatives, { description: '', shouldBeMarked: false }]
    });
  };

  const removeAlternative = (index: number) => {
    setFormData({
      ...formData,
      alternatives: formData.alternatives.filter((_, i) => i !== index)
    });
  };

  const updateAlternative = (index: number, field: keyof Alternative, value: any) => {
    const newAlternatives = [...formData.alternatives];
    newAlternatives[index] = { ...newAlternatives[index], [field]: value };
    setFormData({ ...formData, alternatives: newAlternatives });
  };

  if (loading) return <div className="loading">Carregando questões...</div>;

  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Gerenciamento de Questões</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nova Questão'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="card">
          <h2 className="card-title">{editingId ? 'Editar Questão' : 'Nova Questão'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Enunciado</label>
              <textarea
                className="form-textarea"
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                required
                placeholder="Digite o enunciado da questão"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alternativas</label>
              {formData.alternatives.map((alt, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    className="form-input"
                    value={alt.description}
                    onChange={(e) => updateAlternative(index, 'description', e.target.value)}
                    placeholder={`Alternativa ${index + 1}`}
                    required
                  />
                  <label style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', whiteSpace: 'nowrap' }}>
                    <input
                      type="checkbox"
                      checked={alt.shouldBeMarked}
                      onChange={(e) => updateAlternative(index, 'shouldBeMarked', e.target.checked)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Correta
                  </label>
                  {formData.alternatives.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeAlternative(index)}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline mt-2" onClick={addAlternative}>
                + Adicionar Alternativa
              </button>
            </div>

            <div className="flex">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Atualizar' : 'Criar'} Questão
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>Nenhuma questão cadastrada ainda.</p>
          <p className="text-secondary">Clique em "Nova Questão" para começar.</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="card-title">Questões Cadastradas ({questions.length})</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Enunciado</th>
                <th>Alternativas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id}>
                  <td>{question.statement}</td>
                  <td>
                    {question.alternatives.length} alternativas
                    <br />
                    <small className="text-secondary">
                      {question.alternatives.filter(a => a.shouldBeMarked).length} correta(s)
                    </small>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(question)} style={{ marginRight: '0.5rem' }}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(question.id)}>
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
