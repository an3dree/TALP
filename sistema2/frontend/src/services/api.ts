import type { Aluno, Turma, CreateAlunoDTO, UpdateAlunoDTO, CreateTurmaDTO, UpdateTurmaDTO, MatricularAlunoDTO, AvaliarAlunoDTO, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data.data as T;
}

// Alunos
export const alunoService = {
  getAll: () => request<Aluno[]>('/alunos'),
  getById: (id: string) => request<Aluno>(`/alunos/${id}`),
  create: (dto: CreateAlunoDTO) => request<Aluno>('/alunos', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: Partial<UpdateAlunoDTO>) => request<Aluno>(`/alunos/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => request<null>(`/alunos/${id}`, { method: 'DELETE' }),
};

// Turmas
export const turmaService = {
  getAll: () => request<Turma[]>('/turmas'),
  getById: (id: string) => request<Turma>(`/turmas/${id}`),
  create: (dto: CreateTurmaDTO) => request<Turma>('/turmas', { method: 'POST', body: JSON.stringify(dto) }),
  update: (id: string, dto: Partial<UpdateTurmaDTO>) => request<Turma>(`/turmas/${id}`, { method: 'PUT', body: JSON.stringify(dto) }),
  delete: (id: string) => request<null>(`/turmas/${id}`, { method: 'DELETE' }),
  matricular: (dto: MatricularAlunoDTO) => request<Turma>('/turmas/matricular', { method: 'POST', body: JSON.stringify(dto) }),
  desmatricular: (turmaId: string, alunoId: string) => request<Turma>(`/turmas/${turmaId}/alunos/${alunoId}`, { method: 'DELETE' }),
  avaliar: (dto: AvaliarAlunoDTO) => request<null>('/turmas/avaliar', { method: 'POST', body: JSON.stringify(dto) }),
};
