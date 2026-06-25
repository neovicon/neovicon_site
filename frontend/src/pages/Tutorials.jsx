import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Zap, Target, Crown } from 'lucide-react';
import api from '../services/api';

const TutorialsPage = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await api.get('/tutorials');
        setTutorials(res.data.data.tutorials);
      } catch (err) {
        console.error('Failed to fetch tutorials', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorials();
  }, []);

  const getLevelConfig = (level) => {
    switch(level) {
      case 'beginner': return { icon: <Zap className="w-4 h-4" />, classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'intermediate': return { icon: <Target className="w-4 h-4" />, classes: 'bg-cyan-glow/10 text-cyan-glow border-cyan-glow/20' };
      case 'advanced': return { icon: <Crown className="w-4 h-4" />, classes: 'bg-purple-glow/10 text-purple-glow border-purple-glow/20' };
      default: return { icon: <Zap className="w-4 h-4" />, classes: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  return (
    <div className="py-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-glow/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="mb-14 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight flex items-center justify-center gap-3">
          <Layers className="text-cyan-glow w-10 h-10" /> 
          Learning <span className="text-gradient">Paths</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">Structured step-by-step tutorials to level up your skills from zero to mastery.</p>
      </div>

      <div className="space-y-8 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-cyan-glow/20 border-t-cyan-glow rounded-full animate-spin"></div>
          </div>
        ) : tutorials.length === 0 ? (
          <div className="text-center py-20 bg-glass rounded-3xl border border-dark-border">
            <p className="text-slate-400 text-lg">No tutorials available yet.</p>
          </div>
        ) : (
          tutorials.map((tutorial) => {
            const levelConfig = getLevelConfig(tutorial.level);
            return (
              <div key={tutorial._id} className="p-8 bg-glass rounded-3xl group border border-dark-border hover:border-cyan-glow/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,210,255,0.15)] flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-neon transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
                
                <div className="flex-1 space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full border flex items-center gap-1.5 ${levelConfig.classes}`}>
                      {levelConfig.icon} {tutorial.level}
                    </span>
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> {tutorial.sections.length} parts
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white group-hover:text-cyan-glow transition-colors">{tutorial.title}</h2>
                  <p className="text-slate-400 text-lg leading-relaxed">{tutorial.description}</p>
                </div>
                
                <div className="w-full md:w-auto flex-shrink-0 relative z-10 pt-4 md:pt-0">
                  <Link 
                    to={`/tutorials/${tutorial.slug}`}
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-dark-900 border border-dark-border hover:border-cyan-glow/50 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,210,255,0.2)] group/btn"
                  >
                    Start Path <ArrowRight className="w-5 h-5 ml-2 text-cyan-glow transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;
