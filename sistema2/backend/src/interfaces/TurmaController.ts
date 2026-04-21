import { Request, Response } from 'express';
import { TurmaService } from '../domain/TurmaService';
import { CreateTurmaDTO, UpdateTurmaDTO, MatricularAlunoDTO, AvaliarAlunoDTO, ApiResponse } from '../shared/types';

export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const turmas = await this.turmaService.getAllTurmas();
      const response: ApiResponse<typeof turmas> = { success: true, data: turmas };
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
      const turma = await this.turmaService.getTurmaById(req.params.id as string);
      if (!turma) {
        const response: ApiResponse<never> = { success: false, error: 'Turma não encontrada' };
        res.status(404).json(response);
        return;
      }
      const response: ApiResponse<typeof turma> = { success: true, data: turma };
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
      const dto: CreateTurmaDTO = req.body;
      const turma = await this.turmaService.createTurma(dto);
      const response: ApiResponse<typeof turma> = { success: true, data: turma };
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
      const dto: UpdateTurmaDTO = { id: req.params.id as string, ...req.body };
      const turma = await this.turmaService.updateTurma(dto);
      const response: ApiResponse<typeof turma> = { success: true, data: turma };
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
      await this.turmaService.deleteTurma(req.params.id as string);
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

  async matricularAluno(req: Request, res: Response): Promise<void> {
    try {
      const dto: MatricularAlunoDTO = req.body;
      const turma = await this.turmaService.matricularAluno(dto);
      const response: ApiResponse<typeof turma> = { success: true, data: turma };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(400).json(response);
    }
  }

  async desmatricularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { turmaId, alunoId } = req.params;
      const turma = await this.turmaService.desmatricularAluno(turmaId as string, alunoId as string);
      const response: ApiResponse<typeof turma> = { success: true, data: turma };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(400).json(response);
    }
  }

  async avaliarAluno(req: Request, res: Response): Promise<void> {
    try {
      const dto: AvaliarAlunoDTO = req.body;
      await this.turmaService.avaliarAluno(dto);
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
