import { Aluno, CreateAlunoDTO, UpdateAlunoDTO } from '../shared/types';
import { AlunoRepository } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export class AlunoService {
  constructor(private readonly alunoRepository: AlunoRepository) {}

  async getAllAlunos(): Promise<Aluno[]> {
    return this.alunoRepository.findAll();
  }

  async getAlunoById(id: string): Promise<Aluno | null> {
    return this.alunoRepository.findById(id);
  }

  async createAluno(dto: CreateAlunoDTO): Promise<Aluno> {
    // Validar CPF único
    const existente = await this.alunoRepository.findByCpf(dto.cpf);
    if (existente) {
      throw new Error('CPF já cadastrado');
    }

    const aluno: Aluno = {
      id: uuidv4(),
      nome: dto.nome,
      cpf: dto.cpf,
      email: dto.email,
    };

    await this.alunoRepository.save(aluno);
    return aluno;
  }

  async updateAluno(dto: UpdateAlunoDTO): Promise<Aluno> {
    const aluno = await this.alunoRepository.findById(dto.id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Se CPF foi alterado, validar que o novo CPF não existe
    if (dto.cpf && dto.cpf !== aluno.cpf) {
      const existente = await this.alunoRepository.findByCpf(dto.cpf);
      if (existente) {
        throw new Error('CPF já cadastrado');
      }
    }

    const alunoAtualizado: Aluno = {
      ...aluno,
      ...(dto.nome && { nome: dto.nome }),
      ...(dto.cpf && { cpf: dto.cpf }),
      ...(dto.email && { email: dto.email }),
    };

    await this.alunoRepository.update(alunoAtualizado);
    return alunoAtualizado;
  }

  async deleteAluno(id: string): Promise<void> {
    const aluno = await this.alunoRepository.findById(id);
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    await this.alunoRepository.delete(id);
  }
}
