import express, { Request, Response } from 'express';
import cors from 'cors';
import { questionService } from './services/QuestionService';
import { examService } from './services/ExamService';
import { correctionService } from './services/CorrectionService';
import { csvService } from './services/CsvService';
import { AlternativeType, CorrectionType, Alternative } from './models';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AqysProvas API is running' });
});

// ==================== QUESTION ROUTES ====================

/**
 * Lista todas as questões
 */
app.get('/api/questions', (req: Request, res: Response) => {
  try {
    const questions = questionService.getAllQuestions();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Busca uma questão por ID
 */
app.get('/api/questions/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const question = questionService.getQuestionById(id);
    if (!question) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    res.json(question);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cria uma nova questão
 */
app.post('/api/questions', (req: Request, res: Response) => {
  try {
    const { statement, alternatives } = req.body;
    const question = questionService.createQuestion(statement, alternatives);
    res.status(201).json(question);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Atualiza uma questão existente
 */
app.put('/api/questions/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { statement, alternatives } = req.body;
    const question = questionService.updateQuestion(id, statement, alternatives);
    res.json(question);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Remove uma questão
 */
app.delete('/api/questions/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    questionService.deleteQuestion(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// ==================== EXAM ROUTES ====================

/**
 * Lista todas as provas
 */
app.get('/api/exams', (req: Request, res: Response) => {
  try {
    const exams = examService.getAllExams();
    res.json(exams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Busca uma prova por ID
 */
app.get('/api/exams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const exam = examService.getExamById(id);
    if (!exam) {
      return res.status(404).json({ error: 'Prova não encontrada' });
    }
    res.json(exam);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cria uma nova prova
 */
app.post('/api/exams', (req: Request, res: Response) => {
  try {
    const { name, header, questionIds, alternativeType } = req.body;
    const exam = examService.createExam(name, header, questionIds, alternativeType);
    res.status(201).json(exam);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Atualiza uma prova existente
 */
app.put('/api/exams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, header, questionIds, alternativeType } = req.body;
    const exam = examService.updateExam(id, name, header, questionIds, alternativeType);
    res.json(exam);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Remove uma prova
 */
app.delete('/api/exams/:id', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    examService.deleteExam(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// ==================== EXAM GENERATION ROUTES ====================

/**
 * Gera provas individuais
 */
app.post('/api/exams/:id/generate', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { count } = req.body;
    const exam = examService.getExamById(id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Prova não encontrada' });
    }

    const generatedExams = examService.generateIndividualExams(id, count);
    const answerKey = examService.generateAnswerKey(generatedExams, exam.alternativeType);

    res.json({
      generatedExams,
      answerKey
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Exporta gabarito em CSV
 */
app.post('/api/exams/:id/answer-key/csv', (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { count } = req.body;
    const exam = examService.getExamById(id);
    
    if (!exam) {
      return res.status(404).json({ error: 'Prova não encontrada' });
    }

    const generatedExams = examService.generateIndividualExams(id, count);
    const answerKey = examService.generateAnswerKey(generatedExams, exam.alternativeType);
    const csv = csvService.generateAnswerKeyCSV(answerKey);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=gabarito-${exam.name}.csv`);
    res.send(csv);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== CORRECTION ROUTES ====================

/**
 * Corrige provas a partir de CSVs
 */
app.post('/api/correction', (req: Request, res: Response) => {
  try {
    const { answerKeyCSV, studentAnswersCSV, correctionType, alternativeType } = req.body;

    const answerKey = csvService.parseAnswerKeyCSV(answerKeyCSV);
    const studentAnswers = csvService.parseStudentAnswersCSV(studentAnswersCSV);

    const results = correctionService.correctExams(
      answerKey,
      studentAnswers,
      correctionType,
      alternativeType
    );

    res.json(results);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Corrige provas e retorna relatório em CSV
 */
app.post('/api/correction/csv', (req: Request, res: Response) => {
  try {
    const { answerKeyCSV, studentAnswersCSV, correctionType, alternativeType } = req.body;

    const answerKey = csvService.parseAnswerKeyCSV(answerKeyCSV);
    const studentAnswers = csvService.parseStudentAnswersCSV(studentAnswersCSV);

    const results = correctionService.correctExams(
      answerKey,
      studentAnswers,
      correctionType,
      alternativeType
    );

    const csv = csvService.generateGradesReportCSV(results);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=relatorio-notas.csv');
    res.send(csv);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 AqysProvas Backend rodando na porta ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
