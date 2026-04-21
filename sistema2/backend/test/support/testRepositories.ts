import { Aluno, Turma, NotificacaoPendente } from '../../src/shared/types';
import { AlunoRepository, TurmaRepository, NotificacaoRepository, EmailService } from '../../src/domain/interfaces';

export class InMemoryAlunoRepository implements AlunoRepository {
  private alunos: Aluno[] = [];

  async findAll(): Promise<Aluno[]> {
    return [...this.alunos];
  }

  async findById(id: string): Promise<Aluno | null> {
    return this.alunos.find(a => a.id === id) || null;
  }

  async findByCpf(cpf: string): Promise<Aluno | null> {
    return this.alunos.find(a => a.cpf === cpf) || null;
  }

  async save(aluno: Aluno): Promise<void> {
    this.alunos.push(aluno);
  }

  async update(aluno: Aluno): Promise<void> {
    const index = this.alunos.findIndex(a => a.id === aluno.id);
    if (index !== -1) {
      this.alunos[index] = aluno;
    }
  }

  async delete(id: string): Promise<void> {
    this.alunos = this.alunos.filter(a => a.id !== id);
  }

  clear(): void {
    this.alunos = [];
  }
}

export class InMemoryTurmaRepository implements TurmaRepository {
  private turmas: Turma[] = [];

  async findAll(): Promise<Turma[]> {
    return [...this.turmas];
  }

  async findById(id: string): Promise<Turma | null> {
    return this.turmas.find(t => t.id === id) || null;
  }

  async save(turma: Turma): Promise<void> {
    this.turmas.push(turma);
  }

  async update(turma: Turma): Promise<void> {
    const index = this.turmas.findIndex(t => t.id === turma.id);
    if (index !== -1) {
      this.turmas[index] = turma;
    }
  }

  async delete(id: string): Promise<void> {
    this.turmas = this.turmas.filter(t => t.id !== id);
  }

  clear(): void {
    this.turmas = [];
  }
}

export class InMemoryNotificacaoRepository implements NotificacaoRepository {
  private notificacoes: NotificacaoPendente[] = [];

  async findAll(): Promise<NotificacaoPendente[]> {
    return [...this.notificacoes];
  }

  async findByAlunoAndDate(alunoId: string, data: string): Promise<NotificacaoPendente | null> {
    return this.notificacoes.find(n => n.alunoId === alunoId && n.data === data) || null;
  }

  async save(notificacao: NotificacaoPendente): Promise<void> {
    this.notificacoes.push(notificacao);
  }

  async update(notificacao: NotificacaoPendente): Promise<void> {
    const index = this.notificacoes.findIndex(n => 
      n.alunoId === notificacao.alunoId && n.data === notificacao.data
    );
    if (index !== -1) {
      this.notificacoes[index] = notificacao;
    }
  }

  async deleteByDate(data: string): Promise<void> {
    this.notificacoes = this.notificacoes.filter(n => n.data !== data);
  }

  clear(): void {
    this.notificacoes = [];
  }
}

export interface EmailEnviado {
  to: string;
  subject: string;
  body: string;
}

export class MockEmailService implements EmailService {
  private emailsEnviados: EmailEnviado[] = [];

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    this.emailsEnviados.push({ to, subject, body });
  }

  getEmailsEnviados(): EmailEnviado[] {
    return [...this.emailsEnviados];
  }

  clear(): void {
    this.emailsEnviados = [];
  }
}
