import { Question } from '../models';
import { JsonRepository } from './JsonRepository';

export class QuestionRepository extends JsonRepository<Question> {
  constructor() {
    super('questions.json');
  }
}

export const questionRepository = new QuestionRepository();
