import express from 'express';
import cors from 'cors';
import path from 'path';
import { AlunoController } from './interfaces/AlunoController';
import { TurmaController } from './interfaces/TurmaController';
import { NotificacaoController } from './interfaces/NotificacaoController';
import { AlunoService } from './domain/AlunoService';
import { TurmaService } from './domain/TurmaService';
import { NotificacaoService } from './domain/NotificacaoService';
import { JsonAlunoRepository } from './infra/JsonAlunoRepository';
import { JsonTurmaRepository } from './infra/JsonTurmaRepository';
import { JsonNotificacaoRepository } from './infra/JsonNotificacaoRepository';
import { ConsoleEmailService } from './infra/ConsoleEmailService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Repositories
const alunoRepository = new JsonAlunoRepository();
const turmaRepository = new JsonTurmaRepository();
const notificacaoRepository = new JsonNotificacaoRepository();
const emailService = new ConsoleEmailService();

// Services
const alunoService = new AlunoService(alunoRepository);
const turmaService = new TurmaService(turmaRepository, alunoRepository, notificacaoRepository);
const notificacaoService = new NotificacaoService(notificacaoRepository, emailService);

// Controllers
const alunoController = new AlunoController(alunoService);
const turmaController = new TurmaController(turmaService);
const notificacaoController = new NotificacaoController(notificacaoService);

// Routes - Alunos
app.get('/api/alunos', (req, res) => alunoController.getAll(req, res));
app.get('/api/alunos/:id', (req, res) => alunoController.getById(req, res));
app.post('/api/alunos', (req, res) => alunoController.create(req, res));
app.put('/api/alunos/:id', (req, res) => alunoController.update(req, res));
app.delete('/api/alunos/:id', (req, res) => alunoController.delete(req, res));

// Routes - Turmas
app.get('/api/turmas', (req, res) => turmaController.getAll(req, res));
app.get('/api/turmas/:id', (req, res) => turmaController.getById(req, res));
app.post('/api/turmas', (req, res) => turmaController.create(req, res));
app.put('/api/turmas/:id', (req, res) => turmaController.update(req, res));
app.delete('/api/turmas/:id', (req, res) => turmaController.delete(req, res));

// Routes - Matrícula
app.post('/api/turmas/matricular', (req, res) => turmaController.matricularAluno(req, res));
app.delete('/api/turmas/:turmaId/alunos/:alunoId', (req, res) => turmaController.desmatricularAluno(req, res));

// Routes - Avaliação
app.post('/api/turmas/avaliar', (req, res) => turmaController.avaliarAluno(req, res));

// Routes - Notificações (envio de emails)
app.post('/api/notificacoes/enviar', (req, res) => notificacaoController.enviarNotificacoesDoDia(req, res));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});
