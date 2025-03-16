import React, { useEffect, useRef } from 'react';
import { Mail, ArrowUpRight, Zap, Shield, BarChart3, FileText } from 'lucide-react';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Advanced Web3 background animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with higher resolution
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Define node network for blockchain representation
    interface Node {
      x: number;
      y: number;
      radius: number;
      connections: number[];
      color: string;
      pulse: number;
      pulseDirection: number;
      connectRadius: number;
      type: 'source' | 'relay' | 'endpoint';
    }

    interface Connection {
      from: number;
      to: number;
      data: {
        progress: number;
        speed: number;
        color: string;
        size: number;
      }[];
      strength: number;
    }

    // Create nodes and connections arrays
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const numNodes = 20; // More nodes for richer visual

    // Enhanced diverse color palette for Web3 style
    const goldColors = [
      'rgba(251, 191, 36, 0.6)',   // Amber
      'rgba(217, 119, 6, 0.5)',    // Yellow-600
      'rgba(245, 158, 11, 0.55)',  // Amber-600
    ];

    const blueColors = [
      'rgba(79, 70, 229, 0.6)',    // Indigo-600
      'rgba(67, 56, 202, 0.55)',   // Indigo-700
      'rgba(99, 102, 241, 0.5)',   // Indigo-500
    ];

    const purpleColors = [
      'rgba(124, 58, 237, 0.55)',  // Purple-600
      'rgba(139, 92, 246, 0.5)',   // Purple-500
      'rgba(167, 139, 250, 0.45)', // Purple-400
    ];

    const tealColors = [
      'rgba(20, 184, 166, 0.5)',   // Teal-500
      'rgba(13, 148, 136, 0.45)',  // Teal-600
      'rgba(45, 212, 191, 0.4)',   // Teal-400
    ];

    // Combine all color palettes
    const allColors = [...goldColors, ...blueColors, ...purpleColors, ...tealColors];

    // Create nodes with strategic placement and color zones
    const canvasWidth = canvas.width / window.devicePixelRatio;
    const canvasHeight = canvas.height / window.devicePixelRatio;

    // Create nodes in a more structured pattern with color zones
    for (let i = 0; i < numNodes; i++) {
      // Determine node type
      let nodeType: 'source' | 'relay' | 'endpoint';
      if (i < numNodes * 0.2) {
        nodeType = 'source';
      } else if (i < numNodes * 0.8) {
        nodeType = 'relay';
      } else {
        nodeType = 'endpoint';
      }

      // Create nodes with strategic clustering and color zones
      let x, y, colorPalette;

      if (i % 4 === 0) {
        // Gold zone - bottom left
        x = canvasWidth * 0.3 * Math.random();
        y = canvasHeight * (0.6 + Math.random() * 0.4);
        colorPalette = goldColors;
      } else if (i % 4 === 1) {
        // Blue zone - top left
        x = canvasWidth * 0.3 * Math.random();
        y = canvasHeight * 0.6 * Math.random();
        colorPalette = blueColors;
      } else if (i % 4 === 2) {
        // Purple zone - center to right
        x = canvasWidth * (0.4 + Math.random() * 0.6);
        y = canvasHeight * (0.3 + Math.random() * 0.4);
        colorPalette = purpleColors;
      } else {
        // Teal zone - scattered
        x = canvasWidth * (0.5 + Math.random() * 0.5);
        y = canvasHeight * Math.random();
        colorPalette = tealColors;
      }

      const colorIndex = Math.floor(Math.random() * colorPalette.length);

      // Vary connection radius based on node type
      let connectRadius;
      if (nodeType === 'source') {
        connectRadius = 200 + Math.random() * 100; // Longer reach for source nodes
      } else if (nodeType === 'relay') {
        connectRadius = 150 + Math.random() * 80;
      } else {
        connectRadius = 100 + Math.random() * 50; // Shorter reach for endpoints
      }

      nodes.push({
        x,
        y,
        radius: nodeType === 'source' ? 2 + Math.random() * 1.5 :
          nodeType === 'relay' ? 1.5 + Math.random() * 1 :
            1 + Math.random() * 0.8,
        connections: [],
        color: colorPalette[colorIndex],
        pulse: Math.random(),
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        connectRadius,
        type: nodeType
      });
    }

    // Create cross-zone connections for more interest
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      // Find nearby nodes to connect
      for (let j = 0; j < nodes.length; j++) {
        if (i !== j) {
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Connect if within connect radius and limit connections
          // Source nodes can have more connections
          const maxConnections = node.type === 'source' ? 5 :
            node.type === 'relay' ? 3 : 2;

          if (distance < node.connectRadius && node.connections.length < maxConnections) {
            // Avoid duplicate connections
            if (!node.connections.includes(j)) {
              node.connections.push(j);

              // Calculate connection strength based on distance
              const strength = 1 - (distance / node.connectRadius);

              // Create connection with data packets
              connections.push({
                from: i,
                to: j,
                data: [],
                strength
              });

              // Initialize with some data packets - more for source nodes
              if (Math.random() > (node.type === 'source' ? 0.2 : 0.6)) {
                const dataCount = Math.floor(Math.random() * 2) + (node.type === 'source' ? 2 : 1);
                for (let d = 0; d < dataCount; d++) {
                  // Use colors from either node for the data
                  let packetColor;
                  if (Math.random() > 0.5) {
                    packetColor = node.color;
                  } else {
                    // 25% chance to use a contrasting color
                    if (Math.random() > 0.75) {
                      packetColor = allColors[Math.floor(Math.random() * allColors.length)];
                    } else {
                      packetColor = otherNode.color;
                    }
                  }

                  connections[connections.length - 1].data.push({
                    progress: Math.random(),
                    speed: 0.0005 + Math.random() * 0.002,
                    color: packetColor,
                    size: 1 + Math.random() * (node.type === 'source' ? 1.5 : 1)
                  });
                }
              }
            }
          }
        }
      }
    }

    // Animation variables
    let animationFrame: number;
    let lastTime = 0;

    // Sophisticated Web3 animation
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime || 0;
      lastTime = timestamp;

      // Clear canvas with subtle fade for motion trails
      // Use a deep gradient background for more sophistication
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.07)'); // Darker at top
      bgGradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.07)'); // Mid
      bgGradient.addColorStop(1, 'rgba(15, 23, 42, 0.07)'); // Darker at bottom

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw connections with varying opacity based on strength
      connections.forEach(connection => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];

        // Draw connection line
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        // Create gradient for the connection
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);

        // Adjust opacity based on connection strength and node types
        const baseOpacity = 0.1 + (connection.strength * 0.2);

        // More interesting gradients with multiple color stops
        if (fromNode.type === 'source' || toNode.type === 'source') {
          // Higher contrast for source connections
          gradient.addColorStop(0, fromNode.color.replace(/[\d.]+(?=\))/, (baseOpacity * 1.5).toString()));
          gradient.addColorStop(0.4, fromNode.color.replace(/[\d.]+(?=\))/, (baseOpacity * 0.8).toString()));
          gradient.addColorStop(0.6, toNode.color.replace(/[\d.]+(?=\))/, (baseOpacity * 0.8).toString()));
          gradient.addColorStop(1, toNode.color.replace(/[\d.]+(?=\))/, (baseOpacity * 1.5).toString()));
        } else {
          // Simpler gradient for other connections
          gradient.addColorStop(0, fromNode.color.replace(/[\d.]+(?=\))/, baseOpacity.toString()));
          gradient.addColorStop(1, toNode.color.replace(/[\d.]+(?=\))/, baseOpacity.toString()));
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = (fromNode.type === 'source' || toNode.type === 'source') ? 0.7 : 0.5;
        ctx.stroke();

        // Update and draw data packets
        connection.data.forEach((packet, index) => {
          // Update progress with speed based on connection type
          const speedMultiplier = (fromNode.type === 'source' || toNode.type === 'source') ? 1.2 : 1;
          packet.progress += packet.speed * deltaTime * 0.1 * speedMultiplier;

          // Reset progress or remove
          if (packet.progress >= 1) {
            // Source nodes have higher chance to keep sending data
            const keepChance = fromNode.type === 'source' ? 0.8 :
              toNode.type === 'source' ? 0.7 : 0.5;
            if (Math.random() < keepChance) {
              packet.progress = 0;
            } else {
              // Remove this packet
              connection.data.splice(index, 1);
            }
          }

          // Calculate current position
          const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
          const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

          // Draw data packet
          ctx.beginPath();
          ctx.arc(x, y, packet.size, 0, Math.PI * 2);
          ctx.fillStyle = packet.color;
          ctx.fill();

          // Add subtle glow
          ctx.beginPath();
          ctx.arc(x, y, packet.size * 3, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(
            x, y, packet.size * 0.5,
            x, y, packet.size * 3
          );
          glowGradient.addColorStop(0, packet.color);
          glowGradient.addColorStop(1, packet.color.replace(/[\d.]+(?=\))/, '0'));
          ctx.fillStyle = glowGradient;
          ctx.fill();
        });

        // Occasionally add new packets, more likely for source nodes
        const createPacketChance = fromNode.type === 'source' ? 0.01 :
          toNode.type === 'source' ? 0.008 : 0.003;
        if (Math.random() < createPacketChance && connection.data.length < (fromNode.type === 'source' ? 4 : 2)) {
          // Choose color - 50% chance to use a node color, 50% chance for a random color
          let packetColor;
          if (Math.random() > 0.5) {
            packetColor = Math.random() > 0.5 ? fromNode.color : toNode.color;
          } else {
            packetColor = allColors[Math.floor(Math.random() * allColors.length)];
          }

          connection.data.push({
            progress: 0,
            speed: 0.0005 + Math.random() * 0.002,
            color: packetColor,
            size: 1 + Math.random() * (fromNode.type === 'source' ? 1.5 : 1)
          });
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Update pulse
        node.pulse += 0.003 * node.pulseDirection;
        if (node.pulse > 1 || node.pulse < 0) {
          node.pulseDirection *= -1;
        }

        // Draw node glow - different sizes based on node type
        const glowRadiusMultiplier = node.type === 'source' ? 2 :
          node.type === 'relay' ? 1.5 : 1.2;
        const glowRadius = node.radius * (1.2 + node.pulse * glowRadiusMultiplier);

        const gradient = ctx.createRadialGradient(
          node.x, node.y, node.radius * 0.5,
          node.x, node.y, glowRadius * 3
        );

        // Different glow effect based on node type
        if (node.type === 'source') {
          // Stronger, more complex glow for source nodes
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(0.4, node.color.replace(/[\d.]+(?=\))/, '0.4'));
          gradient.addColorStop(0.7, node.color.replace(/[\d.]+(?=\))/, '0.2'));
          gradient.addColorStop(1, node.color.replace(/[\d.]+(?=\))/, '0'));
        } else {
          // Simpler glow for other nodes
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(1, node.color.replace(/[\d.]+(?=\))/, '0'));
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw node core - brighter for source nodes
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const coreOpacity = node.type === 'source' ? '0.9' :
          node.type === 'relay' ? '0.8' : '0.7';
        ctx.fillStyle = node.color.replace(/[\d.]+(?=\))/, coreOpacity);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <footer className="relative overflow-hidden py-16">
      {/* Advanced layered gradients for sophisticated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-900/0 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-900/0 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-slate-900/0 to-transparent z-0"></div>

      {/* Advanced Web3 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 z-0"
      />

      {/* Advanced background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blurred gradient orbs with more varied colors */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-[90px] opacity-40"></div>

        {/* Subtle gradient lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section - With golden accent */}
          <div className="space-y-6">
            {/* <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-amber-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent">
                sBTC Yield Nexus
              </h3>
            </div> */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg shadow-md shadow-indigo-200/50">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="text-lg font-bold relative group">
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
                    sBTC <span className="font-light italic tracking-tight">Yield</span> Nexus
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </div>
              </div>
            </div>
            <p className="text-gray-300/80">
              Maximize your Bitcoin returns with sophisticated yield optimization across the Stacks ecosystem.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/sbtcyieldnexus"
                className="group relative p-2 bg-white/5 hover:bg-white/10 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="h-5 w-5 text-yellow-300/80 group-hover:text-yellow-300 transition-colors" />
              </a>
              <a
                href="https://github.com/sbtcyieldnexus"
                className="group relative p-2 bg-white/5 hover:bg-white/10 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="h-5 w-5 text-yellow-300/80 group-hover:text-yellow-300 transition-colors" />
              </a>
              <a
                href="https://discord.gg/sbtcyieldnexus"
                className="group relative p-2 bg-white/5 hover:bg-white/10 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscord className="h-5 w-5 text-yellow-300/80 group-hover:text-yellow-300 transition-colors" />
              </a>
              <a
                href="mailto:contact@sbtcyieldnexus.com"
                className="group relative p-2 bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <Mail className="h-5 w-5 text-yellow-300/80 group-hover:text-yellow-300 transition-colors" />
              </a>
            </div>
          </div>

          {/* Platform Section - With purple accent */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-200">Platform</h3>
            <ul className="space-y-3">
              {[
                { name: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
                { name: 'Yield Strategies', icon: <Zap className="h-4 w-4" /> },
                { name: 'Security Features', icon: <Shield className="h-4 w-4" /> },
                { name: 'Tax Reporting', icon: <FileText className="h-4 w-4" /> }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center text-gray-300/80 hover:text-purple-300 transition-colors"
                  >
                    <span className="flex items-center">
                      <span className="mr-2 text-purple-400/70 group-hover:text-purple-400 transition-colors">
                        {item.icon}
                      </span>
                      {item.name}
                    </span>
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section - With indigo accent */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-indigo-200">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'Protocol Integrations', 'API Reference', 'Community Forum', 'Knowledge Base'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center text-gray-300/80 hover:text-indigo-300 transition-colors"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section - With teal accent */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-teal-200">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center text-gray-300/80 hover:text-teal-300 transition-colors"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} sBTC Yield Nexus. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/disclaimer" className="hover:text-yellow-300 transition-colors">
                Disclaimer
              </a>
              <a href="/security" className="hover:text-purple-300 transition-colors">
                Security
              </a>
              <button className="hover:text-indigo-300 transition-colors flex items-center">
                <span className="mr-1">English</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;