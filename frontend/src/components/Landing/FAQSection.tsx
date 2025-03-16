// import { useState, useRef, useEffect } from 'react';
// import { ChevronDown, HelpCircle, Shield, Zap, ArrowRightLeft, BarChart3, Lock, FileText } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const faqs = [
//   {
//     question: "What is sBTC and how does it work with yield strategies?",
//     answer: "sBTC is a 1:1 Bitcoin-backed asset on the Stacks blockchain. Each sBTC token is fully collateralized by BTC held in a threshold cryptography vault. sBTC Yield Nexus allows you to deploy these assets across multiple DeFi protocols to generate yields while maintaining the security guarantees of Bitcoin. Our platform monitors and optimizes these positions automatically based on your risk preferences.",
//     icon: <ArrowRightLeft className="w-5 h-5" />
//   },
//   {
//     question: "How does the auto-optimization feature work?",
//     answer: "Our AI-powered yield optimizer continuously monitors market conditions across all integrated Stacks protocols. When auto-optimization is enabled, the system automatically rebalances your portfolio to maximize returns within your preset risk parameters. The algorithm analyzes APY trends, TVL changes, protocol security metrics, and market volatility to make data-driven allocation decisions. All rebalancing operations require your explicit signature approval.",
//     icon: <Zap className="w-5 h-5" />
//   },
//   {
//     question: "What security measures are in place to protect my assets?",
//     answer: "sBTC Yield Nexus employs multiple layers of security: (1) Non-custodial architecture - your assets remain under your control at all times, (2) All smart contracts undergo rigorous third-party audits, (3) Real-time risk monitoring with automatic alerts for unusual activity, (4) Protocol risk scoring to evaluate and display risk metrics for each DeFi integration, and (5) Explicit transaction signing for every action that moves your funds.",
//     icon: <Shield className="w-5 h-5" />
//   },
//   {
//     question: "Which DeFi protocols are integrated with the platform?",
//     answer: "sBTC Yield Nexus integrates with leading Stacks ecosystem protocols including ALEX (liquidity pools, options), VELAR (lending, stablecoin minting), Bitflow (yield aggregation), StackSwap (DEX, farms), and Velar (stablecoin pools). Each protocol undergoes a comprehensive security assessment before integration, and we continuously monitor their performance and security metrics. New protocols are added regularly after passing our rigorous evaluation process.",
//     icon: <BarChart3 className="w-5 h-5" />
//   },
//   {
//     question: "How does the tax reporting feature work?",
//     answer: "Our tax reporting module automatically tracks and categorizes all your on-chain activities across integrated protocols. The system generates comprehensive reports that include capital gains calculations (using FIFO, LIFO, or HIFO methods), yield income categorization, and transaction history. These reports can be exported in formats compatible with major tax software or provided to your accountant. The reporting module is regularly updated to comply with the latest regulatory guidance.",
//     icon: <FileText className="w-5 h-5" />
//   },
//   {
//     question: "What are the fees for using sBTC Yield Nexus?",
//     answer: "sBTC Yield Nexus employs a transparent fee structure with a 0.5% performance fee on generated yield (not on principal), charged only when you withdraw profits. There are no platform subscription fees, deposit fees, or withdrawal fees. You will only pay the standard network transaction fees required by the Stacks blockchain. Institutional accounts with over 10 BTC in assets qualify for custom fee arrangements with volume discounts.",
//     icon: <Lock className="w-5 h-5" />
//   }
// ];

// export const FAQSection = () => {
//   const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   // Canvas animation for sophisticated background
//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Set canvas dimensions with higher resolution
//     const resizeCanvas = () => {
//       const { width, height } = canvas.getBoundingClientRect();
//       const scale = window.devicePixelRatio || 1;
//       canvas.width = width * scale;
//       canvas.height = height * scale;
//       ctx.scale(scale, scale);
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     // Define sophisticated particle system
//     interface Particle {
//       x: number;
//       y: number;
//       size: number;
//       speedX: number;
//       speedY: number;
//       color: string;
//       opacity: number;
//       life: number;
//       maxLife: number;
//     }

//     // Create particles array
//     const particles: Particle[] = [];
//     const maxParticles = 100;

//     // Color palette for particles
//     const colors = [
//       'rgba(99, 102, 241, 0.6)',  // Indigo
//       'rgba(139, 92, 246, 0.6)',   // Violet
//       'rgba(79, 70, 229, 0.6)',   // Darker indigo
//       'rgba(124, 58, 237, 0.6)',  // Darker violet
//       'rgba(167, 139, 250, 0.6)'  // Light violet
//     ];

