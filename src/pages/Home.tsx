import React from "react";
import { Link } from "react-router-dom";
import { GitGraph, ArrowRight, Zap, Layers, Share2 } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <GitGraph className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            MermaidFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">GitHub</a>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            New: Interactive Mermaid Editing
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Visualize Ideas with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400">
              Infinite Flow
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The next generation Mermaid diagram editor. Transform text into beautiful, interactive React Flow diagrams with real-time editing and AI-powered assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/flowchart"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/10 flex items-center gap-2"
            >
              Launch Flowchart Editor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl transition-all duration-300 hover:bg-white/10">
              View Examples
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Real-time Sync"
            description="Edit Mermaid source and see React Flow updates instantly with bidirectional synchronization."
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-blue-400" />}
            title="Interactive Nodes"
            description="Drag, drop, and style nodes directly on the canvas. Your changes are persisted automatically."
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6 text-purple-400" />}
            title="Easy Export"
            description="Export your diagrams as high-resolution PNGs or JSON files for easy sharing and integration."
          />
        </div>
      </main>

      {/* Preview Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="container mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#1a1d23] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="aspect-video bg-[#0f1115] flex items-center justify-center">
                 <div className="text-gray-600 flex flex-col items-center gap-4">
                    <GitGraph className="w-16 h-16 opacity-20" />
                    <span className="text-sm font-medium tracking-widest uppercase opacity-50">Editor Preview</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 MermaidFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
  </div>
);

export default Home;
