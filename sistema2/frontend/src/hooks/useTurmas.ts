import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { turmaService } from '../services/api';
import type { CreateTurmaDTO, UpdateTurmaDTO, MatricularAlunoDTO, AvaliarAlunoDTO } from '../types';

export function useTurmas() {
  return useQuery({
    queryKey: ['turmas'],
    queryFn: turmaService.getAll,
  });
}

export function useTurma(id: string) {
  return useQuery({
    queryKey: ['turmas', id],
    queryFn: () => turmaService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTurma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTurmaDTO) => turmaService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

export function useUpdateTurma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateTurmaDTO> }) => turmaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

export function useDeleteTurma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => turmaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

export function useMatricularAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: MatricularAlunoDTO) => turmaService.matricular(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

export function useDesmatricularAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ turmaId, alunoId }: { turmaId: string; alunoId: string }) => 
      turmaService.desmatricular(turmaId, alunoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}

export function useAvaliarAluno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AvaliarAlunoDTO) => turmaService.avaliar(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turmas'] });
    },
  });
}
