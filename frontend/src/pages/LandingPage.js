import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Users, Sparkles, ArrowRight, Play, 
  Layout, Target, BarChart3, Building, Leaf, CheckCircle 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-4 sticky top-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">IH</div>
          <span className="text-xl font-bold text-gray-900">ImpactHub</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-teal-600 transition">Features</a>
          <a href="#sdgs" className="hover:text-teal-600 transition">SDG Goals</a>
          <a href="#partners" className="hover:text-teal-600 transition">Partners</a>
          <a href="#howitworks" className="hover:text-teal-600 transition">How It Works</a>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-teal-600">Sign In</button>
          <button onClick={() => navigate('/login')} className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-200">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradient matching Screenshot 3 & 4 */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-500 z-0"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm font-medium">AI-Powered Partnership Matching</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Connect & Collaborate for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-emerald-100 underline decoration-emerald-300/30">Global Impact</span>
          </h1>

          <p className="text-lg md:text-xl text-teal-50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Empowering startups, NGOs, and governments to discover partners, share resources, 
            and drive SDG-aligned projects using intelligent AI matching.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button onClick={() => navigate('/login')} className="bg-white text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-xl flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/10 transition flex items-center justify-center gap-2 backdrop-blur-sm">
              <Play size={20} fill="currentColor" /> Watch Demo
            </button>
          </div>

          {/* Glassmorphism Stats Cards (Screenshot 1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition">
              <Globe size={32} className="text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold">17</div>
              <div className="text-teal-100 text-sm">SDG Goals Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition">
              <Users size={32} className="text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-teal-100 text-sm">Organizations Connected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition">
              <Sparkles size={32} className="text-purple-300 mx-auto mb-3" />
              <div className="text-3xl font-bold">98%</div>
              <div className="text-teal-100 text-sm">AI Match Accuracy</div>
            </div>
          </div>
        </div>
      </header>

      {/* --- AI FEATURES SECTION (Screenshot 5) --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">AI & ML Powered</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Intelligence That Drives <span className="text-teal-600">Real Impact</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Our platform leverages cutting-edge artificial intelligence to transform how organizations collaborate on sustainable development goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Partner Matching</h3>
              <p className="text-gray-500 leading-relaxed">
                Our AI analyzes organizational profiles, capabilities, and goals to recommend the perfect partners for your SDG projects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Impact Prediction</h3>
              <p className="text-gray-500 leading-relaxed">
                ML models forecast project outcomes, helping you prioritize initiatives with the highest potential for sustainable impact.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
              <p className="text-gray-500 leading-relaxed">
                Real-time dashboards powered by data science track milestones, resources, and KPIs across all your collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Screenshot 6) --- */}
      <section id="howitworks" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
             <span className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold">Simple Process</span>
             <h2 className="text-4xl font-bold text-gray-900 mt-4">How It <span className="text-teal-600">Works</span></h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
             {[
                { step: "01", title: "Create Profile", desc: "Register your organization & define SDG focus." },
                { step: "02", title: "Discover Partners", desc: "AI surfaces relevant collaboration opportunities." },
                { step: "03", title: "Collaborate", desc: "Use built-in tools for messaging & resource sharing." },
                { step: "04", title: "Track Impact", desc: "Monitor progress with real-time transparent dashboards." },
             ].map((item, i) => (
                <div key={i} className="relative p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-lg transition">
                   <div className="text-5xl font-bold text-gray-200 mb-4">{item.step}</div>
                   <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                   <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

       {/* --- SDG GRID (Screenshot 2) --- */}
       <section id="sdgs" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">UN Sustainable Development Goals</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Aligned With <span className="text-teal-600">Global Goals</span></h2>
            <p className="text-gray-500 mb-12 max-w-2xl mx-auto">Every project on our platform maps directly to the UN's 17 Sustainable Development Goals.</p>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {/* Standard UN SDG Colors */}
                {[
                    {id:1, c: 'bg-[#E5243B]', t: "No Poverty"}, {id:2, c: 'bg-[#DDA63A]', t: "Zero Hunger"},
                    {id:3, c: 'bg-[#4C9F38]', t: "Good Health"}, {id:4, c: 'bg-[#C5192D]', t: "Quality Education"},
                    {id:5, c: 'bg-[#FF3A21]', t: "Gender Equality"}, {id:6, c: 'bg-[#26BDE2]', t: "Clean Water"},
                    {id:7, c: 'bg-[#FCC30B]', t: "Clean Energy"}, {id:8, c: 'bg-[#A21942]', t: "Decent Work"},
                    {id:9, c: 'bg-[#FD6925]', t: "Innovation"}, {id:10, c: 'bg-[#DD1367]', t: "Reduced Inequalities"},
                    {id:11, c: 'bg-[#FD9D24]', t: "Sustainable Cities"}, {id:12, c: 'bg-[#BF8B2E]', t: "Responsible Consumption"},
                    {id:13, c: 'bg-[#3F7E44]', t: "Climate Action"}, {id:14, c: 'bg-[#0A97D9]', t: "Life Below Water"},
                    {id:15, c: 'bg-[#56C02B]', t: "Life on Land"}, {id:16, c: 'bg-[#00689D]', t: "Peace & Justice"},
                    {id:17, c: 'bg-[#19486A]', t: "Partnerships"}, 
                ].map((s) => (
                    <div key={s.id} className={`${s.c} text-white p-4 rounded-lg shadow-sm hover:scale-105 transition cursor-pointer flex flex-col justify-center items-center aspect-square`}>
                        <span className="text-2xl font-bold opacity-90">{s.id}</span>
                        <span className="text-[10px] uppercase font-bold mt-1 leading-tight">{s.t}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- ROLE BASED SECTION (Screenshot 4) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">For All Stakeholders</span>
                <h2 className="text-4xl font-bold mt-4">Role-Based <span className="text-teal-600">Dashboards</span></h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Startup Card */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:border-teal-500 transition duration-300">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-6"><Building /></div>
                    <h3 className="text-2xl font-bold mb-4">Startups</h3>
                    <p className="text-gray-500 text-sm mb-6">Innovative companies bringing fresh solutions. Access funding and mentorship.</p>
                    <ul className="space-y-3 mb-8">
                        {['Innovation Showcase', 'Investor Matching', 'Pilot Programs'].map(i => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-teal-500" /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="text-teal-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></a>
                </div>

                {/* NGO Card (Highlighted) */}
                <div className="bg-teal-600 rounded-2xl p-8 text-white shadow-xl transform md:-translate-y-4">
                    <div className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center mb-6"><Users /></div>
                    <h3 className="text-2xl font-bold mb-4">NGOs</h3>
                    <p className="text-teal-50 text-sm mb-6">Non-profits with deep community connections. Find partners and resources.</p>
                    <ul className="space-y-3 mb-8">
                        {['Resource Sharing', 'Volunteer Networks', 'Grant Discovery'].map(i => (
                            <li key={i} className="flex gap-2 text-sm text-white"><CheckCircle size={16} /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="text-white font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></a>
                </div>

                {/* Gov Card */}
                <div className="border border-gray-200 rounded-2xl p-8 hover:border-teal-500 transition duration-300">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-6"><Building /></div>
                    <h3 className="text-2xl font-bold mb-4">Governments</h3>
                    <p className="text-gray-500 text-sm mb-6">Public sector entities seeking innovative partners for policy implementation.</p>
                    <ul className="space-y-3 mb-8">
                        {['Policy Innovation', 'Public-Private Partnerships', 'Transparency'].map(i => (
                            <li key={i} className="flex gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-teal-500" /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="text-teal-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">Learn More <ArrowRight size={16}/></a>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center font-bold">IH</div>
                    <span className="text-xl font-bold">ImpactHub</span>
                </div>
                <p className="text-gray-400 text-sm max-w-xs">
                    AI-powered collaboration platform connecting organizations for sustainable development impact.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-teal-400">Features</a></li>
                    <li><a href="#" className="hover:text-teal-400">Pricing</a></li>
                    <li><a href="#" className="hover:text-teal-400">API</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-teal-400">Privacy</a></li>
                    <li><a href="#" className="hover:text-teal-400">Terms</a></li>
                    <li><a href="#" className="hover:text-teal-400">Security</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
            ©2026 ImpactHub. Made with ❤️ for sustainable development.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;