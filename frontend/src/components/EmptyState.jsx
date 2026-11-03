import { Inbox } from 'lucide-react';
export default function EmptyState({ text = 'Nenhum registro encontrado.' }) { return <div className="empty"><Inbox size={32}/><p>{text}</p></div>; }
