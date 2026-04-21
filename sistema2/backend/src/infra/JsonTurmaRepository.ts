import * as fs from 'fs/promises';
import * as path from 'path';
import { Turma } from '../shared/types';
import { TurmaRepository } from '../domain/interfaces';

export class JsonTurmaRepository implements TurmaRepository {
  private readonly filePath: string;

  constructor(dataDir: string = path.join(__dirname, '../../data')) {
    this.filePath = path.join(dataDir, 'turmas.json');
  }

  private async readFile(): Promise<Turma[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async writeFile(turmas: Turma[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(turmas, null, 2), 'utf-8');
  }

  async findAll(): Promise<Turma[]> {
    return this.readFile();
  }

  async findById(id: string): Promise<Turma | null> {
    const turmas = await this.readFile();
    return turmas.find(t => t.id === id) || null;
  }

  async save(turma: Turma): Promise<void> {
    const turmas = await this.readFile();
    turmas.push(turma);
    await this.writeFile(turmas);
  }

  async update(turma: Turma): Promise<void> {
    const turmas = await this.readFile();
    const index = turmas.findIndex(t => t.id === turma.id);
    if (index === -1) {
      throw new Error('Turma não encontrada');
    }
    turmas[index] = turma;
    await this.writeFile(turmas);
  }

  async delete(id: string): Promise<void> {
    const turmas = await this.readFile();
    const filtered = turmas.filter(t => t.id !== id);
    await this.writeFile(filtered);
  }
}
