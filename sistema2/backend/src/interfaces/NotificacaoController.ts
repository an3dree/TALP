import { Request, Response } from 'express';
import { NotificacaoService } from '../domain/NotificacaoService';
import type { ApiResponse } from '../shared/types';

export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  async enviarNotificacoesDoDia(req: Request, res: Response): Promise<void> {
    try {
      const data = req.query.data as string | undefined;
      const resultados = await this.notificacaoService.processarNotificacoesDoDia(data);
      
      const response: ApiResponse<typeof resultados> = { 
        success: true, 
        data: resultados 
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<never> = { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
      res.status(500).json(response);
    }
  }
}
