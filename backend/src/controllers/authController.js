import * as service from '../services/authService.js';
export const register = async (req, res) => res.status(201).json({ user: await service.register(req.body) });
export const login = async (req, res) => res.json(await service.login(req.body));
