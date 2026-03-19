import { randomUUID } from 'crypto';

/**
 * Gera um ID único usando UUID v4
 */
export function generateId(): string {
  return randomUUID();
}

/**
 * Embaralha um array usando o algoritmo Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Converte um número para letra (0=A, 1=B, etc.)
 */
export function numberToLetter(num: number): string {
  return String.fromCharCode(65 + num); // 65 é o código ASCII de 'A'
}

/**
 * Converte um número para potência de 2 (0=1, 1=2, 2=4, etc.)
 */
export function numberToPowerOfTwo(num: number): number {
  return Math.pow(2, num);
}

/**
 * Valida se um CPF tem formato válido
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  return true;
}

/**
 * Formata a data no padrão brasileiro
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}
