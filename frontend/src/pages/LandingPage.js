import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Users, Sparkles, ArrowRight, Play, 
  Target, BarChart3, Building, CheckCircle, Search, 
  Wallet, Wheat, HeartPulse, BookOpen, Scale, Droplets, Zap, 
  TrendingUp, Lightbulb, ArrowRightLeft, Building2, Recycle, 
  CloudSun, Fish, TreeDeciduous, ShieldCheck, Handshake, Leaf
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-8 py-4 sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100 supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center gap-2">
          {/* Using a placeholder for the logo as the local file won't load here */}
          <div className="w-8 h-8 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-lg flex items-center justify-center text-white">
            <Leaf size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">ImpactHub</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-teal-600 transition">Features</a>
          <a href="#sdgs" className="hover:text-teal-600 transition">SDG Goals</a>
          <a href="#howitworks" className="hover:text-teal-600 transition">How It Works</a>
        </div>

        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 hover:text-teal-600 px-4 py-2 rounded-full hover:bg-gray-50 transition">Sign In</button>
          <button onClick={() => navigate('/login')} className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-teal-700 transition shadow-md shadow-teal-200/50">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-28 pb-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-500 z-0"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-fade-in-up">
            <Sparkles size={16} className="text-yellow-300" fill="currentColor" />
            <span className="text-sm font-medium">AI-Powered Partnership Matching</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-sm">
            Connect & Collaborate for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-100 via-white to-emerald-100">Global Impact</span>
          </h1>

          <p className="text-lg md:text-xl text-teal-50 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Empowering startups, NGOs, and governments to discover partners, share resources, 
            and drive SDG-aligned projects using intelligent AI matching.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <button onClick={() => navigate('/login')} className="bg-white text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 rounded-full font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 transition flex items-center justify-center gap-2 backdrop-blur-md">
              <Play size={20} fill="currentColor" /> Watch Demo
            </button>
          </div>

          {/* Glassmorphism Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition hover:-translate-y-1">
              <Globe size={32} className="text-yellow-300 mx-auto mb-3" />
              <div className="text-3xl font-extrabold">17</div>
              <div className="text-teal-100 text-sm font-medium">SDG Goals Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition hover:-translate-y-1">
              <Users size={32} className="text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-extrabold">500+</div>
              <div className="text-teal-100 text-sm font-medium">Organizations Connected</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl hover:bg-white/15 transition hover:-translate-y-1">
              <Sparkles size={32} className="text-purple-300 mx-auto mb-3" />
              <div className="text-3xl font-extrabold">98%</div>
              <div className="text-teal-100 text-sm font-medium">AI Match Accuracy</div>
            </div>
          </div>
        </div>
      </header>

      {/* --- AI FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">AI & ML Powered</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-4">Intelligence That Drives <span className="text-teal-600">Real Impact</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Our platform leverages cutting-edge artificial intelligence to transform how organizations collaborate on sustainable development goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition">
                <Sparkles size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Partner Matching</h3>
              <p className="text-gray-500 leading-relaxed">
                Our AI analyzes organizational profiles, capabilities, and goals to recommend the perfect partners for your SDG projects.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition">
                <Target size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Impact Prediction</h3>
              <p className="text-gray-500 leading-relaxed">
                ML models forecast project outcomes, helping you prioritize initiatives with the highest potential for sustainable impact.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition">
                <BarChart3 size={30} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Progress Analytics</h3>
              <p className="text-gray-500 leading-relaxed">
                Real-time dashboards powered by data science track milestones, resources, and KPIs across all your collaborations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="howitworks" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
              <span className="bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase">Simple Process</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-4">How It <span className="text-teal-600">Works</span></h2>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">A streamlined four-step process designed to get you from signup to impact as efficiently as possible.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Building size={24} />, step: "01", title: "Create Profile", desc: "Register & define your specific SDG focus areas." },
              { icon: <Search size={24} />, step: "02", title: "Discover Partners", desc: "AI surfaces relevant collaboration opportunities." },
              { icon: <Users size={24} />, step: "03", title: "Collaborate", desc: "Use built-in tools to plan and execute projects." },
              { icon: <BarChart3 size={24} />, step: "04", title: "Track Impact", desc: "Monitor progress with real-time dashboards." },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-gray-300">
                      <ArrowRight size={24} />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-teal-600">
                        {item.icon}
                      </div>
                      <span className="text-5xl font-black text-gray-200/80 select-none font-mono">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* --- SDG GRID (ATTRACTIVE & MODERN) --- */}
       <section id="sdgs" className="py-24 bg-slate-100 relative overflow-hidden">
        {/* Subtle textured background */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">UN Sustainable Development Goals</span>
            <h2 className="text-4xl font-bold mt-6 mb-6 text-gray-900">Aligned With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Global Goals</span></h2>
            <p className="text-gray-600 mb-16 max-w-2xl mx-auto text-lg">Every project on our platform maps directly to the UN's 17 Sustainable Development Goals, ensuring measurable global impact.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {[
                    {id:1, c: 'bg-[#E5243B]', t: "No Poverty", icon: <Wallet />}, 
                    {id:2, c: 'bg-[#DDA63A]', t: "Zero Hunger", icon: <Wheat />},
                    {id:3, c: 'bg-[#4C9F38]', t: "Good Health", icon: <HeartPulse />}, 
                    {id:4, c: 'bg-[#C5192D]', t: "Quality Education", icon: <BookOpen />},
                    {id:5, c: 'bg-[#FF3A21]', t: "Gender Equality", icon: <Scale />}, 
                    {id:6, c: 'bg-[#26BDE2]', t: "Clean Water", icon: <Droplets />},
                    {id:7, c: 'bg-[#FCC30B]', t: "Clean Energy", icon: <Zap />}, 
                    {id:8, c: 'bg-[#A21942]', t: "Decent Work", icon: <TrendingUp />},
                    {id:9, c: 'bg-[#FD6925]', t: "Innovation", icon: <Lightbulb />}, 
                    {id:10, c: 'bg-[#DD1367]', t: "Reduced Inequalities", icon: <ArrowRightLeft />},
                    {id:11, c: 'bg-[#FD9D24]', t: "Sustainable Cities", icon: <Building2 />}, 
                    {id:12, c: 'bg-[#BF8B2E]', t: "Consumption", icon: <Recycle />},
                    {id:13, c: 'bg-[#3F7E44]', t: "Climate Action", icon: <CloudSun />}, 
                    {id:14, c: 'bg-[#0A97D9]', t: "Life Below Water", icon: <Fish />},
                    {id:15, c: 'bg-[#56C02B]', t: "Life on Land", icon: <TreeDeciduous />}, 
                    {id:16, c: 'bg-[#00689D]', t: "Peace & Justice", icon: <ShieldCheck />},
                    {id:17, c: 'bg-[#19486A]', t: "Partnerships", icon: <Handshake />}, 
                ].map((s) => (
                    <div 
                        key={s.id} 
                        className={`${s.c} group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col items-center p-5 aspect-[4/5]`}
                    >
                        {/* Glassy Gradient Overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
                        
                        {/* Large translucent number in corner */}
                        <span className="absolute top-1 right-3 text-4xl font-black text-white/20 select-none">{s.id}</span>

                        {/* Icon Container with backdrop blur */}
                        <div className="mb-4 mt-4 p-3 bg-white/20 backdrop-blur-md rounded-full shadow-sm group-hover:bg-white/30 transition-colors">
                           {React.cloneElement(s.icon, { size: 32, strokeWidth: 1.5, className: "text-white drop-shadow-sm" })}
                        </div>

                        {/* Text */}
                        <span className="text-sm font-bold text-white text-center leading-tight mt-auto drop-shadow-sm px-2">
                            {s.t}
                        </span>
                    </div>
                ))}
                {/* Empty slot for grid alignment if needed on larger screens */}
                <div className="hidden lg:block bg-gray-200/50 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center aspect-[4/5]">
                  <span className="text-gray-400 font-bold text-sm">Join Us</span>
                </div>
            </div>
        </div>
      </section>

      {/* --- ROLE BASED SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase">For All Stakeholders</span>
                <h2 className="text-4xl font-bold mt-4 text-gray-900">Role-Based <span className="text-teal-600">Dashboards</span></h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Startup Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-teal-500 hover:shadow-xl transition duration-300 group">
                    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition"><Building size={28} /></div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Startups</h3>
                    <p className="text-gray-500 text-base mb-8">Innovative companies bringing fresh solutions. Access funding and mentorship opportunities.</p>
                    <ul className="space-y-4 mb-8">
                        {['Innovation Showcase', 'Investor Matching', 'Pilot Programs'].map(i => (
                            <li key={i} className="flex gap-3 text-gray-700 font-medium"><CheckCircle size={20} className="text-teal-500 flex-shrink-0" /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="text-teal-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">Learn More <ArrowRight size={18}/></a>
                </div>

                {/* NGO Card (Highlighted) */}
                <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-10 text-white shadow-2xl transform md:-translate-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner"><Users size={32} /></div>
                    <h3 className="text-3xl font-extrabold mb-4">NGOs</h3>
                    <p className="text-teal-50 text-lg mb-8 font-medium">Non-profits with deep community connections. Find the right partners and resources effectively.</p>
                    <ul className="space-y-4 mb-8">
                        {['Resource Sharing Network', 'Volunteer Mobilization', 'Grant Discovery AI'].map(i => (
                            <li key={i} className="flex gap-3 text-white font-medium"><CheckCircle size={20} className="text-teal-200 flex-shrink-0" /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="inline-flex bg-white text-teal-700 px-6 py-3 rounded-full font-bold items-center gap-2 hover:bg-teal-50 transition-all shadow-md">Get Started <ArrowRight size={18}/></a>
                </div>

                {/* Gov Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:border-teal-500 hover:shadow-xl transition duration-300 group">
                    <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition"><Building2 size={28} /></div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Governments</h3>
                    <p className="text-gray-500 text-base mb-8">Public sector entities seeking innovative private-sector partners for policy implementation.</p>
                    <ul className="space-y-4 mb-8">
                        {['Policy Innovation Ops', 'Public-Private Partnerships', 'Impact Transparency'].map(i => (
                            <li key={i} className="flex gap-3 text-gray-700 font-medium"><CheckCircle size={20} className="text-teal-500 flex-shrink-0" /> {i}</li>
                        ))}
                    </ul>
                    <a href="#" className="text-teal-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">Learn More <ArrowRight size={18}/></a>
                </div>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center text-white">
                        <Leaf size={24} fill="currentColor" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">ImpactHub</span>
                </div>
                <p className="text-gray-400 text-base max-w-sm leading-relaxed mb-8">
                    The world's leading AI-powered collaboration platform connecting organizations for measurable sustainable development impact.
                </p>
                <div className="flex gap-4">
                    {/* Placeholder social icons */}
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-gray-800 rounded-full hover:bg-teal-600 transition cursor-pointer"></div>)}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-6">Product</h4>
                <ul className="space-y-4 text-gray-400 font-medium">
                    <li><a href="#" className="hover:text-teal-400 transition">Features & AI</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Success Stories</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Pricing Plans</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Developer API</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg mb-6">Company & Legal</h4>
                <ul className="space-y-4 text-gray-400 font-medium">
                    <li><a href="#" className="hover:text-teal-400 transition">About Us</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-teal-400 transition">Security Status</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 ImpactHub Inc. All rights reserved.</p>
            <p>Made with <span className="text-red-500">❤</span> for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;