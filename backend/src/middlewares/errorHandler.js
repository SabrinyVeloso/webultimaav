export function errorHandler(error, _req, res, _next) {
  console.error(error);
  const status = error.status || (error.code === 'P2002' ? 409 : 500);
  const message = error.code === 'P2002' ? 'Já existe um registro com esses dados.' : error.message || 'Erro interno do servidor.';
  res.status(status).json({ message });
}
