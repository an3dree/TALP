import { Exam } from '../models';
import { JsonRepository } from './JsonRepository';

export class ExamRepository extends JsonRepository<Exam> {
  constructor() {
    super('exams.json');
  }
}

export const examRepository = new ExamRepository();
