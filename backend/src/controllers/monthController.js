import { prisma } from '../config/prisma.js';
import { closeMonth, reopenMonth } from '../services/monthService.js';
export const list = async (req, res) => res.json({ months: await prisma.mesFechado.findMany({ where: { usuarioId: req.user.id }, orderBy: [{ ano: 'desc' }, { mes: 'desc' }] }) });
export const close = async (req, res) => res.status(201).json({ month: await closeMonth(req.user.id, Number(req.body.mes), Number(req.body.ano)) });
export const reopen = async (req, res) => res.json({ month: await reopenMonth(req.user.id, Number(req.body.mes), Number(req.body.ano)) });
