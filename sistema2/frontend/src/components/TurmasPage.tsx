import { useState } from 'react';
import { useTurmas, useCreateTurma, useUpdateTurma, useDeleteTurma, useMatricularAluno, useDesmatricularAluno } from '../hooks/useTurmas';
import { useAlunos } from '../hooks/useAlunos';
import type { Turma, CreateTurmaDTO } from '../types';
import './AlunosPage.css';

export default function TurmasPage() {
  const { data: turmas, isLoading: loadingTurmas } = useTurmas();
  const { data: alunos, isLoading: loadingAlunos } = useAlunos();
  const createMutation = useCreateTurma();
  const updateMutation = useUpdateTurma();
  const deleteMutation = useDeleteTurma();
  const matricularMutation = useMatricularAluno();
  const desmatricularMutation = useDesmatricularAluno();

  const [formData, setFormData] = useState<CreateTurmaDTO>({
    topico: '',
    ano: new Date().getFullYear(),
    semestre: 1,
  });

  const [editingTurma, setEditingTurma] = useState<Turma | null>(null);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedAluno, setSelectedAluno] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTurma) {
      await updateMutation.mutateAsync({ id: editingTurma.id, data: formData });
      setEditingTurma(null);
    } else {
      await createMutation.mutateAsync(formData);
    }

    setFormData({ topico: '', ano: new Date().getFullYear(), semestre: 1 });
  };

  const handleEdit = (turma: Turma) => {
    setEditingTurma(turma);
    setFormData({ topico: turma.topico, ano: turma.ano, semestre: turma.semestre });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta turma?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleMatricular = async () => {
    if (selectedTurma && selectedAluno) {
      await matricularMutation.mutateAsync({ turmaId: selectedTurma, alunoId: selectedAluno });
      setSelectedAluno('');
    }
  };

  const handleDesmatricular = async (turmaId: string, alunoId: string) => {
    if (confirm('Deseja realmente desmatricular este aluno?')) {
      await desmatricularMutation.mutateAsync({ turmaId, alunoId });
    }
  };

  if (loadingTurmas || loadingAlunos) return <div>Carregando...</div>;

  const turmaDetalhada = turmas?.find(t => t.id === selectedTurma);

  return (
    <div className="turmas-page">
      <h2>Gerenciamento de Turmas</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Tópico"
          value={formData.topico}
          onChange={(e) => setFormData({ ...formData, topico: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Ano"
          value={formData.ano}
          onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
          required
        />
        <select
          value={formData.semestre}
          onChange={(e) => setFormData({ ...formData, semestre: parseInt(e.target.value) })}
          required
        >
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
        <button type="submit">
          {editingTurma ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editingTurma && (
          <button
            type="button"
            onClick={() => {
              setEditingTurma(null);
              setFormData({ topico: '', ano: new Date().getFullYear(), semestre: 1 });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Tópico</th>
            <th>Ano</th>
            <th>Semestre</th>
            <th>Alunos Matriculados</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas?.map((turma) => (
            <tr key={turma.id}>
              <td>{turma.topico}</td>
              <td>{turma.ano}</td>
              <td>{turma.semestre}</td>
              <td>{turma.alunosMatriculados.length}</td>
              <td>
                <button onClick={() => setSelectedTurma(turma.id)}>Ver Detalhes</button>
                <button onClick={() => handleEdit(turma)}>Editar</button>
                <button onClick={() => handleDelete(turma.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {turmaDetalhada && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Detalhes: {turmaDetalhada.topico} - {turmaDetalhada.ano}.{turmaDetalhada.semestre}</h3>
          
          <div className="form">
            <select
              value={selectedAluno}
              onChange={(e) => setSelectedAluno(e.target.value)}
            >
              <option value="">Selecione um aluno</option>
              {alunos?.filter(a => !turmaDetalhada.alunosMatriculados.includes(a.id)).map(aluno => (
                <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
              ))}
            </select>
            <button onClick={handleMatricular} disabled={!selectedAluno}>
              Matricular Aluno
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmaDetalhada.alunosMatriculados.map((alunoId) => {
                const aluno = alunos?.find(a => a.id === alunoId);
                return (
                  <tr key={alunoId}>
                    <td>{aluno?.nome || 'Aluno não encontrado'}</td>
                    <td>
                      <button onClick={() => handleDesmatricular(turmaDetalhada.id, alunoId)}>
                        Desmatricular
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
