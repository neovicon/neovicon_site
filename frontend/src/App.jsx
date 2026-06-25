import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X as CloseIcon, User } from 'lucide-react';
import { FaYoutube, FaFacebook, FaInstagram, FaTelegram, FaXTwitter, FaThreads } from 'react-icons/fa6';
import { useState, useEffect } from 'react';

import logoImg from './assets/logo.jpeg';

import HomePage from './pages/Home';
import ArticlesPage from './pages/Articles';
import ArticleView from './pages/ArticleView';
import TutorialsPage from './pages/Tutorials';
import ResourcesPage from './pages/Resources';
import SupportPage from './pages/Support';

// We will create these shortly
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminArticles from './pages/admin/AdminArticles';
import AdminTutorials from './pages/admin/AdminTutorials';
import AdminResources from './pages/admin/AdminResources';

const Logo = () => (
  <div className="flex items-center gap-3">
    {/* Using the actual logo image with a light background so dark text is visible */}
    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl border border-cyan-glow/30 bg-white shadow-[0_0_15px_rgba(0,210,255,0.2)] overflow-hidden group p-0.5">
      <img src={logoImg} alt="Neovicon Logo" className="w-full h-full object-contain rounded-lg" />
    </div>
    <span className="font-bold text-xl tracking-[0.2em] text-white hidden sm:block">
      NEOVICON
    </span>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    // Retrieve user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const links = [
    { name: 'HOME', path: '/' },
    { name: 'ARTICLES', path: '/articles' },
    { name: 'TUTORIALS', path: '/tutorials' },
    { name: 'RESOURCES', path: '/resources' },
    { name: 'SUPPORT', path: '/support' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-dark-border bg-dark-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex-shrink-0 hover-glow p-2 rounded-lg transition-all duration-300">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold tracking-widest text-slate-400">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-cyan-glow transition-colors duration-300 relative group py-2">
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-neon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-cyan-glow hover:text-white transition-colors">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dark-border bg-dark-800 text-slate-300 hover:text-red-400 hover:border-red-400/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-all font-semibold text-sm tracking-wide">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-dark-border bg-dark-800 text-slate-300 hover:text-white hover:border-cyan-glow hover:shadow-[0_0_15px_rgba(0,210,255,0.2)] transition-all font-semibold text-sm tracking-wide">
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {!user && (
              <Link to="/login" className="text-slate-400 hover:text-white">
                <User className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white focus:outline-none">
              {isOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-b border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-glow hover:bg-dark-700">
                {link.name}
              </Link>
            ))}
            
            <div className="mt-2 border-t border-dark-border pt-3">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-cyan-glow hover:bg-dark-700 mb-1">
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-dark-700">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-cyan-glow hover:bg-dark-700">
                  Sign In / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const socials = [
    { icon: <FaYoutube className="w-5 h-5" />, url: 'https://www.youtube.com/@neovicon', name: 'YouTube' },
    { icon: <FaFacebook className="w-5 h-5" />, url: 'https://www.facebook.com/neovicon', name: 'Facebook' },
    { icon: <FaInstagram className="w-5 h-5" />, url: 'https://www.instagram.com/neovicon', name: 'Instagram' },
    { icon: <FaTelegram className="w-5 h-5" />, url: 'https://t.me/neovicon', name: 'Telegram' },
    { icon: <FaXTwitter className="w-5 h-5" />, url: 'https://www.x.com/neovicon', name: 'X' },
    { icon: <FaThreads className="w-5 h-5" />, url: 'https://www.threads.com/neovicon', name: 'Threads' },
  ];

  return (
    <footer className="border-t border-dark-border mt-20 bg-dark-900 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-glow to-transparent opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm tracking-widest text-slate-400 font-semibold uppercase">
              Explore. Learn. Innovate.
            </p>
          </div>

          <div className="flex gap-4">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-dark-800 border border-dark-border flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-glow hover:shadow-[0_0_10px_rgba(0,210,255,0.3)] transition-all duration-300"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Neovicon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAdminRoute && <Navbar />}

      <main className={`flex-1 flex flex-col ${!isAdminRoute ? 'mt-20' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleView />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminArticles />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="tutorials" element={<AdminTutorials />} />
            <Route path="resources" element={<AdminResources />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
