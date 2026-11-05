import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarClock, ChevronRight, LayoutDashboard, LogOut, Menu, Moon, Receipt, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';
const links = [
  ['/','Dashboard',LayoutDashboard], ['/expenses','Minhas despesas',Receipt], ['/reports','Relatórios',BarChart3], ['/months','Encerramento mensal',CalendarClock]
];
export default function AppLayout() {
  const [open, setOpen] = useState(false); const { user, logout } = useAuth(); const { theme, toggleTheme } = useTheme(); const navigate = useNavigate();
  function signOut() { logout(); navigate('/login'); }
  return <div className="app-shell"><aside className={open ? 'sidebar open' : 'sidebar'}><div className="sidebar-head"><Logo/><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button></div><nav>{links.map(([to,label,Icon])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><Icon size={19}/>{label}<ChevronRight className="nav-arrow" size={15}/></NavLink>)}</nav><div className="sidebar-bottom"><div className="user-chip"><span>{user?.nome?.[0]?.toUpperCase()}</span><div><b>{user?.nome}</b><small>{user?.email}</small></div></div><button className="logout" onClick={signOut}><LogOut size={18}/> Sair</button></div></aside><main className="main"><header className="topbar"><button className="menu-btn" onClick={()=>setOpen(true)}><Menu/></button><button className="theme-toggle" onClick={toggleTheme} aria-label="Alternar tema">{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button><div className="topbar-user">Olá, <strong>{user?.nome?.split(' ')[0]}</strong></div></header><div className="content"><Outlet/></div></main></div>;
}
