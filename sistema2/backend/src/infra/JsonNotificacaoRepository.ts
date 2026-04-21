import * as fs from 'fs/promises';
import * as path from 'path';
import { NotificacaoPendente } from '../shared/types';
import { NotificacaoRepository } from '../domain/interfaces';

export class JsonNotificacaoRepository implements NotificacaoRepository {
  private readonly filePath: string;

  constructor(dataDir: string = path.join(__dirname, '../../data')) {
    this.filePath = path.join(dataDir, 'notificacoes.json');
  }

  private async readFile(): Promise<NotificacaoPendente[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeFile(notificacoes: NotificacaoPendente[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(notificacoes, null, 2), 'utf-8');
  }

  async findAll(): Promise<NotificacaoPendente[]> {
    return this.readFile();
  }

  async findByAlunoAndDate(alunoId: string, data: string): Promise<NotificacaoPendente | null> {
    const notificacoes = await this.readFile();
    return notificacoes.find(n => n.alunoId === alunoId && n.data === data) || null;
  }

  async save(notificacao: NotificacaoPendente): Promise<void> {
    const notificacoes = await this.readFile();
    notificacoes.push(notificacao);
    await this.writeFile(notificacoes);
  }

  async update(notificacao: NotificacaoPendente): Promise<void> {
    const notificacoes = await this.readFile();
    const index = notificacoes.findIndex(n => n.alunoId === notificacao.alunoId && n.data === notificacao.data);
    if (index === -1) {
      throw new Error('Notificação não encontrada');
    }
    notificacoes[index] = notificacao;
    await this.writeFile(notificacoes);
  }

  async deleteByDate(data: string): Promise<void> {
    const notificacoes = await this.readFile();
    const filtered = notificacoes.filter(n => n.data !== data);
    await this.writeFile(filtered);
  }
}
