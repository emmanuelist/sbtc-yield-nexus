import { ChevronRight, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";

export const NewsletterSection: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter signup logic here
    if (inputRef.current) {
      console.log('Email submitted:', inputRef.current.value);
      // Reset form
      inputRef.current.value = '';
    }
  };

  // Unique geometric animation effect for newsletter background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shape definition
    interface Shape {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
    }

    // Create shapes array
    const shapes: Shape[] = [];
    const numShapes = 35;

    // Gold-themed color palette - contrasting with both light and dark themes
    const colors = [
      'rgba(234, 179, 8, 0.3)',     // Yellow/gold
      'rgba(250, 204, 21, 0.25)',   // Medium gold
      'rgba(253, 224, 71, 0.2)',    // Light gold
      'rgba(245, 158, 11, 0.25)',   // Amber
      'rgba(217, 119, 6, 0.2)'      // Dark amber
    ];

    // Create geometric shapes with varied properties
    for (let i = 0; i < numShapes; i++) {
      const x = Math.random() * canvas.width / window.devicePixelRatio;
      const y = Math.random() * canvas.height / window.devicePixelRatio;
      const size = 5 + Math.random() * 25;
      const colorIndex = Math.floor(Math.random() * colors.length);

      shapes.push({
        x,
        y,
        size,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        opacity: 0.1 + Math.random() * 0.3,
        color: colors[colorIndex]
      });
    }

    // Animation variables
    let animationFrame: number;

    // Animation function
    const animate = () => {
      // Clear canvas with semi-transparent black
      ctx.fillStyle = 'rgba(10, 10, 50, 0.1)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Draw and update shapes
      shapes.forEach(shape => {
        // Update rotation
        shape.rotation += shape.rotationSpeed;

        // Draw shape (hexagons and squares for blockchain feeling)
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);

        // Alternate between hexagons, diamonds and squares
        if (shape.size % 3 === 0) {
          // Hexagon
          drawHexagon(ctx, 0, 0, shape.size, shape.color, shape.opacity);
        } else if (shape.size % 3 === 1) {
          // Diamond
          drawDiamond(ctx, 0, 0, shape.size, shape.color, shape.opacity);
        } else {
          // Square
          ctx.fillStyle = shape.color.replace(/[\d.]+(?=\))/, shape.opacity.toString());
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          ctx.strokeStyle = shape.color.replace(/[\d.]+(?=\))/, (shape.opacity * 1.5).toString());
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    // Helper function to draw hexagon
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI * 2 / 6 * i;
        const pointX = x + size * Math.cos(angle);
        const pointY = y + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      ctx.closePath();
      ctx.fillStyle = color.replace(/[\d.]+(?=\))/, opacity.toString());
      ctx.fill();
      ctx.strokeStyle = color.replace(/[\d.]+(?=\))/, (opacity * 1.5).toString());
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    // Helper function to draw diamond
    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size / 2); // Top
      ctx.lineTo(x + size / 2, y); // Right
      ctx.lineTo(x, y + size / 2); // Bottom
      ctx.lineTo(x - size / 2, y); // Left
      ctx.closePath();
      ctx.fillStyle = color.replace(/[\d.]+(?=\))/, opacity.toString());
      ctx.fill();
      ctx.strokeStyle = color.replace(/[\d.]+(?=\))/, (opacity * 1.5).toString());
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-teal-950 rounded-t-3xl py-12">
      {/* Canvas background with golden geometric shapes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Golden glow accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/15 rounded-full filter blur-3xl"></div>

        {/* Accent lines with gold gradient */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto backdrop-blur-sm bg-black/20 p-6 border border-yellow-500/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium mb-2 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Insights & Opportunities
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Subscribe for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">Bitcoin Yield Insights</span>
              </h3>

              <p className="text-gray-300/90 text-sm">
                Get exclusive weekly updates on the best sBTC yield opportunities and expert market analysis.
              </p>
            </div>

            <div className="md:w-1/2 w-full">
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex">
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-3 rounded-l-none bg-white/10 border-y border-l border-yellow-500/20 text-white placeholder-yellow-200/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-r-none font-medium transition-all flex items-center justify-center border-r border-y border-yellow-500/20"
                  >
                    <span className="hidden sm:inline mr-1">Subscribe</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-yellow-200/30 text-xs mt-2 ml-1">
                  We respect your privacy. No spam, just valuable insights.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;