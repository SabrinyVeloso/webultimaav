import { prisma } from '../config/prisma.js';
import { CATEGORIAS, SITUACOES } from '../utils/constants.js';
import { HttpError } from '../utils/httpError.js';
import { ensureOpen, periodFromDate } from './monthService.js';

function validate(data) {
  if (!data.descricao?.trim()) throw new HttpError(400, 'Descrição é obrigatória.');
  const value = Number(data.valor);
  if (!Number.isFinite(value) || value <= 0) throw new HttpError(400, 'O valor deve ser maior que zero.');
  if (!CATEGORIAS.includes(data.categoria)) throw new HttpError(400, 'Categoria inválida.');
  if (!SITUACOES.includes(data.situacao)) throw new HttpError(400, 'Situação inválida.');
  const { mes, ano } = periodFromDate(data.data);
  return { descricao: data.descricao.trim(), valor: value, categoria: data.categoria, data: new Date(data.data), situacao: data.situacao, observacao: data.observacao?.trim() || null };
}

const serialize = (expense) => ({ ...expense, valor: Number(expense.valor).toFixed(2) });

export async function listExpenses(usuarioId, query) {
  const where = { usuarioId };
  if (query.categoria) where.categoria = query.categoria;
  if (query.situacao) where.situacao = query.situacao;
  if (query.busca) where.descricao = { contains: query.busca };
  if (query.mes && query.ano) {
    const start = new Date(Date.UTC(Number(query.ano), Number(query.mes) - 1, 1));
    const end = new Date(Date.UTC(Number(query.ano), Number(query.mes), 1));
    where.data = { gte: start, lt: end };
  }
  const expenses = await prisma.despesa.findMany({ where, orderBy: { data: 'desc' } });
  return expenses.map(serialize);
}

export async function getExpense(usuarioId, id) {
  const expense = await prisma.despesa.findFirst({ where: { id: Number(id), usuarioId } });
  if (!expense) throw new HttpError(404, 'Despesa não encontrada.');
  return serialize(expense);
}

export async function createExpense(usuarioId, data) {
  const parsed = validate(data);
  await ensureOpen(usuarioId, data.data);
  return serialize(await prisma.despesa.create({ data: { ...parsed, usuarioId } }));
}

export async function updateExpense(usuarioId, id, data) {
  const current = await prisma.despesa.findFirst({ where: { id: Number(id), usuarioId } });
  if (!current) throw new HttpError(404, 'Despesa não encontrada.');
  await ensureOpen(usuarioId, current.data);
  const parsed = validate(data);
  await ensureOpen(usuarioId, data.data);
  return serialize(await prisma.despesa.update({ where: { id: current.id }, data: { descricao: parsed.descricao, valor: parsed.valor, categoria: parsed.categoria, data: parsed.data, situacao: parsed.situacao, observacao: parsed.observacao } }));
}

export async function deleteExpense(usuarioId, id) {
  const current = await prisma.despesa.findFirst({ where: { id: Number(id), usuarioId } });
  if (!current) throw new HttpError(404, 'Despesa não encontrada.');
  await ensureOpen(usuarioId, current.data);
  await prisma.despesa.delete({ where: { id: current.id } });
}
