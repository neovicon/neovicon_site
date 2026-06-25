import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Layers, Link as LinkIcon, LogOut } from 'lucide-react';
import { getUser, logout } from '../../services/auth';

const AdminLayout = () => {
  const user = getUser();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { name: 'Articles', icon: <FileText className="w-5 h-5" />, path: '/admin/articles' },
    { name: 'Tutorials', icon: <Layers className="w-5 h-5" />, path: '/admin/tutorials' },
    { name: 'Resources', icon: <LinkIcon className="w-5 h-5" />, path: '/admin/resources' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-dark-border flex flex-col hidden md:flex h-screen sticky top-0">
        <div className="p-6 border-b border-dark-border">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-cyan-glow/50 bg-dark-900 flex items-center justify-center relative">
               <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-neon z-10" style={{ letterSpacing: '-0.05em'}}>N</span>
            </div>
            <span className="font-bold text-lg tracking-widest text-white group-hover:text-cyan-glow transition-colors">NEOVICON</span>
          </Link>
          <div className="mt-2 text-xs text-slate-500 font-mono">ADMIN HQ</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) || (location.pathname === '/admin' && item.path === '/admin/articles');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-gradient-neon text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]' 
                    : 'text-slate-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
