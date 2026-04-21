import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alunoService } from '../services/api';
import type { CreateAlunoDTO, UpdateAlunoDTO } from '../types';

export function useAlunos() {
  return useQuery({
    queryKey: ['alunos'],
    queryFn: alunoService.getAll,
  });
}

export function useAluno(id: string) {
  return useQuery({
    queryKey: ['alunos', id],
    queryFn: () => alunoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAlunoDTO) => alunoService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });
}

export function useUpdateAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateAlunoDTO> }) => alunoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });
}

export function useDeleteAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alunoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] });
    },
  });
}
