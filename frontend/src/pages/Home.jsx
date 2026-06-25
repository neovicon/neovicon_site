import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers, Terminal } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-24 py-10 relative">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-glow/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-glow/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-10">
        <div className="inline-flex items-center justify-center p-4 bg-dark-800 border border-dark-border rounded-2xl mb-6 shadow-[0_0_30px_rgba(0,210,255,0.15)] relative group">
          <div className="absolute inset-0 bg-gradient-neon opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl blur-md"></div>
          <Terminal className="w-12 h-12 text-cyan-glow relative z-10" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Explore. Learn. <br className="hidden md:block"/> 
          <span className="text-gradient hover-glow transition-all duration-300">Innovate.</span>
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Welcome to Neovicon, your ultimate knowledge hub. Dive into structured learning paths, deep-dive articles, and curated resources designed for the modern developer.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Link to="/tutorials" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-neon rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(122,40,203,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transform hover:-translate-y-1">
            Start Learning <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/articles" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-300 bg-dark-800 border border-dark-border hover:border-cyan-glow/50 rounded-xl transition-all hover:text-white transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,210,255,0.1)]">
            Read Articles
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full z-10">
        <div className="p-10 rounded-3xl bg-glass border-dark-border transition-all duration-300 hover:-translate-y-2 hover:border-cyan-glow/40 hover:shadow-[0_10px_40px_rgba(0,210,255,0.1)] group">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-border flex items-center justify-center mb-8 group-hover:border-cyan-glow/50 transition-colors">
            <BookOpen className="w-8 h-8 text-cyan-glow" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Latest Articles</h3>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Discover cutting-edge insights on artificial intelligence, modern coding practices, and productivity hacks.
          </p>
          <Link to="/articles" className="text-cyan-glow font-bold hover:text-white transition-colors inline-flex items-center group/link">
            Browse Articles <ArrowRight className="ml-2 w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="p-10 rounded-3xl bg-glass border-dark-border transition-all duration-300 hover:-translate-y-2 hover:border-purple-glow/40 hover:shadow-[0_10px_40px_rgba(122,40,203,0.1)] group">
          <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-dark-border flex items-center justify-center mb-8 group-hover:border-purple-glow/50 transition-colors">
            <Layers className="w-8 h-8 text-purple-glow" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Learning Paths</h3>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Follow structured, step-by-step tutorials designed to take you from a beginner to an advanced practitioner.
          </p>
          <Link to="/tutorials" className="text-purple-glow font-bold hover:text-white transition-colors inline-flex items-center group/link">
            View Tutorials <ArrowRight className="ml-2 w-5 h-5 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