//     // Create node points array
//     interface Node {
//       x: number;
//       y: number;
//       radius: number;
//       connections: number[];
//       color: string;
//     }

//     const nodes: Node[] = [];
//     const nodeDensity = 20; // Lower numbers = more nodes

//     // Generate node positions
//     const canvasWidth = canvas.width / window.devicePixelRatio;
//     const canvasHeight = canvas.height / window.devicePixelRatio;

//     // Create nodes
//     for (let i = 0; i < canvasWidth / nodeDensity; i++) {
//       for (let j = 0; j < canvasHeight / nodeDensity; j++) {
//         // Add some randomness to positions
//         if (Math.random() > 0.6) { // 40% chance to create a node
//           const x = i * nodeDensity + (Math.random() * nodeDensity * 0.8);
//           const y = j * nodeDensity + (Math.random() * nodeDensity * 0.8);

//           nodes.push({
//             x,
//             y,
//             radius: 0.5 + Math.random() * 1.5,
//             connections: [],
//             color: colors[Math.floor(Math.random() * colors.length)]
//           });
//         }
//       }
//     }

//     // Connect nearby nodes
//     const maxConnectionDistance = 80;
//     for (let i = 0; i < nodes.length; i++) {
//       for (let j = i + 1; j < nodes.length; j++) {
//         const dx = nodes[i].x - nodes[j].x;
//         const dy = nodes[i].y - nodes[j].y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < maxConnectionDistance) {
//           nodes[i].connections.push(j);
//         }
//       }
//     }

//     // Generate new particle
//     const generateParticle = (x: number, y: number): Particle => {
//       const colorIndex = Math.floor(Math.random() * colors.length);
//       return {
//         x: x || Math.random() * canvasWidth,
//         y: y || Math.random() * canvasHeight,
//         size: 1 + Math.random() * 2,
//         speedX: (Math.random() - 0.5) * 0.3,
//         speedY: (Math.random() - 0.5) * 0.3,
//         color: colors[colorIndex],
//         opacity: 0.1 + Math.random() * 0.4,
//         life: 0,
//         maxLife: 100 + Math.random() * 100
//       };
//     };

//     // Animation variables
//     let animationFrame: number;
//     let lastTime = 0;

//     // Animation function
//     const animate = (timestamp: number) => {
//       const deltaTime = timestamp - lastTime;
//       lastTime = timestamp;

//       // Clear canvas with semi-transparent bg for trail effect
//       ctx.fillStyle = 'rgba(15, 23, 42, 0.03)';
//       ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//       // Draw node connections
//       for (let i = 0; i < nodes.length; i++) {
//         const node = nodes[i];

//         // Draw connections
//         for (const connectionIndex of node.connections) {
//           const connectedNode = nodes[connectionIndex];

//           // Calculate distance for opacity
//           const dx = node.x - connectedNode.x;
//           const dy = node.y - connectedNode.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           const opacity = 0.15 * (1 - distance / maxConnectionDistance);

//           ctx.beginPath();
//           ctx.moveTo(node.x, node.y);
//           ctx.lineTo(connectedNode.x, connectedNode.y);
//           ctx.strokeStyle = node.color.replace(/[\d.]+(?=\))/, opacity.toString());
//           ctx.lineWidth = 0.5;
//           ctx.stroke();
//         }
//       }

//       // Draw nodes
//       for (const node of nodes) {
//         ctx.beginPath();
//         ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
//         ctx.fillStyle = node.color.replace(/[\d.]+(?=\))/, '0.2');
//         ctx.fill();
//       }

//       // Update and draw particles
//       for (let i = particles.length - 1; i >= 0; i--) {
//         const p = particles[i];

//         // Update position
//         p.x += p.speedX * deltaTime * 0.1;
//         p.y += p.speedY * deltaTime * 0.1;

//         // Update life
//         p.life += deltaTime * 0.01;

//         // Fade out as life increases
//         p.opacity = 0.5 * (1 - p.life / p.maxLife);

//         // Draw particle
//         ctx.beginPath();
//         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//         ctx.fillStyle = p.color.replace(/[\d.]+(?=\))/, p.opacity.toString());
//         ctx.fill();

//         // Remove dead particles
//         if (p.life >= p.maxLife) {
//           particles.splice(i, 1);
//         }
//       }

