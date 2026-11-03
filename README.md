# Meu Controle

Sistema web de controle de despesas pessoais, com autenticação, dashboard, relatórios e encerramento mensal por usuário.

## Funcionalidades

- Cadastro e login com senha protegida por bcrypt e JWT.
- CRUD de despesas com categorias, situação, filtros e validação.
- Isolamento completo dos dados por usuário autenticado.
- Dashboard com totais reais, despesas recentes e gráfico por categoria.
- Relatórios por período e agrupamento mensal/categoria.
- Encerramento mensal: despesas do mês encerrado ficam somente para consulta.
- Interface responsiva em português brasileiro, com moeda e datas localizadas.

## Tecnologias

- Backend: Node.js, Express 5, arquitetura MVC, Prisma **7.10.0**, MySQL, JWT e bcrypt.
- Frontend: React 19, Vite, Tailwind CSS **4.3.0**, React Router, Axios, Lucide React e Recharts.

## Estrutura

```text
backend/
  prisma/schema.prisma
  src/{config,controllers,middlewares,routes,services,utils}
frontend/
  src/{components,contexts,layouts,pages,routes,services,utils}
```

## Pré-requisitos

Node.js 20+ (ou versão compatível com as dependências), npm e um servidor MySQL 8+.

## Configuração local

1. Crie um banco MySQL:

   ```sql
   CREATE DATABASE meu_controle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Configure os ambientes:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   Copy-Item frontend\.env.example frontend\.env
   ```

   Ajuste `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` e `VITE_API_URL`.

3. Instale e prepare o backend:

   ```powershell
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```

4. Em outro terminal, instale e execute o frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Abra `http://localhost:5173`.

## Rotas principais

| Método | Rota | Protegida |
|---|---|---|
| POST | `/api/auth/register` | Não |
| POST | `/api/auth/login` | Não |
| GET/POST | `/api/expenses` | Sim |
| GET/PUT/DELETE | `/api/expenses/:id` | Sim |
| GET | `/api/dashboard` | Sim |
| GET | `/api/dashboard/reports` | Sim |
| GET/POST | `/api/months` | Sim |
| GET | `/api/health` | Não |

Use `Authorization: Bearer <token>` nas rotas protegidas.

## Publicação

### Backend no Render

- Crie um Web Service apontando para este repositório, com Root Directory `backend`.
- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`.
- Start Command: `npm start`.
- Cadastre `DATABASE_URL`, `JWT_SECRET`, `PORT` e `FRONTEND_URL` nas variáveis do serviço.
- Use um MySQL gerenciado acessível publicamente e mantenha a URL fora do Git.

### Frontend na Vercel

- Crie um projeto apontando para o mesmo repositório, com Root Directory `frontend`.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Configure `VITE_API_URL` com a URL pública do backend, incluindo `/api`.

## Testes manuais

Cadastre dois usuários e confirme que cada um vê somente suas despesas. Crie despesas pagas e pendentes, confira o dashboard e os relatórios, edite e exclua um lançamento. Em seguida encerre o mês correspondente e confirme que criar, editar e excluir despesas desse período retornam erro, enquanto a consulta continua disponível. Para validar o frontend, execute `npm run build` na pasta `frontend`.
