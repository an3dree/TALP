import * as fs from 'fs';
import * as path from 'path';

/**
 * Repositório genérico para persistência em JSON
 * Gerencia leitura e escrita de dados em arquivos JSON locais
 */
export class JsonRepository<T extends { id: string }> {
  private filePath: string;

  constructor(fileName: string) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.filePath = path.join(dataDir, fileName);
    this.initializeFile();
  }

  private initializeFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  /**
   * Retorna todos os itens armazenados
   */
  findAll(): T[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Busca um item pelo ID
   */
  findById(id: string): T | undefined {
    const items = this.findAll();
    return items.find(item => item.id === id);
  }

  /**
   * Salva um novo item
   */
  save(item: T): T {
    const items = this.findAll();
    items.push(item);
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    return item;
  }

  /**
   * Atualiza um item existente
   */
  update(id: string, updatedItem: T): T | null {
    const items = this.findAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    items[index] = { ...updatedItem, id };
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    return items[index];
  }

  /**
   * Remove um item pelo ID
   */
  delete(id: string): boolean {
    const items = this.findAll();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false;
    }

    fs.writeFileSync(this.filePath, JSON.stringify(filteredItems, null, 2));
    return true;
  }

  /**
   * Remove todos os itens (útil para testes)
   */
  deleteAll(): void {
    fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
  }
}