//       // Add new particles occasionally
//       if (particles.length < maxParticles && Math.random() > 0.95) {
//         particles.push(generateParticle(0, 0));
//       }

//       animationFrame = requestAnimationFrame(animate);
//     };

//     animationFrame = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(animationFrame);
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);

//   return (
//     <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 py-20 rounded-lg">
//       {/* Canvas background */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full opacity-40"
//       />

//       {/* Glowing orb effects */}
//       <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

//       {/* Glow lines */}
//       <div className="absolute top-1/3 right-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
//       <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

//       <motion.div
//         className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.6 }}
//       >
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium mb-4 backdrop-blur-sm">
//             <HelpCircle className="w-4 h-4 mr-2" />
//             Have Questions?
//           </div>
//           <h2 className="text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text mb-4">
//             Frequently Asked Questions
//           </h2>
//           <p className="text-lg text-gray-300/90 max-w-3xl mx-auto">
//             Learn more about sBTC Yield Nexus, our security measures, and how we maximize your Bitcoin returns
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
//           {faqs.map((faq, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.1 }}
//               className="group relative"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl transform transition-transform group-hover:scale-[1.02] opacity-0 group-hover:opacity-100" />
//               <div className="relative bg-white/10 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
//                 <button
//                   className="w-full px-6 py-4 text-left font-medium flex items-center text-white hover:text-indigo-200 transition-colors"
//                   onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
//                 >
//                   <div className="mr-4 flex-shrink-0 bg-indigo-500/20 p-2 rounded-lg">
//                     {faq.icon}
//                   </div>
//                   <span className="flex-1">{faq.question}</span>
//                   <motion.div
//                     animate={{ rotate: selectedFaq === index ? 180 : 0 }}
//                     transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
//                     className="flex-shrink-0 ml-4"
//                   >
//                     <ChevronDown className="h-5 w-5 text-indigo-300" />
//                   </motion.div>
//                 </button>

//                 <AnimatePresence>
//                   {selectedFaq === index && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{
//                         duration: 0.4,
//                         height: {
//                           type: "spring",
//                           stiffness: 100,
//                           damping: 15
//                         },
//                         opacity: { duration: 0.25 }
//                       }}
//                       className="overflow-hidden"
//                     >
//                       <div className="px-6 pb-5 pt-2 text-gray-300/90 border-t border-white/10 leading-relaxed transition-all duration-300">
//                         <p>{faq.answer}</p>
//                         <div className="mt-3 pt-2 border-t border-white/5 flex items-center text-xs text-indigo-300/70">
//                           <Shield className="w-3 h-3 mr-1.5" />
//                           Verified information | Last updated March 2025
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* CTA Section */}
//         <motion.div
//           className="mt-16 text-center"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.6 }}
//         >
//           <div className="inline-block p-0.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500">
//             <div className="bg-slate-900 rounded-lg px-10 py-6">
//               <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
//               <p className="text-gray-300 mb-4">Our team is ready to help you navigate the world of sBTC yield optimization</p>
//               <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <button className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-lg font-medium transition-all transform hover:translate-y-[-2px]">
//                   Contact Support
//                 </button>
//                 <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-indigo-400/30 rounded-lg font-medium transition-all transform hover:translate-y-[-2px]">
//                   Read Documentation
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>

//       {/* Animation keyframes */}
//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 0.2; }
//           50% { opacity: 0.4; }
//         }

//         .animate-pulse {
//           animation: pulse 8s ease-in-out infinite;
//         }

//         .animate-pulse.delay-1000 {
//           animation-delay: 1s;
//         }

//         @keyframes shimmer {
//           0% {
//             background-position: -200% 0;
//           }
//           100% {
//             background-position: 200% 0;
//           }
//         }

//         .animate-shimmer {
//           background-size: 200% 100%;
//           animation: shimmer 3s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FAQSection;

