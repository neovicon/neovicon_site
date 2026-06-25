import { useState } from 'react';
import { Coffee, Copy, Check, Send, LifeBuoy } from 'lucide-react';
import api from '../services/api';

const SupportPage = () => {
  const [copied, setCopied] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });

  const cryptoAddresses = [
    { name: 'Bitcoin (BTC)', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', icon: '₿' },
    { name: 'Ethereum (ETH)', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', icon: 'Ξ' },
  ];

  const handleCopy = (address, name) => {
    navigator.clipboard.writeText(address);
    setCopied(name);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      await api.post('/contact', {
        ...formData
      });
      setFormStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.error || 'Something went wrong. Please try again later.' 
      });
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-glow/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-dark-800 border border-dark-border rounded-2xl mb-2 shadow-[0_0_30px_rgba(0,210,255,0.15)] relative">
          <LifeBuoy className="w-10 h-10 text-cyan-glow" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Support & <span className="text-gradient">Contact</span>
        </h1>
        <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">Reach out for business inquiries, questions, or help keep the servers running.</p>
      </div>

      <section className="grid lg:grid-cols-5 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-glass p-8 md:p-10 rounded-3xl border border-dark-border shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-slate-400 mb-8 font-medium">Send a direct message right to my inbox.</p>

            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="hidden">
                <input 
                  type="text" 
                  name="honeypot" 
                  tabIndex="-1" 
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-5 py-3 bg-dark-900 border border-dark-border rounded-xl focus:ring-1 focus:ring-cyan-glow focus:border-cyan-glow text-white transition-all outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-5 py-3 bg-dark-900 border border-dark-border rounded-xl focus:ring-1 focus:ring-cyan-glow focus:border-cyan-glow text-white transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold tracking-widest text-slate-400 uppercase mb-2">Message</label>
                <textarea 
                  required 
                  rows="5" 
                  className="w-full px-5 py-4 bg-dark-900 border border-dark-border rounded-xl focus:ring-1 focus:ring-cyan-glow focus:border-cyan-glow text-white transition-all outline-none resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="How can I help you?"
                ></textarea>
              </div>

              {formStatus.error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">{formStatus.error}</div>}
              {formStatus.success && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">Message sent successfully! I will get back to you soon.</div>}

              <button 
                type="submit" 
                disabled={formStatus.loading}
                className="w-full flex justify-center items-center px-6 py-4 bg-gradient-neon hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,210,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {formStatus.loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Send Message <Send className="w-5 h-5 ml-2 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Support Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-glass p-8 rounded-3xl border border-dark-border shadow-xl h-full">
            <h2 className="text-2xl font-bold text-white mb-2">Support the Project</h2>
            <p className="text-slate-400 mb-8 font-medium">If this knowledge base helped you, consider supporting the work.</p>

            <a 
              href="#" 
              className="w-full flex items-center justify-center px-6 py-4 bg-[#FFDD00] hover:bg-[#FFEA4C] text-black font-bold rounded-xl transition-colors shadow-[0_0_20px_rgba(255,221,0,0.2)] hover:shadow-[0_0_30px_rgba(255,221,0,0.4)] mb-10"
            >
              <Coffee className="w-5 h-5 mr-3" /> Buy Me a Coffee
            </a>

            <div className="space-y-5 border-t border-dark-border pt-8">
              <h3 className="font-bold tracking-widest text-slate-400 uppercase text-sm mb-4">Crypto Wallets</h3>
              {cryptoAddresses.map((crypto) => (
                <div key={crypto.name} className="p-5 bg-dark-900 rounded-2xl border border-dark-border group hover:border-cyan-glow/50 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-white flex items-center">
                      <span className="w-8 h-8 flex items-center justify-center bg-dark-800 border border-dark-border rounded-full mr-3 text-cyan-glow font-bold text-sm">{crypto.icon}</span>
                      {crypto.name}
                    </span>
                    <button 
                      onClick={() => handleCopy(crypto.address, crypto.name)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-800 text-slate-400 hover:text-white hover:bg-cyan-glow/20 transition-all border border-dark-border"
                      title="Copy address"
                    >
                      {copied === crypto.name ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 font-mono break-all p-3 bg-dark-800 rounded-xl border border-dark-border/50 group-hover:text-slate-400 transition-colors">
                    {crypto.address}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
