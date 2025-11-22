import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  X,
  MessageSquare,
  FileText,
  ExternalLink,
  Loader2,
  ArrowRight,
  Command
} from 'lucide-react';

// --- Resume Data (Same as before) ---
const RESUME_DATA = {
  basics: {
    name: "Harsha Srinivas",
    label: "Frontend Developer",
    location: "Bangalore, India",
    email: "harshasrinivas1010@gmail.com",
    phone: "+91 9148434583",
    website: "harshaportfolio10.netlify.app",
    linkedin: "linkedin.com/in/harsha-srinivas10",
    github: "github.com/harsha1010-art",
    summary: "Experienced Frontend Developer specializing in React.js, Next.js, and modern web technologies. Proven track record in leading teams, building B2B marketplaces, and integrating AI/ML workflows."
  },
  skills: {
    frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "React Native", "Tailwind CSS", "Shadcn UI", "Redux"], 
    backend: ["Node.js", "GraphQL", "WebSockets", "AWS", "Docker", "Firebase", "PostgreSQL", "Python"],
    tools: ["Git", "GitHub Actions", "Vite", "Figma"],
    leadership: ["Team Leadership", "Architecture Design", "Code Review", "Technical Documentation"]
  },
  experience: [
    {
      company: "Ango Digital Technologies",
      position: "Frontend Developer",
      location: "Bangalore",
      startDate: "2025",
      endDate: "Present",
      highlights: [
        "Led a 4-member cross-functional team to build a B2B marketplace platform from inception.",
        "Architected role-based dashboards with real-time WebSocket updates, reducing order fulfillment time by 25%.",
        "Engineered hotel management web and mobile apps with Razorpay integration.",
        "Built SEO-optimized marketing website using Next.js implementing advanced optimization strategies.",
        "Developed multi-agent AI chatbot system integrating OpenAI, LangChain, and CrewAI."
      ]
    },
    {
      company: "Code Nimbus Solutions",
      position: "Frontend Developer",
      location: "Bangalore",
      startDate: "2024",
      endDate: "2024",
      highlights: [
        "Delivered enterprise e-invitation platform from concept to launch, increasing active users by 60%.",
        "Enhanced page load times by 3-5 seconds and boosted Lighthouse scores to 90+.",
        "Implemented AWS S3 integration for image workflows, reducing hosting costs by 30%."
      ]
    },
    {
      company: "Foreintel Solutions",
      position: "Design Engineer",
      location: "Bangalore",
      startDate: "2023",
      endDate: "2023",
      highlights: [
        "Developed drone control UIs integrating hardware with real-time monitoring tools.",
        "Developed telemetry dashboards and GPS tracking systems with real-time data visualization.",
        "Designed advanced VTOL drone systems achieving 1-hour sustained flight."
      ]
    },
    {
      company: "Big Buddy",
      position: "Frontend Developer",
      location: "Bangalore",
      startDate: "2022",
      endDate: "2023",
      highlights: [
        "Developed AI-based video editing and video conferencing software using WebRTC.",
        "Implemented interactive whiteboard features and live chat functionality."
      ]
    }
  ],
  projects: [
    {
      name: "B2B Marketplace Platform",
      tech: "React.js • WebSockets • AWS",
      description: "Architected enterprise marketplace with role-based dashboards serving 500+ daily active users. Implemented real-time order updates reducing fulfillment time by 25%."
    },
    {
      name: "Multi-Agent AI Chatbot",
      tech: "React.js • OpenAI • RAG",
      description: "Developed intelligent chatbot system using RAG for context-aware responses with 85% accuracy improvement. Orchestrated multiple AI agents for task-specific workflows."
    }
  ],
  education: [
    {
      institution: "BMS College of Engineering",
      area: "Bachelor of Engineering",
      location: "Bengaluru",
      startDate: "2018",
      endDate: "2022"
    }
  ]
};


const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

