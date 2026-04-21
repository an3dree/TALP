import { useState } from 'react';
import { useTurmas } from '../hooks/useTurmas';
import { useAlunos } from '../hooks/useAlunos';
import { useAvaliarAluno } from '../hooks/useTurmas';
import type { Conceito } from '../types';
import './AlunosPage.css';

export default function AvaliacoesPage() {
  const { data: turmas, isLoading: loadingTurmas } = useTurmas();
  const { data: alunos, isLoading: loadingAlunos } = useAlunos();
  const avaliarMutation = useAvaliarAluno();

  const [selectedTurma, setSelectedTurma] = useState<string>('');
  
  const metas = ['Requisitos', 'Testes', 'Implementação', 'Documentação'];

  const handleAvaliar = async (alunoId: string, meta: string, conceito: Conceito) => {
    if (selectedTurma) {
      await avaliarMutation.mutateAsync({
        turmaId: selectedTurma,
        alunoId,
        meta,
        conceito,
      });
    }
  };

  if (loadingTurmas || loadingAlunos) return <div>Carregando...</div>;

  const turma = turmas?.find(t => t.id === selectedTurma);
  const alunosMatriculados = alunos?.filter(a => turma?.alunosMatriculados.includes(a.id)) || [];

  const getConceito = (alunoId: string, meta: string): Conceito | null => {
    const avaliacao = turma?.avaliacoes.find(av => av.alunoId === alunoId && av.meta === meta);
    return avaliacao?.conceito || null;
  };

  return (
    <div className="avaliacoes-page">
      <h2>Avaliações dos Alunos</h2>

      <div className="form">
        <select
          value={selectedTurma}
          onChange={(e) => setSelectedTurma(e.target.value)}
        >
          <option value="">Selecione uma turma</option>
          {turmas?.map(turma => (
            <option key={turma.id} value={turma.id}>
              {turma.topico} - {turma.ano}.{turma.semestre}
            </option>
          ))}
        </select>
      </div>

      {turma && alunosMatriculados.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Aluno</th>
                {metas.map(meta => (
                  <th key={meta}>{meta}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alunosMatriculados.map(aluno => (
                <tr key={aluno.id}>
                  <td><strong>{aluno.nome}</strong></td>
                  {metas.map(meta => {
                    const conceitoAtual = getConceito(aluno.id, meta);
                    return (
                      <td key={meta}>
                        <div className="conceito-selector">
                          {(['MANA', 'MPA', 'MA'] as Conceito[]).map(conceito => (
                            <button
                              key={conceito}
                              className={`conceito-btn ${conceito} ${conceitoAtual === conceito ? 'selected' : ''}`}
                              onClick={() => handleAvaliar(aluno.id, meta, conceito)}
                            >
                              {conceito}
                            </button>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {turma && alunosMatriculados.length === 0 && (
        <p>Nenhum aluno matriculado nesta turma.</p>
      )}
    </div>
  );
}
