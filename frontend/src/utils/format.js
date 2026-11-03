export const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const date = (value) => value ? new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
export const today = () => new Date().toISOString().slice(0, 10);
