import { Before, After, setWorldConstructor } from '@cucumber/cucumber';
import { AlunoService } from '../../src/domain/AlunoService';
import { TurmaService } from '../../src/domain/TurmaService';
import { NotificacaoService } from '../../src/domain/NotificacaoService';
import {
  InMemoryAlunoRepository,
  InMemoryTurmaRepository,
  InMemoryNotificacaoRepository,
  MockEmailService,
} from './testRepositories';
import type { Aluno, Turma } from '../../src/shared/types';

export class TestWorld {
  alunoRepository: InMemoryAlunoRepository;
  turmaRepository: InMemoryTurmaRepository;
  notificacaoRepository: InMemoryNotificacaoRepository;
  emailService: MockEmailService;
  
  alunoService: AlunoService;
  turmaService: TurmaService;
  notificacaoService: NotificacaoService;

  lastError: Error | null = null;
  lastAluno: Aluno | null = null;
  lastTurma: Turma | null = null;

  constructor() {
    this.alunoRepository = new InMemoryAlunoRepository();
    this.turmaRepository = new InMemoryTurmaRepository();
    this.notificacaoRepository = new InMemoryNotificacaoRepository();
    this.emailService = new MockEmailService();

    this.alunoService = new AlunoService(this.alunoRepository);
    this.turmaService = new TurmaService(
      this.turmaRepository,
      this.alunoRepository,
      this.notificacaoRepository
    );
    this.notificacaoService = new NotificacaoService(
      this.notificacaoRepository,
      this.emailService
    );
  }

  reset(): void {
    this.alunoRepository.clear();
    this.turmaRepository.clear();
    this.notificacaoRepository.clear();
    this.emailService.clear();
    this.lastError = null;
    this.lastAluno = null;
    this.lastTurma = null;
  }
}

setWorldConstructor(TestWorld);

Before(function (this: TestWorld) {
  this.reset();
});