const callGeminiAPI = async (prompt, systemInstruction = "") => {
  try {
    // Retry logic (Exponential Backoff)
    let data;
    let response;
    let attempt = 0;
    const maxRetries = 3;
    
    while (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s

      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          }),
        }
      );
      
      if (response.ok) {
        data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response at the moment.";
      }
      
      attempt++;
    }

    // If all retries fail
    throw new Error(`HTTP error! status: ${response.status}`);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently experiencing high traffic. Please try again in a moment.";
  }
};

const CHAT_SYSTEM_PROMPT = `
You are an AI Assistant representing Harsha Srinivas. You have access to his resume data below.
Resume Data: ${JSON.stringify(RESUME_DATA)}

Your Guidelines:
1. Answer questions professionally but briefly, in a minimalist style.
2. Highlight his skills in React, AI (LangChain/OpenAI), and System Architecture.
3. CRITICAL: When addressing career changes or short tenures, you must provide a nuanced, professional explanation, emphasizing that the primary driver now is seeking a long-term, stable environment:
    - If the user asks specifically about **Ango Digital Technologies**, state: "The move from Ango Digital is due to significant financial instability at the company, and was not performance-related. Harsha is now focused on finding a stable, long-term environment."
    - If the user asks specifically about **Code Nimbus Solutions** (or earlier pre-Ango moves), state: "The move from Code Nimbus was a strategic progression, marking his dedicated pivot to specialized Enterprise Frontend development, rapidly accelerating his skill mastery."
    - If the user asks generally about "job hopping," "career path," or "short tenures" without naming a specific company, use this detailed, strategic progression narrative: "That is an excellent question. Harsha is now actively seeking a **long-term stable environment** where he can apply his expertise. His career progression has been strategic: 1. **Big Buddy** was his first role, effectively an internship. 2. **Foreintel Solutions** was a shift into the niche field of hardware integration and design engineering, providing valuable experience in real-time systems. 3. **Code Nimbus Solutions** marked a dedicated pivot back to full-stack enterprise web development, leveraging **React.js** and system optimization. 4. His current role at **Ango Digital Technologies** provided leadership experience in building a **B2B marketplace** and integrating advanced **AI/ML workflows** (using **LangChain** and **OpenAI**). However, the move from Ango Digital is due to **significant financial instability** at the company. Harsha is looking for a place to build a long-term career and utilize his skills in **React.js, Next.js, and system architecture.**"
4. If asked about contact info, provide his email and phone.
`;

const EMAIL_SYSTEM_PROMPT = `
You are an expert Technical Recruiter Assistant. 
Draft a concise, high-impact recruiting email TO Harsha Srinivas.
Resume Data: ${JSON.stringify(RESUME_DATA)}
Focus on matching his skills to the provided Job Role. Keep it professional and direct.
`;

// New: Common suggestions shown after every reply
const COMMON_SUGGESTIONS = [
  "Why hire you?", 
  "AI Project Details",
  "React/Next.js skills",
  "Job Hopping Explanation",
  "Contact Info",
  "Ask about WebRTC"
];

// --- Components ---

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 15); // Adjust typing speed here
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <div dangerouslySetInnerHTML={{ 
      __html: displayedText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="underline decoration-zinc-400 hover:text-black">$1</a>')
    }} />
  );
};

const MinimalSection = ({ title, children, delay }) => (
  <section 
    className="mb-12 opacity-0 animate-fadeInUp" 
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
  >
    <h3 className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase mb-6 border-b border-zinc-100 pb-2">
      {title}
    </h3>
    {children}
  </section>
);

const MinimalExperience = ({ role, company, date, points }) => (
  <div className="group mb-8 last:mb-0 relative pl-6 border-l border-zinc-200 hover:border-black transition-colors duration-500">
    <div className="absolute -left-[1px] top-0 bottom-0 w-[1px] bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
      <h4 className="text-lg font-medium text-zinc-900 group-hover:translate-x-2 transition-transform duration-300 ease-out">{role}</h4>
      <span className="text-xs font-mono text-zinc-400">{date}</span>
    </div>
    <div className="mb-3 text-sm font-medium text-zinc-500">{company}</div>
    <ul className="space-y-2">
      {points.map((point, idx) => (
        <li key={idx} className="text-zinc-600 text-sm leading-relaxed font-light hover:text-black transition-colors duration-300">
          {point}
        </li>
      ))}
    </ul>
  </div>
);

