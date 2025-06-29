import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { Express } from 'express';

export function setupSwagger(app: Express) {
  const swaggerPath = path.resolve(__dirname, 'swagger.yaml');
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
