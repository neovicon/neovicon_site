import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';
import api from '../services/api';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentCategory) params.append('category', currentCategory);
        if (currentPage) params.append('page', currentPage);

        const res = await api.get(`/articles?${params.toString()}`);
        setArticles(res.data.data.articles);
        setPagination(res.data.data.pagination);
      } catch (err) {
        console.error('Failed to fetch articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category, page: 1 });
    } else {
      setSearchParams({ page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: newPage });
  };

  return (
    <div className="py-8 relative">
      {/* Decorative Blur */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-purple-glow/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Sparkles className="text-cyan-glow w-8 h-8" /> 
          Discover <span className="text-gradient">Knowledge</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">Deep dives into AI, cutting-edge coding paradigms, and tech productivity.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6 shrink-0">
          <div className="p-6 bg-glass rounded-2xl sticky top-24">
            <h3 className="font-bold mb-6 text-white text-lg tracking-wider">CATEGORIES</h3>
            <ul className="space-y-3 text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => handleCategoryChange('')} 
                  className={`transition-colors flex items-center gap-2 w-full text-left ${!currentCategory ? 'text-cyan-glow text-glow-cyan' : 'hover:text-white'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${!currentCategory ? 'bg-cyan-glow shadow-[0_0_8px_rgba(0,210,255,0.8)]' : 'bg-transparent'}`}></span>
                  All Articles
                </button>
              </li>
              {['AI', 'Coding', 'Science', 'Productivity'].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={() => handleCategoryChange(cat)} 
                    className={`transition-colors flex items-center gap-2 w-full text-left ${currentCategory === cat ? 'text-cyan-glow text-glow-cyan' : 'hover:text-white'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${currentCategory === cat ? 'bg-cyan-glow shadow-[0_0_8px_rgba(0,210,255,0.8)]' : 'bg-transparent'}`}></span>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-cyan-glow/20 border-t-cyan-glow rounded-full animate-spin"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 bg-glass rounded-3xl border border-dark-border">
              <p className="text-slate-400 text-lg">No articles found in this category.</p>
            </div>
          ) : (
            articles.map((article) => (
              <article key={article._id} className="p-8 bg-glass rounded-3xl group transition-all duration-300 hover:border-cyan-glow/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-neon transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <div className="text-xs font-bold tracking-widest text-cyan-glow mb-4 uppercase inline-block px-3 py-1 bg-cyan-glow/10 rounded-full border border-cyan-glow/20">
                  {article.category}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  <Link to={`/articles/${article.slug}`} className="text-white hover:text-cyan-glow transition-colors">
                    {article.title}
                  </Link>
                </h2>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})}
                  </div>
                  
                  <Link to={`/articles/${article.slug}`} className="w-10 h-10 rounded-full bg-dark-900 border border-dark-border flex items-center justify-center text-slate-400 group-hover:text-cyan-glow group-hover:border-cyan-glow/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,210,255,0.3)]">
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </article>
            ))
          )}

          {/* Pagination */}
          {!loading && pagination.pages > 1 && (
            <div className="flex justify-center pt-8 gap-4 items-center">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-2 border border-dark-border bg-dark-800 rounded-full text-slate-300 hover:bg-dark-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Prev
              </button>
              <span className="text-slate-400 font-medium text-sm tracking-widest">
                {currentPage} / {pagination.pages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="px-6 py-2 border border-dark-border bg-dark-800 rounded-full text-slate-300 hover:bg-dark-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
