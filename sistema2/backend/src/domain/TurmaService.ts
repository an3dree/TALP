import { Turma, CreateTurmaDTO, UpdateTurmaDTO, MatricularAlunoDTO, AvaliarAlunoDTO, Avaliacao, NotificacaoPendente } from '../shared/types';
import { TurmaRepository, AlunoRepository, NotificacaoRepository } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export class TurmaService {
  constructor(
    private readonly turmaRepository: TurmaRepository,
    private readonly alunoRepository: AlunoRepository,
    private readonly notificacaoRepository: NotificacaoRepository
  ) {}

  async getAllTurmas(): Promise<Turma[]> {
    return this.turmaRepository.findAll();
  }

  async getTurmaById(id: string): Promise<Turma | null> {
    return this.turmaRepository.findById(id);
  }

  async createTurma(dto: CreateTurmaDTO): Promise<Turma> {
    const turma: Turma = {
      id: uuidv4(),
      topico: dto.topico,
      ano: dto.ano,
      semestre: dto.semestre,
      alunosMatriculados: [],
      avaliacoes: [],
    };

    await this.turmaRepository.save(turma);
    return turma;
  }

  async updateTurma(dto: UpdateTurmaDTO): Promise<Turma> {
    const turma = await this.turmaRepository.findById(dto.id);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const turmaAtualizada: Turma = {
      ...turma,
      ...(dto.topico && { topico: dto.topico }),
      ...(dto.ano && { ano: dto.ano }),
      ...(dto.semestre && { semestre: dto.semestre }),
    };

    await this.turmaRepository.update(turmaAtualizada);
    return turmaAtualizada;
  }

  async deleteTurma(id: string): Promise<void> {
    const turma = await this.turmaRepository.findById(id);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }
    await this.turmaRepository.delete(id);
  }

  async matricularAluno(dto: MatricularAlunoDTO): Promise<Turma> {
    const turma = await this.turmaRepository.findById(dto.turmaId);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const aluno = await this.alunoRepository.findById(dto.alunoId);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    if (turma.alunosMatriculados.includes(dto.alunoId)) {
      throw new Error('Aluno já matriculado nesta turma');
    }

    turma.alunosMatriculados.push(dto.alunoId);
    await this.turmaRepository.update(turma);
    return turma;
  }

  async desmatricularAluno(turmaId: string, alunoId: string): Promise<Turma> {
    const turma = await this.turmaRepository.findById(turmaId);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    turma.alunosMatriculados = turma.alunosMatriculados.filter(id => id !== alunoId);
    turma.avaliacoes = turma.avaliacoes.filter(av => av.alunoId !== alunoId);
    
    await this.turmaRepository.update(turma);
    return turma;
  }

  async avaliarAluno(dto: AvaliarAlunoDTO): Promise<void> {
    const turma = await this.turmaRepository.findById(dto.turmaId);
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const aluno = await this.alunoRepository.findById(dto.alunoId);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    if (!turma.alunosMatriculados.includes(dto.alunoId)) {
      throw new Error('Aluno não matriculado nesta turma');
    }

    // Remove avaliação anterior da mesma meta para o mesmo aluno
    turma.avaliacoes = turma.avaliacoes.filter(
      av => !(av.alunoId === dto.alunoId && av.meta === dto.meta)
    );

    const novaAvaliacao: Avaliacao = {
      alunoId: dto.alunoId,
      meta: dto.meta,
      conceito: dto.conceito,
      dataModificacao: new Date().toISOString(),
    };

    turma.avaliacoes.push(novaAvaliacao);
    await this.turmaRepository.update(turma);

    // Adicionar notificação pendente
    await this.adicionarNotificacao(aluno.email, dto.alunoId, dto.turmaId, turma.topico, dto.meta, dto.conceito);
  }

  private async adicionarNotificacao(
    email: string,
    alunoId: string,
    turmaId: string,
    turmaTopico: string,
    meta: string,
    conceitoNovo: string
  ): Promise<void> {
    const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let notificacao = await this.notificacaoRepository.findByAlunoAndDate(alunoId, hoje);

    if (!notificacao) {
      notificacao = {
        alunoId,
        email,
        data: hoje,
        alteracoes: [],
      };
    }

    // Remove alteração anterior da mesma turma e meta (se existir)
    notificacao.alteracoes = notificacao.alteracoes.filter(
      alt => !(alt.turmaId === turmaId && alt.meta === meta)
    );

    notificacao.alteracoes.push({
      turmaId,
      turmaTopico,
      meta,
      conceitoNovo: conceitoNovo as 'MANA' | 'MPA' | 'MA',
    });

    if (notificacao.alteracoes.length === 1) {
      await this.notificacaoRepository.save(notificacao);
    } else {
      await this.notificacaoRepository.update(notificacao);
    }
  }
}