import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Zap, ArrowRightLeft, BarChart3, Lock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "What is sBTC and how does it work with yield strategies?",
    answer: "sBTC is a 1:1 Bitcoin-backed asset on the Stacks blockchain. Each sBTC token is fully collateralized by BTC held in a threshold cryptography vault. sBTC Yield Nexus allows you to deploy these assets across multiple DeFi protocols to generate yields while maintaining the security guarantees of Bitcoin. Our platform monitors and optimizes these positions automatically based on your risk preferences.",
    icon: <ArrowRightLeft className="w-5 h-5" />
  },
  {
    question: "How does the auto-optimization feature work?",
    answer: "Our AI-powered yield optimizer continuously monitors market conditions across all integrated Stacks protocols. When auto-optimization is enabled, the system automatically rebalances your portfolio to maximize returns within your preset risk parameters. The algorithm analyzes APY trends, TVL changes, protocol security metrics, and market volatility to make data-driven allocation decisions. All rebalancing operations require your explicit signature approval.",
    icon: <Zap className="w-5 h-5" />
  },
  {
    question: "What security measures are in place to protect my assets?",
    answer: "sBTC Yield Nexus employs multiple layers of security: (1) Non-custodial architecture - your assets remain under your control at all times, (2) All smart contracts undergo rigorous third-party audits, (3) Real-time risk monitoring with automatic alerts for unusual activity, (4) Protocol risk scoring to evaluate and display risk metrics for each DeFi integration, and (5) Explicit transaction signing for every action that moves your funds.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    question: "Which DeFi protocols are integrated with the platform?",
    answer: "sBTC Yield Nexus integrates with leading Stacks ecosystem protocols including ALEX (liquidity pools, options), VELAR (lending, stablecoin minting), Bitflow (yield aggregation), StackSwap (DEX, farms), and Velar (stablecoin pools). Each protocol undergoes a comprehensive security assessment before integration, and we continuously monitor their performance and security metrics. New protocols are added regularly after passing our rigorous evaluation process.",
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    question: "How does the tax reporting feature work?",
    answer: "Our tax reporting module automatically tracks and categorizes all your on-chain activities across integrated protocols. The system generates comprehensive reports that include capital gains calculations (using FIFO, LIFO, or HIFO methods), yield income categorization, and transaction history. These reports can be exported in formats compatible with major tax software or provided to your accountant. The reporting module is regularly updated to comply with the latest regulatory guidance.",
    icon: <FileText className="w-5 h-5" />
  },
  {
    question: "What are the fees for using sBTC Yield Nexus?",
    answer: "sBTC Yield Nexus employs a transparent fee structure with a 0.5% performance fee on generated yield (not on principal), charged only when you withdraw profits. There are no platform subscription fees, deposit fees, or withdrawal fees. You will only pay the standard network transaction fees required by the Stacks blockchain. Institutional accounts with over 10 BTC in assets qualify for custom fee arrangements with volume discounts.",
    icon: <Lock className="w-5 h-5" />
  }
];

export const FAQSection = () => {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900/80 via-slate-900 to-violet-900/80 py-14 rounded-lg">
      {/* Subtle background elements instead of heavy canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        {/* Subtle glow orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl opacity-50" />

        {/* Accent lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      </div>

      <motion.div
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium mb-3 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            Have Questions?
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-300/90 max-w-2xl mx-auto text-base">
            Learn more about sBTC Yield Nexus and how we maximize your Bitcoin returns
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <div className="relative bg-white/10 rounded-lg border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/15">
                <button
                  className="w-full px-5 py-3 text-left font-medium flex items-center text-white hover:text-indigo-200 transition-colors"
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                >
                  <div className="mr-3 flex-shrink-0 bg-indigo-500/20 p-1.5 rounded-md">
                    {faq.icon}
                  </div>
                  <span className="flex-1 text-sm">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: selectedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                    className="flex-shrink-0 ml-3"
                  >
                    <ChevronDown className="h-4 w-4 text-indigo-300" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {selectedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        height: {
                          type: "spring",
                          stiffness: 100,
                          damping: 15
                        },
                        opacity: { duration: 0.25 }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-gray-300/90 border-t border-white/10 leading-relaxed text-xs">
                        <p>{faq.answer}</p>
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center text-xs text-indigo-300/60">
                          <Shield className="w-3 h-3 mr-1.5" />
                          Verified information | Last updated March 2025
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More compact CTA Section */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-block p-px rounded-lg bg-gradient-to-r from-indigo-500/50 to-violet-500/50">
            <div className="bg-slate-900/60 backdrop-blur-sm rounded-lg px-6 py-4">
              <p className="text-gray-300 mb-3 text-sm">Our team is ready to help you navigate the world of sBTC yield optimization</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-md text-sm font-medium transition-all">
                  Contact Support
                </button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-indigo-400/30 rounded-md text-sm font-medium transition-all">
                  Read Documentation
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Simple animation keyframes */}
      <style >{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse {
          animation: pulse 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;