import { prisma } from '../config/prisma.js';

export async function dashboard(usuarioId) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const expenses = await prisma.despesa.findMany({ where: { usuarioId, data: { gte: start, lt: end } }, orderBy: { data: 'desc' } });
  const sum = (items) => items.reduce((total, item) => total + Number(item.valor), 0);
  const byCategory = Object.values(expenses.reduce((acc, item) => {
    acc[item.categoria] ??= { categoria: item.categoria, total: 0 };
    acc[item.categoria].total += Number(item.valor);
    return acc;
  }, {})).map((item) => ({ ...item, total: Number(item.total.toFixed(2)) }));
  return {
    resumo: { total: sum(expenses), quantidade: expenses.length, pago: sum(expenses.filter((e) => e.situacao === 'PAGO')), pendente: sum(expenses.filter((e) => e.situacao === 'PENDENTE')) },
    porCategoria: byCategory,
    recentes: expenses.slice(0, 5).map((e) => ({ ...e, valor: Number(e.valor).toFixed(2) }))
  };
}

export async function report(usuarioId, query) {
  const where = { usuarioId };
  if (query.de) where.data = { gte: new Date(`${query.de}T00:00:00.000Z`) };
  if (query.ate) where.data = { ...(where.data || {}), lte: new Date(`${query.ate}T23:59:59.999Z`) };
  const expenses = await prisma.despesa.findMany({ where });
  const total = expenses.reduce((a, e) => a + Number(e.valor), 0);
  const group = (key) => Object.values(expenses.reduce((a, e) => {
    const value = key === 'mes' ? e.data.toISOString().slice(0, 7) : e.categoria;
    a[value] ??= { nome: value, total: 0 };
    a[value].total += Number(e.valor);
    return a;
  }, {})).map((x) => ({ ...x, total: Number(x.total.toFixed(2)) }));
  return { total, pago: expenses.filter((e) => e.situacao === 'PAGO').reduce((a, e) => a + Number(e.valor), 0), pendente: expenses.filter((e) => e.situacao === 'PENDENTE').reduce((a, e) => a + Number(e.valor), 0), porCategoria: group('categoria'), porMes: group('mes') };
}
