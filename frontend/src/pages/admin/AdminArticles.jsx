import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles/admin');
      if (res.data.success) {
        setArticles(res.data.data.articles);
      }
    } catch (error) {
      console.error('Failed to fetch articles', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (article = null) => {
    if (article) {
      setEditingId(article._id);
      setTitle(article.title);
      setSlug(article.slug);
      setCategory(article.category);
      setContent(article.content);
      setPublished(article.published);
    } else {
      setEditingId(null);
      setTitle('');
      setSlug('');
      setCategory('');
      setContent('');
      setPublished(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, slug, category, content, published };
    try {
      if (editingId) {
        await api.put(`/articles/admin/${editingId}`, payload);
      } else {
        await api.post('/articles/admin', payload);
      }
      setIsModalOpen(false);
      fetchArticles();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save article');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.delete(`/articles/admin/${id}`);
        fetchArticles();
      } catch (error) {
        alert('Failed to delete article');
      }
    }
  };

  if (loading) return <div className="text-slate-400">Loading articles...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Articles</h1>
        <button 
          onClick={() => openModal()}
          className="bg-gradient-neon text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> New Article
        </button>
      </div>

      <div className="bg-dark-800 border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-900 border-b border-dark-border text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {articles.map((article) => (
              <tr key={article._id} className="hover:bg-dark-700/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{article.title}</td>
                <td className="px-6 py-4 text-slate-400 capitalize">{article.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.published ? 'bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(article)} className="text-slate-400 hover:text-cyan-glow transition-colors">
                    <Edit2 className="w-5 h-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(article._id)} className="text-slate-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No articles found. Create one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-dark-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex justify-between items-center sticky top-0 bg-dark-800 z-10">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Article' : 'New Article'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Slug</label>
                <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <input required type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Content (HTML/Markdown support)</label>
                <textarea required rows="8" value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow font-mono text-sm"></textarea>
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5 accent-cyan-glow bg-dark-900 border-dark-border rounded" />
                <label htmlFor="published" className="text-slate-300 font-medium">Publish immediately</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-neon text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
