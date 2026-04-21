import * as fs from 'fs/promises';
import * as path from 'path';
import { Aluno } from '../shared/types';
import { AlunoRepository } from '../domain/interfaces';

export class JsonAlunoRepository implements AlunoRepository {
  private readonly filePath: string;

  constructor(dataDir: string = path.join(__dirname, '../../data')) {
    this.filePath = path.join(dataDir, 'alunos.json');
  }

  private async readFile(): Promise<Aluno[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Se o arquivo não existe, retorna array vazio
      return [];
    }
  }

  private async writeFile(alunos: Aluno[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(alunos, null, 2), 'utf-8');
  }

  async findAll(): Promise<Aluno[]> {
    return this.readFile();
  }

  async findById(id: string): Promise<Aluno | null> {
    const alunos = await this.readFile();
    return alunos.find(a => a.id === id) || null;
  }

  async findByCpf(cpf: string): Promise<Aluno | null> {
    const alunos = await this.readFile();
    return alunos.find(a => a.cpf === cpf) || null;
  }

  async save(aluno: Aluno): Promise<void> {
    const alunos = await this.readFile();
    alunos.push(aluno);
    await this.writeFile(alunos);
  }

  async update(aluno: Aluno): Promise<void> {
    const alunos = await this.readFile();
    const index = alunos.findIndex(a => a.id === aluno.id);
    if (index === -1) {
      throw new Error('Aluno não encontrado');
    }
    alunos[index] = aluno;
    await this.writeFile(alunos);
  }

  async delete(id: string): Promise<void> {
    const alunos = await this.readFile();
    const filtered = alunos.filter(a => a.id !== id);
    await this.writeFile(filtered);
  }
}
