import { Aluno, Turma, NotificacaoPendente } from '../shared/types';

export interface AlunoRepository {
  findAll(): Promise<Aluno[]>;
  findById(id: string): Promise<Aluno | null>;
  findByCpf(cpf: string): Promise<Aluno | null>;
  save(aluno: Aluno): Promise<void>;
  update(aluno: Aluno): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface TurmaRepository {
  findAll(): Promise<Turma[]>;
  findById(id: string): Promise<Turma | null>;
  save(turma: Turma): Promise<void>;
  update(turma: Turma): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface NotificacaoRepository {
  findAll(): Promise<NotificacaoPendente[]>;
  findByAlunoAndDate(alunoId: string, data: string): Promise<NotificacaoPendente | null>;
  save(notificacao: NotificacaoPendente): Promise<void>;
  update(notificacao: NotificacaoPendente): Promise<void>;
  deleteByDate(data: string): Promise<void>;
}

export interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}
