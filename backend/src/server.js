import app from './app.js';
import { prisma } from './config/prisma.js';
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Meu Controle API disponível na porta ${port}`));
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });
