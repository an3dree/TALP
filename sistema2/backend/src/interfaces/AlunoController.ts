import { Request, Response } from 'express';
import { AlunoService } from '../domain/AlunoService';
import { CreateAlunoDTO, UpdateAlunoDTO, ApiResponse } from '../shared/types';

export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const alunos = await this.alunoService.getAllAlunos();
      const response: ApiResponse<typeof alunos> = { success: true, data: alunos };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const aluno = await this.alunoService.getAlunoById(req.params.id as string);
      if (!aluno) {
        const response: ApiResponse<never> = { success: false, error: 'Aluno não encontrado' };
        res.status(404).json(response);
        return;
      }
      const response: ApiResponse<typeof aluno> = { success: true, data: aluno };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateAlunoDTO = req.body;
      const aluno = await this.alunoService.createAluno(dto);
      const response: ApiResponse<typeof aluno> = { success: true, data: aluno };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(400).json(response);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const dto: UpdateAlunoDTO = { id: req.params.id as string, ...req.body };
      const aluno = await this.alunoService.updateAluno(dto);
      const response: ApiResponse<typeof aluno> = { success: true, data: aluno };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(400).json(response);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.alunoService.deleteAluno(req.params.id as string);
      const response: ApiResponse<null> = { success: true, data: null };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(400).json(response);
    }
  }
}
