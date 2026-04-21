import { useState } from 'react';
import { useAlunos, useCreateAluno, useUpdateAluno, useDeleteAluno } from '../hooks/useAlunos';
import type { Aluno, CreateAlunoDTO } from '../types';
import './AlunosPage.css';

export default function AlunosPage() {
  const { data: alunos, isLoading } = useAlunos();
  const createMutation = useCreateAluno();
  const updateMutation = useUpdateAluno();
  const deleteMutation = useDeleteAluno();

  const [formData, setFormData] = useState<CreateAlunoDTO>({
    nome: '',
    cpf: '',
    email: '',
  });

  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAluno) {
      await updateMutation.mutateAsync({ id: editingAluno.id, data: formData });
      setEditingAluno(null);
    } else {
      await createMutation.mutateAsync(formData);
    }

    setFormData({ nome: '', cpf: '', email: '' });
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingAluno(aluno);
    setFormData({ nome: aluno.nome, cpf: aluno.cpf, email: aluno.email });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este aluno?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="alunos-page">
      <h2>Gerenciamento de Alunos</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nome"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">
          {editingAluno ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editingAluno && (
          <button
            type="button"
            onClick={() => {
              setEditingAluno(null);
              setFormData({ nome: '', cpf: '', email: '' });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alunos?.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.cpf}</td>
              <td>{aluno.email}</td>
              <td>
                <button onClick={() => handleEdit(aluno)}>Editar</button>
                <button onClick={() => handleDelete(aluno.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
