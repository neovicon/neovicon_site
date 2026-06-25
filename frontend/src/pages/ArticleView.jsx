import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import api from '../services/api';

const ArticleView = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/articles/slug/${slug}`);
        setArticle(res.data.data);
      } catch (err) {
        setError('Article not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const sanitizedContent = article ? DOMPurify.sanitize(article.content) : '';

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Neovicon`;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = article.content.substring(0, 150).replace(/#/g, '').trim() + '...';
    }
  }, [article]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-cyan-glow/20 border-t-cyan-glow rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto py-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">404</h2>
        <p className="text-slate-400 mb-8">{error || 'Article not found.'}</p>
        <Link to="/articles" className="text-cyan-glow hover:text-white transition-colors">Return to Articles</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-glow/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="mb-12 text-center md:text-left">
        <Link to="/articles" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-cyan-glow mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to Articles
        </Link>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
          <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/20 rounded-full flex items-center gap-2">
            <Tag className="w-3 h-3" /> {article.category}
          </span>
          <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
          {article.title}
        </h1>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-dark-border to-transparent"></div>
      </div>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-cyan-glow hover:prose-a:text-white prose-a:transition-colors prose-pre:bg-dark-800 prose-pre:border prose-pre:border-dark-border prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white bg-glass p-8 md:p-12 rounded-3xl">
        <ReactMarkdown>
          {sanitizedContent}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default ArticleView;
