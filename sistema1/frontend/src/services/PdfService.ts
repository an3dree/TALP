import { jsPDF } from 'jspdf';
import { GeneratedExam, ExamHeader, AlternativeType } from '../types';

/**
 * Serviço para geração de PDFs de provas
 */
class PdfService {
  // Configurações de layout
  private readonly PAGE_WIDTH = 210; // A4 em mm
  private readonly PAGE_HEIGHT = 297;
  private readonly MARGIN = 20;
  private readonly LINE_HEIGHT = 6;
  private readonly CONTENT_WIDTH = this.PAGE_WIDTH - (2 * this.MARGIN);

  /**
   * Gera PDF individual de uma prova
   */
  generateExamPDF(exam: GeneratedExam, header: ExamHeader, alternativeType: AlternativeType): jsPDF {
    const doc = new jsPDF();
    let yPosition = this.MARGIN;

    // Cabeçalho da prova
    yPosition = this.addHeader(doc, header, exam.examNumber, yPosition);

    // Espaço após cabeçalho
    yPosition += this.LINE_HEIGHT;

    // Questões
    exam.questions.forEach((question, index) => {
      // Verifica se precisa de nova página
      if (yPosition > this.PAGE_HEIGHT - 40) {
        doc.addPage();
        yPosition = this.MARGIN;
      }

      yPosition = this.addQuestion(doc, question, index + 1, alternativeType, yPosition);
      yPosition += this.LINE_HEIGHT; // Espaço entre questões
    });

    return doc;
  }

  /**
   * Gera PDF com múltiplas provas (uma por página)
   */
  generateMultipleExamsPDF(
    exams: GeneratedExam[],
    header: ExamHeader,
    alternativeType: AlternativeType
  ): jsPDF {
    if (exams.length === 0) {
      throw new Error('Nenhuma prova para gerar PDF');
    }

    const doc = new jsPDF();
    
    exams.forEach((exam, examIndex) => {
      if (examIndex > 0) {
        doc.addPage();
      }

      let yPosition = this.MARGIN;

      // Cabeçalho da prova
      yPosition = this.addHeader(doc, header, exam.examNumber, yPosition);
      yPosition += this.LINE_HEIGHT;

      // Questões
      exam.questions.forEach((question, questionIndex) => {
        // Verifica se precisa de nova página
        if (yPosition > this.PAGE_HEIGHT - 40) {
          doc.addPage();
          yPosition = this.MARGIN;
        }

        yPosition = this.addQuestion(doc, question, questionIndex + 1, alternativeType, yPosition);
        yPosition += this.LINE_HEIGHT;
      });
    });

    return doc;
  }

  /**
   * Adiciona cabeçalho da prova ao PDF
   */
  private addHeader(doc: jsPDF, header: ExamHeader, examNumber: number, yPosition: number): number {
    const centerX = this.PAGE_WIDTH / 2;

    // Título
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PROVA', centerX, yPosition, { align: 'center' });
    yPosition += this.LINE_HEIGHT + 2;

    // Informações do cabeçalho
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Disciplina: ${header.subject}`, this.MARGIN, yPosition);
    yPosition += this.LINE_HEIGHT;

    doc.text(`Professor: ${header.professor}`, this.MARGIN, yPosition);
    yPosition += this.LINE_HEIGHT;

    doc.text(`Data: ${header.date}`, this.MARGIN, yPosition);
    yPosition += this.LINE_HEIGHT;

    if (header.additionalInfo) {
      doc.text(`${header.additionalInfo}`, this.MARGIN, yPosition);
      yPosition += this.LINE_HEIGHT;
    }

    // Número da prova (canto superior direito)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Prova Nº ${examNumber}`, this.PAGE_WIDTH - this.MARGIN, this.MARGIN, { align: 'right' });

    // Linha separadora
    yPosition += 2;
    doc.setLineWidth(0.5);
    doc.line(this.MARGIN, yPosition, this.PAGE_WIDTH - this.MARGIN, yPosition);
    yPosition += this.LINE_HEIGHT;

    // Campo para identificação do aluno
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Nome: _______________________________________________  CPF: ___________________', this.MARGIN, yPosition);
    yPosition += this.LINE_HEIGHT + 4;

    return yPosition;
  }

  /**
   * Adiciona uma questão ao PDF
   */
  private addQuestion(
    doc: jsPDF,
    question: any,
    questionNumber: number,
    alternativeType: AlternativeType,
    yPosition: number
  ): number {
    // Enunciado da questão
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionText = `${questionNumber}. ${question.statement}`;
    
    const questionLines = doc.splitTextToSize(questionText, this.CONTENT_WIDTH);
    doc.text(questionLines, this.MARGIN, yPosition);
    yPosition += questionLines.length * this.LINE_HEIGHT;

    // Espaço após enunciado
    yPosition += 2;

    // Alternativas
    doc.setFont('helvetica', 'normal');
    question.alternatives.forEach((alternative: any, index: number) => {
      const identifier = this.getAlternativeIdentifier(index, alternativeType);
      const alternativeText = `   ${identifier}) ${alternative.description}`;
      
      const altLines = doc.splitTextToSize(alternativeText, this.CONTENT_WIDTH);
      
      // Verifica se precisa de nova página
      if (yPosition + (altLines.length * this.LINE_HEIGHT) > this.PAGE_HEIGHT - this.MARGIN) {
        doc.addPage();
        yPosition = this.MARGIN;
      }

      doc.text(altLines, this.MARGIN, yPosition);
      yPosition += altLines.length * this.LINE_HEIGHT;
    });

    return yPosition;
  }

  /**
   * Retorna o identificador da alternativa (A, B, C ou 1, 2, 4, 8)
   */
  private getAlternativeIdentifier(index: number, type: AlternativeType): string {
    if (type === AlternativeType.LETTERS) {
      return String.fromCharCode(65 + index); // A, B, C, D...
    } else {
      return Math.pow(2, index).toString(); // 1, 2, 4, 8, 16...
    }
  }

  /**
   * Faz download de um PDF
   */
  downloadPDF(doc: jsPDF, filename: string): void {
    doc.save(filename);
  }

  /**
   * Gera e faz download de uma prova individual
   */
  downloadSingleExam(
    exam: GeneratedExam,
    header: ExamHeader,
    alternativeType: AlternativeType,
    examName: string
  ): void {
    const doc = this.generateExamPDF(exam, header, alternativeType);
    this.downloadPDF(doc, `${examName}-prova-${exam.examNumber}.pdf`);
  }

  /**
   * Gera e faz download de todas as provas em um único PDF
   */
  downloadAllExams(
    exams: GeneratedExam[],
    header: ExamHeader,
    alternativeType: AlternativeType,
    examName: string
  ): void {
    const doc = this.generateMultipleExamsPDF(exams, header, alternativeType);
    this.downloadPDF(doc, `${examName}-todas-provas.pdf`);
  }
}

export const pdfService = new PdfService();
