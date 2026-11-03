import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/httpError.js';

export function periodFromDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new HttpError(400, 'Data inválida.');
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
      throw new HttpError(400, 'Data inválida.');
    }
  }
  return { mes: date.getUTCMonth() + 1, ano: date.getUTCFullYear() };
}

export async function isClosed(usuarioId, date) {
  const { mes, ano } = periodFromDate(date);
  return Boolean(await prisma.mesFechado.findUnique({ where: { usuarioId_mes_ano: { usuarioId, mes, ano } } }));
}

export async function ensureOpen(usuarioId, date) {
  if (await isClosed(usuarioId, date)) throw new HttpError(409, 'O mês desta despesa está encerrado.');
}

export async function closeMonth(usuarioId, mes, ano) {
  if (!Number.isInteger(mes) || mes < 1 || mes > 12 || !Number.isInteger(ano) || ano < 2000) {
    throw new HttpError(400, 'Mês ou ano inválido.');
  }
  return prisma.mesFechado.create({ data: { usuarioId, mes, ano } });
}
