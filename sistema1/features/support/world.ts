import { World, IWorldOptions } from '@cucumber/cucumber';

// Configuração do mundo do Cucumber para compartilhar estado entre steps
export class CustomWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }
}
