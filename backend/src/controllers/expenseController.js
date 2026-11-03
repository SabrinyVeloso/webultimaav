import * as service from '../services/expenseService.js';
export const list = async (req, res) => res.json({ expenses: await service.listExpenses(req.user.id, req.query) });
export const get = async (req, res) => res.json({ expense: await service.getExpense(req.user.id, req.params.id) });
export const create = async (req, res) => res.status(201).json({ expense: await service.createExpense(req.user.id, req.body) });
export const update = async (req, res) => res.json({ expense: await service.updateExpense(req.user.id, req.params.id, req.body) });
export const remove = async (req, res) => { await service.deleteExpense(req.user.id, req.params.id); res.status(204).send(); };
