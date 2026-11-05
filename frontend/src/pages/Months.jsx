import { useEffect, useState } from 'react';
import { LockKeyhole, LockOpen } from 'lucide-react';
import api from '../services/api';
import { money } from '../utils/format';

export default function Months() {
  const now = new Date();
  const [form, setForm] = useState({ mes: now.getMonth() + 1, ano: now.getFullYear() });
  const [months, setMonths] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  async function load() {
    const [monthResponse, expenseResponse] = await Promise.all([
      api.get('/months'),
      api.get('/expenses', { params: { mes: form.mes, ano: form.ano } })
    ]);
    setMonths(monthResponse.data.months);
    setTotal(expenseResponse.data.expenses.reduce((sum, expense) => sum + Number(expense.valor), 0));
  }

  useEffect(() => {
    load().catch(() => setMessage({ type: 'error', text: 'Não foi possível carregar os dados.' }));
  }, [form.mes, form.ano]);

  const selectedMonth = months.find((month) => month.mes === form.mes && month.ano === form.ano);
  const isClosed = selectedMonth?.status !== 'ABERTO' && Boolean(selectedMonth);

  async function changeStatus() {
    const action = isClosed ? 'reabrir' : 'encerrar';
    const question = isClosed
      ? 'Ao reabrir, as despesas deste período poderão ser cadastradas, editadas e excluídas novamente. Continuar?'
      : 'Após encerrar, as despesas deste mês não poderão ser alteradas. Continuar?';
    if (!window.confirm(question)) return;
    try {
      await api.post(isClosed ? '/months/reopen' : '/months', form);
      setMessage({ type: 'success', text: isClosed ? 'Mês reaberto com sucesso.' : 'Mês encerrado com sucesso.' });
      await load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Não foi possível atualizar o mês.' });
    }
  }

  return <><div className="page-heading"><div><p className="eyebrow">FECHAMENTO</p><h1>Encerramento mensal</h1><p className="muted">Bloqueie alterações após conferir seus lançamentos.</p></div></div><div className="month-layout"><section className="panel close-card"><div className="lock-icon">{isClosed ? <LockKeyhole/> : <LockOpen/>}</div><h2>{isClosed ? 'Mês encerrado' : 'Fechar um mês'}</h2><p>{isClosed ? 'Este período está protegido. Reabra-o para voltar a alterar suas despesas.' : 'Depois do encerramento, nenhuma despesa do período poderá ser cadastrada, editada ou excluída.'}</p><div className="form-grid"><label><span>Mês</span><select value={form.mes} onChange={e => setForm({ ...form, mes: Number(e.target.value) })}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(2020, i, 1).toLocaleString('pt-BR', { month: 'long' })}</option>)}</select></label><label><span>Ano</span><input type="number" value={form.ano} onChange={e => setForm({ ...form, ano: Number(e.target.value) })}/></label></div><div className="month-total"><span>Total do período</span><strong>{money(total)}</strong></div>{message.text && <div className={message.type === 'error' ? 'error-box' : 'success-box'}>{message.text}</div>}<button className="primary-btn" onClick={changeStatus}>{isClosed ? 'Reabrir mês' : 'Encerrar mês'}</button></section><section className="panel"><div className="panel-title"><div><h2>Histórico de meses</h2><p>Seus encerramentos permanecem registrados</p></div></div>{months.length ? months.map(month => <div className="closed-month" key={month.id}>{month.status === 'ABERTO' ? <LockOpen size={17}/> : <LockKeyhole size={17}/>}<span>{String(month.mes).padStart(2, '0')}/{month.ano}</span><small>{month.status === 'ABERTO' ? 'Reaberto' : 'Encerrado'}</small></div>) : <p className="muted">Nenhum mês encerrado ainda.</p>}</section></div></>;
}
