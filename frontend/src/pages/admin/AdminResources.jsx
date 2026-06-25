import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('tool');
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources/admin');
      if (res.data.success) {
        setResources(res.data.data.resources);
      }
    } catch (error) {
      console.error('Failed to fetch resources', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (resource = null) => {
    if (resource) {
      setEditingId(resource._id);
      setName(resource.name);
      setUrl(resource.url);
      setDescription(resource.description);
      setType(resource.type);
      setIsAffiliate(resource.isAffiliate);
    } else {
      setEditingId(null);
      setName('');
      setUrl('');
      setDescription('');
      setType('tool');
      setIsAffiliate(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, url, description, type, isAffiliate };
    try {
      if (editingId) {
        await api.put(`/resources/admin/${editingId}`, payload);
      } else {
        await api.post('/resources/admin', payload);
      }
      setIsModalOpen(false);
      fetchResources();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/resources/admin/${id}`);
        fetchResources();
      } catch (error) {
        alert('Failed to delete resource');
      }
    }
  };

  if (loading) return <div className="text-slate-400">Loading resources...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Resources</h1>
        <button 
          onClick={() => openModal()}
          className="bg-gradient-neon text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-5 h-5" /> New Resource
        </button>
      </div>

      <div className="bg-dark-800 border border-dark-border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-dark-900 border-b border-dark-border text-slate-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Affiliate</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {resources.map((resource) => (
              <tr key={resource._id} className="hover:bg-dark-700/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{resource.name}</td>
                <td className="px-6 py-4 text-slate-400 capitalize">{resource.type}</td>
                <td className="px-6 py-4">
                  {resource.isAffiliate ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">Yes</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">No</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openModal(resource)} className="text-slate-400 hover:text-cyan-glow">
                    <Edit2 className="w-5 h-5 inline" />
                  </button>
                  <button onClick={() => handleDelete(resource._id)} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No resources found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-dark-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-dark-border flex justify-between items-center sticky top-0 bg-dark-800 z-10">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Resource' : 'New Resource'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">URL</label>
                <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow">
                  <option value="tool">Tool</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="book">Book</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea required rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-dark-900 border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-glow"></textarea>
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="isAffiliate" checked={isAffiliate} onChange={(e) => setIsAffiliate(e.target.checked)} className="w-5 h-5 accent-cyan-glow bg-dark-900 border-dark-border rounded" />
                <label htmlFor="isAffiliate" className="text-slate-300 font-medium">Is Affiliate Link</label>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-gradient-neon text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResources;
