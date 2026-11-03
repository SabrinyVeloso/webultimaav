import * as service from '../services/dashboardService.js';
export const dashboard = async (req, res) => res.json(await service.dashboard(req.user.id));
export const report = async (req, res) => res.json(await service.report(req.user.id, req.query));
