import { useState, useEffect } from 'react';
import { ExternalLink, Briefcase, BookOpen, Wrench, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await api.get('/resources');
        setResources(res.data.data.resources);
      } catch (err) {
        console.error('Failed to fetch resources', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="py-8 relative">
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-purple-glow/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Wrench className="text-purple-glow w-10 h-10" /> 
          Resources & <span className="text-gradient">Tools</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">Curated dev tools, essential books, and the gear that powers my workflow.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-glow/20 border-t-purple-glow rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-glass rounded-3xl border border-dark-border max-w-4xl mx-auto">
          <p className="text-slate-400 text-lg">No resources available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource._id} className="flex flex-col p-8 bg-glass rounded-3xl border border-dark-border hover:border-purple-glow/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(122,40,203,0.15)] relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-neon opacity-10 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
              
              {resource.isAffiliate && (
                <span className="absolute top-6 right-6 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Affiliate
                </span>
              )}
              
              <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-dark-border flex items-center justify-center mb-6 group-hover:border-purple-glow/50 transition-colors">
                {resource.type === 'tool' ? <Briefcase className="w-6 h-6 text-cyan-glow" /> : <BookOpen className="w-6 h-6 text-purple-glow" />}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-glow transition-colors">{resource.name}</h3>
              <p className="text-slate-400 flex-1 mb-8 leading-relaxed font-medium">{resource.description}</p>
              
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-between w-full p-4 rounded-xl bg-dark-900 border border-dark-border font-bold text-slate-300 hover:text-white hover:border-cyan-glow/50 transition-all duration-300 group/btn mt-auto"
              >
                <span>Get it here</span>
                <ExternalLink className="w-5 h-5 text-cyan-glow transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