const MinimalProject = ({ name, tech, description }) => (
  <div className="group bg-zinc-50 p-6 border border-transparent hover:border-zinc-200 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 rounded-sm">
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-base font-semibold text-zinc-900 group-hover:tracking-wide transition-all duration-300">{name}</h4>
      <ArrowRight className="w-4 h-4 text-zinc-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </div>
    <p className="text-xs font-mono text-zinc-400 mb-3">{tech}</p>
    <p className="text-sm text-zinc-600 font-light leading-relaxed">{description}</p>
  </div>
);
const LoadingScreen = ({ isMounted }) => {
    return (
        <div className={`fixed inset-0 bg-white z-[100] transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="relative w-20 h-20">
                    {/* The code tag icon */}
                    <svg className="w-20 h-20 text-black absolute inset-0 animate-spin-slow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <style>
                            {`
                                @keyframes rotate-slow {
                                    from { transform: rotate(0deg); }
                                    to { transform: rotate(360deg); }
                                }
                                .animate-spin-slow {
                                    animation: rotate-slow 5s linear infinite;
                                }
                                .animate-fade-in-out {
                                    animation: fade-in-out 2s infinite alternate;
                                }
                                @keyframes fade-in-out {
                                    0% { opacity: 0.2; }
                                    100% { opacity: 1; }
                                }
                                .stagger-delay-1 { animation-delay: 0.2s; }
                                .stagger-delay-2 { animation-delay: 0.4s; }
                                .stagger-delay-3 { animation-delay: 0.6s; }
                            `}
                        </style>
                        {/* Outer bracket 1 */}
                        <path className="animate-fade-in-out" d="M14 6L19 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Outer bracket 2 */}
                        <path className="animate-fade-in-out stagger-delay-1" d="M10 18L5 12L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Inner slash (Code) */}
                        <path className="animate-fade-in-out stagger-delay-2" d="M9 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path className="animate-fade-in-out stagger-delay-3" d="M9 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] font-light text-zinc-500 mt-8 animate-pulse">
                    LOADING HARSHA SRINIVAS PORTFOLIO...
                </p>
            </div>
        </div>
    );
};
// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState('resume'); 
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      text: "Harsha's AI here. Ask me about his architecture, AI work, or career path." 
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Email Modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recruiterCompany, setRecruiterCompany] = useState('');
  const [recruiterRole, setRecruiterRole] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true); 

useEffect(() => {
    // Simulate network delay/initialization
    const timer = setTimeout(() => {
        setIsLoadingScreen(false);
    }, 2500); // 2.5 second display for the cool animation

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsChatLoading(true);
    const aiResponse = await callGeminiAPI(userMsg.text, CHAT_SYSTEM_PROMPT);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: aiResponse, isNew: true }]);
    setIsChatLoading(false);
  };

  const handleGenerateEmail = async (e) => {
    e.preventDefault();
    if (!recruiterCompany || !recruiterRole) return;
    setIsEmailLoading(true);
    const prompt = `Company: ${recruiterCompany}, Role: ${recruiterRole}`;
    const emailContent = await callGeminiAPI(prompt, EMAIL_SYSTEM_PROMPT);
    setGeneratedEmail(emailContent);
    setIsEmailLoading(false);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
      <LoadingScreen isMounted={isLoadingScreen} />

      <div className="flex h-screen bg-white font-sans text-zinc-900 overflow-hidden relative selection:bg-black selection:text-white">
        
        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 relative border border-zinc-100 scale-95 animate-in zoom-in-95 duration-300 slide-in-from-bottom-2">
              <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors hover:rotate-90 duration-300">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-light mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-900" /> Recruiter Assistant
              </h3>
              
              {!generatedEmail ? (
                <form onSubmit={handleGenerateEmail} className="space-y-6">
                  <div className="group">
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2 group-focus-within:text-black transition-colors">Company</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-3 bg-zinc-50 border-b border-zinc-200 focus:border-black outline-none transition-all duration-300"
                      placeholder="Company Name"
                      value={recruiterCompany}
                      onChange={(e) => setRecruiterCompany(e.target.value)}
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2 group-focus-within:text-black transition-colors">Role</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-3 bg-zinc-50 border-b border-zinc-200 focus:border-black outline-none transition-all duration-300"
                      placeholder="Job Title"
                      value={recruiterRole}
                      onChange={(e) => setRecruiterRole(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isEmailLoading}
                    className="w-full py-4 bg-black text-white hover:bg-zinc-800 transition-all duration-300 text-sm font-medium flex justify-center items-center gap-2 tracking-wide"
                  >
                    {isEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Draft Email"}
                  </button>
                </form>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <div className="bg-zinc-50 p-6 text-sm font-light leading-relaxed whitespace-pre-wrap text-zinc-700 border border-zinc-100 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                    {generatedEmail}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {navigator.clipboard.writeText(generatedEmail);}} className="flex-1 py-3 border border-zinc-200 hover:bg-black hover:text-white transition-all duration-300 text-xs uppercase tracking-wider">Copy</button>
                    <button onClick={() => setGeneratedEmail('')} className="flex-1 py-3 bg-black text-white hover:bg-zinc-800 transition-colors text-xs uppercase tracking-wider">Reset</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Left Panel: Resume --- */}
        <div className={`
          flex-1 overflow-y-auto custom-scrollbar
          ${isMobile && activeTab !== 'resume' ? 'hidden' : 'block'}
        `}>
          <div className="max-w-3xl mx-auto p-8 md:p-16 min-h-full">
            
            {/* Header */}
            <header className="mb-16 opacity-0 animate-fadeInUp" style={{ animationFillMode: 'forwards' }}>
              <h1 className="text-5xl font-light tracking-tight text-black mb-2">
                {RESUME_DATA.basics.name}
              </h1>
              <p className="text-xl text-zinc-500 font-light mb-8">{RESUME_DATA.basics.label}</p>
              
              <div className="flex flex-wrap gap-6 text-sm font-mono text-zinc-400 mb-8">
                <a href={`mailto:${RESUME_DATA.basics.email}`} className="hover:text-black transition-colors">{RESUME_DATA.basics.email}</a>
                <span>/</span>
                <a href={`tel:${RESUME_DATA.basics.phone}`} className="hover:text-black transition-colors">{RESUME_DATA.basics.phone}</a>
                <span>/</span>
                <span className="text-zinc-400">{RESUME_DATA.basics.location}</span>
              </div>

              <div className="flex gap-4">
                 {[
                   { icon: Linkedin, link: `https://${RESUME_DATA.basics.linkedin}` },
                   { icon: Github, link: `https://${RESUME_DATA.basics.github}` },
                   { icon: Globe, link: `https://${RESUME_DATA.basics.website}` }
                 ].map((item, i) => (
                   <a key={i} href={item.link} target="_blank" rel="noreferrer" className="p-2 border border-zinc-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 group">
                     <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                   </a>
                 ))}
                 <button 
                  onClick={() => setShowEmailModal(true)}
                  className="ml-auto px-6 py-2 bg-black text-white text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all duration-300 hover:tracking-[0.2em]"
                 >
                   Draft Email
                 </button>
              </div>
            </header>

            <MinimalSection title="About" delay={100}>
              <p className="text-zinc-600 leading-relaxed font-light text-lg">
                {RESUME_DATA.basics.summary}
              </p>
            </MinimalSection>

            <MinimalSection title="Expertise" delay={200}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="group">
                   <h4 className="font-medium text-sm mb-3 group-hover:text-black transition-colors">Frontend</h4>
                   <div className="flex flex-wrap gap-2 text-zinc-500 font-light text-sm">
                     {RESUME_DATA.skills.frontend.join(' / ')}
                   </div>
                 </div>
                 <div className="group">
                   <h4 className="font-medium text-sm mb-3 group-hover:text-black transition-colors">Backend</h4>
                   <div className="flex flex-wrap gap-2 text-zinc-500 font-light text-sm">
                     {RESUME_DATA.skills.backend.join(' / ')}
                   </div>
                 </div>
                 <div className="group">
                   <h4 className="font-medium text-sm mb-3 group-hover:text-black transition-colors">Leadership</h4>
                   <div className="flex flex-wrap gap-2 text-zinc-500 font-light text-sm">
                     {RESUME_DATA.skills.leadership.join(' / ')}
                   </div>
                 </div>
              </div>
            </MinimalSection>

            <MinimalSection title="Experience" delay={300}>
              {RESUME_DATA.experience.map((job, index) => (
                <MinimalExperience key={index} {...job} date={`${job.startDate} — ${job.endDate}`} points={job.highlights} />
              ))}
            </MinimalSection>

            <MinimalSection title="Projects" delay={400}>
              <div className="grid md:grid-cols-2 gap-4">
                {RESUME_DATA.projects.map((proj, index) => (
                  <MinimalProject key={index} {...proj} />
                ))}
              </div>
            </MinimalSection>
            
             <MinimalSection title="Education" delay={500}>
              <div className="flex justify-between items-baseline border-b border-zinc-100 pb-2 hover:border-black transition-colors duration-500">
                <span className="text-base font-medium">{RESUME_DATA.education[0].institution}</span>
                <span className="text-xs font-mono text-zinc-400">2018 — 2022</span>
              </div>
              <p className="text-sm text-zinc-500 mt-2">{RESUME_DATA.education[0].area}</p>
            </MinimalSection>

          </div>
        </div>

        {/* --- Right Panel: Minimal Chat --- */}
        <div className={`
          w-full lg:w-[500px] bg-zinc-50 border-l border-zinc-200 flex flex-col z-20 shadow-[-10px_0_40px_-15px_rgba(0,0,0,0.05)]
          ${isMobile && activeTab !== 'chat' ? 'hidden' : 'flex'}
        `}>
          <div className="p-6 border-b border-zinc-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                <Command className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">AI AGENT</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-glow"></span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <span className="text-[10px] text-zinc-300 uppercase tracking-widest mb-1">
                  {msg.role === 'user' ? 'You' : 'Harsha AI'}
                </span>
                <div className={`
                  max-w-[90%] text-sm leading-relaxed p-4 shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-black text-white' 
                    : 'bg-white border border-zinc-200 text-zinc-700'}
                `}>
                   {msg.role === 'assistant' && msg.isNew ? (
                     <TypewriterText text={msg.text} />
                   ) : (
                     msg.text.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ 
                           __html: line
                             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                             .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="underline decoration-zinc-400 hover:text-black">$1</a>')
                         }} />
                    ))
                   )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 p-4 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Computing response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-zinc-200 z-10 sm:mb-0 mb-5">
             {!isChatLoading && (
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                {COMMON_SUGGESTIONS.map((chip, idx) => (
                  <button 
                    key={chip} 
                    onClick={(e) => { setInput(chip); handleSend(e); }}
                    className="whitespace-nowrap px-3 py-1 border border-zinc-200 text-[10px] uppercase tracking-wider text-zinc-500 hover:border-black hover:text-black transition-colors opacity-0 animate-fadeInUp"
                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command..."
                className="w-full bg-zinc-50 border-b border-zinc-200 p-3 pr-10 text-sm focus:border-black focus:bg-white outline-none transition-all duration-300 placeholder:text-zinc-400 group-hover:bg-zinc-50/80"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isChatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors disabled:opacity-30 hover:scale-110 active:scale-95 duration-200"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

         {/* --- Mobile Tabs --- */}
         {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around p-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            <button onClick={() => setActiveTab('resume')} className={`text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'resume' ? 'text-black font-bold scale-105' : 'text-zinc-400'}`}>Resume</button>
            <button onClick={() => setActiveTab('chat')} className={`text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'chat' ? 'text-black font-bold scale-105' : 'text-zinc-400'}`}>AI Chat</button>
          </div>
        )}

      </div>
    </>
  );
};

export default App;