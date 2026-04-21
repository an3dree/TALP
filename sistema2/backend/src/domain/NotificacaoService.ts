import { NotificacaoPendente } from '../shared/types';
import { NotificacaoRepository, EmailService } from './interfaces';

export interface NotificacaoEnviada {
  email: string;
  alteracoes: number;
  sucesso: boolean;
  erro?: string;
}

export class NotificacaoService {
  constructor(
    private readonly notificacaoRepository: NotificacaoRepository,
    private readonly emailService: EmailService
  ) {}

  async processarNotificacoesDoDia(data?: string): Promise<NotificacaoEnviada[]> {
    const dataAlvo = data || this.getDataHoje();
    const notificacoes = await this.notificacaoRepository.findAll();
    
    const notificacoesDoDia = notificacoes.filter(n => n.data === dataAlvo);
    const resultados: NotificacaoEnviada[] = [];

    for (const notificacao of notificacoesDoDia) {
      const resultado = await this.enviarNotificacao(notificacao);
      resultados.push(resultado);
    }

    if (resultados.some(r => r.sucesso)) {
      await this.notificacaoRepository.deleteByDate(dataAlvo);
    }

    return resultados;
  }

  private async enviarNotificacao(notificacao: NotificacaoPendente): Promise<NotificacaoEnviada> {
    try {
      const subject = this.gerarAssunto(notificacao);
      const body = this.gerarCorpoEmail(notificacao);

      await this.emailService.sendEmail(notificacao.email, subject, body);

      return {
        email: notificacao.email,
        alteracoes: notificacao.alteracoes.length,
        sucesso: true,
      };
    } catch (error) {
      return {
        email: notificacao.email,
        alteracoes: notificacao.alteracoes.length,
        sucesso: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  private gerarAssunto(notificacao: NotificacaoPendente): string {
    const qtdAlteracoes = notificacao.alteracoes.length;
    const dataFormatada = this.formatarData(notificacao.data);
    
    if (qtdAlteracoes === 1) {
      return `[Aqys] Avaliação atualizada - ${dataFormatada}`;
    }
    return `[Aqys] ${qtdAlteracoes} avaliações atualizadas - ${dataFormatada}`;
  }

  private gerarCorpoEmail(notificacao: NotificacaoPendente): string {
    const linhas: string[] = [
      'Olá!',
      '',
      'Suas avaliações foram atualizadas:',
      '',
    ];

    const alteracoesPorTurma = this.agruparPorTurma(notificacao.alteracoes);

    for (const [turmaTopico, alteracoes] of Object.entries(alteracoesPorTurma)) {
      linhas.push(`📚 ${turmaTopico}`);
      for (const alt of alteracoes) {
        const conceitoDescricao = this.descreverConceito(alt.conceitoNovo);
        linhas.push(`   • ${alt.meta}: ${alt.conceitoNovo} (${conceitoDescricao})`);
      }
      linhas.push('');
    }

    linhas.push('---');
    linhas.push('Sistema Aqys Alunos');

    return linhas.join('\n');
  }

  private agruparPorTurma(alteracoes: NotificacaoPendente['alteracoes']): Record<string, NotificacaoPendente['alteracoes']> {
    const agrupado: Record<string, NotificacaoPendente['alteracoes']> = {};
    
    for (const alt of alteracoes) {
      if (!agrupado[alt.turmaTopico]) {
        agrupado[alt.turmaTopico] = [];
      }
      agrupado[alt.turmaTopico].push(alt);
    }

    return agrupado;
  }

  private descreverConceito(conceito: string): string {
    const descricoes: Record<string, string> = {
      'MANA': 'Meta Ainda Não Atingida',
      'MPA': 'Meta Parcialmente Atingida',
      'MA': 'Meta Atingida',
    };
    return descricoes[conceito] || conceito;
  }

  private formatarData(dataISO: string): string {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private getDataHoje(): string {
    return new Date().toISOString().split('T')[0];
  }
}
