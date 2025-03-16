import React, { useRef, useEffect } from 'react';
import {
  Wallet,
  BarChart3,
  ArrowRightLeft,
  Coins,
  Zap,
  ChevronRight
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  iconBg: string;
  iconColor: string;
}

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Enhanced Web3 blockchain network animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for crisp graphics
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Define blockchain network elements
    interface Node {
      x: number;
      y: number;
      radius: number;
      color: string;
      pulse: number;
      pulseDirection: number;
      connections: number[];
      moving: boolean;
      velocityX: number;
      velocityY: number;
    }

    interface Particle {
      x: number;
      y: number;
      size: number;
      sourceNode: number;
      targetNode: number;
      progress: number;
      speed: number;
      color: string;
    }

    // Blockchain nodes
    const nodes: Node[] = [];
    const numNodes = 25; // Fewer but more meaningful nodes
    const particles: Particle[] = [];
    const maxConnections = 5; // Limit connections for better visuals

    // Color palette - blockchain-inspired with light theme
    const nodeColors = [
      'rgba(99, 102, 241, 0.6)',  // Indigo
      'rgba(139, 92, 246, 0.6)',  // Violet
      'rgba(79, 70, 229, 0.6)',   // Indigo darker
      'rgba(236, 72, 153, 0.5)',  // Pink
      'rgba(245, 158, 11, 0.5)'   // Amber
    ];

    const particleColors = [
      'rgba(99, 102, 241, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(236, 72, 153, 0.6)',
      'rgba(245, 158, 11, 0.6)'
    ];

    // Create blockchain nodes
    for (let i = 0; i < numNodes; i++) {
      const x = 50 + Math.random() * (canvas.width / window.devicePixelRatio - 100);
      const y = 50 + Math.random() * (canvas.height / window.devicePixelRatio - 100);
      const radius = 2 + Math.random() * 3;
      const colorIndex = Math.floor(Math.random() * nodeColors.length);

      nodes.push({
        x,
        y,
        radius,
        color: nodeColors[colorIndex],
        pulse: 0,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        connections: [],
        moving: Math.random() > 0.7, // Some nodes are stationary like miners
        velocityX: (Math.random() - 0.5) * 0.2,
        velocityY: (Math.random() - 0.5) * 0.2
      });
    }

    // Connect nodes in blockchain network topology (with some randomness)
    for (let i = 0; i < nodes.length; i++) {
      // Each node attempts to connect to others
      const nodesToConnect = Math.floor(Math.random() * 3) + 1; // 1-3 connections

      for (let j = 0; j < nodesToConnect && nodes[i].connections.length < maxConnections; j++) {
        // Find a nearby node to connect to
        let closestNode = -1;
        let closestDist = Infinity;

        for (let k = 0; k < nodes.length; k++) {
          if (i !== k && !nodes[i].connections.includes(k) && nodes[k].connections.length < maxConnections) {
            const dx = nodes[i].x - nodes[k].x;
            const dy = nodes[i].y - nodes[k].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist && dist < 180) { // Max connection distance
              closestDist = dist;
              closestNode = k;
            }
          }
        }

        if (closestNode !== -1) {
          nodes[i].connections.push(closestNode);
          nodes[closestNode].connections.push(i);

          // Create initial particles on this connection
          if (Math.random() > 0.5) { // 50% chance to have particles
            const numParticles = Math.floor(Math.random() * 2) + 1;
            for (let p = 0; p < numParticles; p++) {
              const colorIndex = Math.floor(Math.random() * particleColors.length);
              particles.push({
                x: nodes[i].x,
                y: nodes[i].y,
                size: 1 + Math.random(),
                sourceNode: i,
                targetNode: closestNode,
                progress: Math.random(), // Start at random position on the connection
                speed: 0.0025 + Math.random() * 0.002,
                color: particleColors[colorIndex]
              });
            }
          }
        }
      }
    }

    // Animation variables
    let animationFrame: number;
    let lastTimestamp = 0;

    // Enhanced animation function for blockchain network
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Clear canvas with slight fade effect for trailing
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Draw connections between blockchain nodes
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];

          // Calculate connection props
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Draw line with gradient
          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          gradient.addColorStop(0, node.color.replace('0.6', '0.15'));
          gradient.addColorStop(1, target.color.replace('0.6', '0.15'));

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = gradient;

          // Thinner lines for longer connections
          ctx.lineWidth = Math.max(0.2, 1 - dist / 200);
          ctx.stroke();
        });
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Pulse animation
        node.pulse += 0.02 * node.pulseDirection;
        if (node.pulse > 1 || node.pulse < 0) {
          node.pulseDirection *= -1;
        }

        // Move moving nodes
        if (node.moving) {
          node.x += node.velocityX * deltaTime * 0.1;
          node.y += node.velocityY * deltaTime * 0.1;

          // Bounce off edges
          if (node.x < node.radius || node.x > canvas.width / window.devicePixelRatio - node.radius) {
            node.velocityX *= -1;
          }
          if (node.y < node.radius || node.y > canvas.height / window.devicePixelRatio - node.radius) {
            node.velocityY *= -1;
          }
        }

        // Draw node glow
        const glowRadius = node.radius * (1.5 + node.pulse * 0.5);
        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius * 0.5,
          node.x, node.y, glowRadius * 2
        );
        gradient.addColorStop(0, node.color);
        gradient.addColorStop(1, node.color.replace('0.6', '0'));

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color.replace('0.6', '0.9');
        ctx.fill();
      }

      // Update and draw particles (data flowing through blockchain)
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        const source = nodes[particle.sourceNode];
        const target = nodes[particle.targetNode];

        // Update particle position along connection
        particle.progress += particle.speed * deltaTime * 0.1;

        // If reached target, create new particle or change direction
        if (particle.progress >= 1) {
          if (Math.random() > 0.3) { // 70% chance to continue
            // Reset to source and target remains the same
            particle.progress = 0;
          } else {
            // Find a new target from current target's connections
            const targetConnections = nodes[particle.targetNode].connections;
            if (targetConnections.length > 0) {
              // Choose a random connection
              const newTargetIndex = targetConnections[Math.floor(Math.random() * targetConnections.length)];
              // Swap source and target
              particle.sourceNode = particle.targetNode;
              particle.targetNode = newTargetIndex;
              particle.progress = 0;
            } else {
              // If no connections, reset to original source
              particle.progress = 0;
            }
          }
        }

        // Calculate current position
        particle.x = source.x + (target.x - source.x) * particle.progress;
        particle.y = source.y + (target.y - source.y) * particle.progress;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw trailing glow
        const trailGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        trailGradient.addColorStop(0, particle.color);
        trailGradient.addColorStop(1, particle.color.replace('0.7', '0'));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = trailGradient;
        ctx.fill();
      }

      // Occasionally add new particles
      if (Math.random() > 0.99) {
        const randomNode = Math.floor(Math.random() * nodes.length);
        const node = nodes[randomNode];

        if (node.connections.length > 0) {
          const targetIndex = node.connections[Math.floor(Math.random() * node.connections.length)];
          const colorIndex = Math.floor(Math.random() * particleColors.length);

          particles.push({
            x: node.x,
            y: node.y,
            size: 1 + Math.random(),
            sourceNode: randomNode,
            targetNode: targetIndex,
            progress: 0,
            speed: 0.002 + Math.random() * 0.003,
            color: particleColors[colorIndex]
          });
        }
      }

      // Limit particles to prevent performance issues
      while (particles.length > 100) {
        particles.shift();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const steps: Step[] = [
    {
      id: 1,
      title: "Connect Wallet",
      description: "Securely connect your wallet to access our platform. Your assets always remain under your complete control.",
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-gradient-to-br from-indigo-50 to-blue-50",
      border: "border-indigo-100",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      id: 2,
      title: "Choose Strategy",
      description: "Select from preset yield strategies or customize your own based on your risk tolerance and investment goals.",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-gradient-to-br from-violet-50 to-purple-50",
      border: "border-violet-100",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600"
    },
    {
      id: 3,
      title: "Deploy sBTC",
      description: "Your sBTC is automatically allocated across multiple DeFi protocols according to your selected strategy.",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      color: "bg-gradient-to-br from-blue-50 to-cyan-50",
      border: "border-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      id: 4,
      title: "Maximize Returns",
      description: "Our platform continuously monitors and optimizes your positions to ensure maximum yield with minimum effort.",
      icon: <Coins className="h-5 w-5" />,
      color: "bg-gradient-to-br from-amber-50 to-orange-50",
      border: "border-amber-100",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Advanced Web3 background animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Gradient color accents */}
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-indigo-300/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-violet-300/20 rounded-full filter blur-3xl opacity-30"></div>

        {/* Light grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-3 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
              <span className="text-indigo-700 font-medium text-xs">Simplified Process</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">sBTC Yield Nexus</span> Works
            </h2>

            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Our advanced platform makes it easy to maximize your Bitcoin returns across the Stacks ecosystem
            </p>
          </div>

          {/* Steps in a more compact, visually balanced layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border ${step.border} ${step.color} group`}
              >
                {/* Bright top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-400 to-violet-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>

                {/* Step number indicator */}
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white text-gray-800 flex items-center justify-center text-xs font-semibold border border-gray-100 shadow-sm">
                  {step.id}
                </div>

                <div className="p-4">
                  <div className={`w-8 h-8 rounded-full ${step.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <div className={step.iconColor}>
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-gray-700 text-xs">{step.description}</p>

                  {/* Connection arrow for all but the last step */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-indigo-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add global styles without using jsx property */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-slow-reverse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.2; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
        
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 15s ease-in-out infinite;
        }
        
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0zm-5.98 10l-15 8.66v17.32l15 8.66 15-8.66V18.66l-15-8.66z' fill='%234f46e5' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
          background-size: 60px 60px;
        }
      ` }} />
    </section>
  );
};

export default HowItWorksSection;