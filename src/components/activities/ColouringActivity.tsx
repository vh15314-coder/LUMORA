import React, { useRef, useState, useEffect } from 'react';
import { Palette, RotateCcw, Trash2, Download, Sparkles, Heart, Moon, Flower2, Leaf } from 'lucide-react';

export const ColouringActivity: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#818cf8');
  const [brushSize, setBrushSize] = useState(8);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);

  const paletteColors = [
    '#818cf8', // Lavender
    '#a78bfa', // Lilac
    '#38bdf8', // Soft Sky
    '#34d399', // Sage Green
    '#fb7185', // Rose
    '#fb923c', // Peach / Amber
    '#fef08a', // Soft Moon Yellow
    '#f1f5f9', // Cloud White
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background with soft dark canvas
    ctx.fillStyle = '#0f1322';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setHistory((prev) => [...prev.slice(-12), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f1322';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const drawStamp = (x: number, y: number, stamp: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const glyphs: Record<string, string> = {
      heart: '♥',
      star: '✦',
      moon: '☾',
      flower: '✿',
      leaf: '☘',
    };

    ctx.fillText(glyphs[stamp] || '✦', x, y);
    ctx.restore();
    saveHistory();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoords(e);
    if (selectedStamp) {
      drawStamp(coords.x, coords.y, selectedStamp);
      return;
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || selectedStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto rounded-3xl bg-slate-900/70 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            Ambient Drawing & Colouring
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            A gentle canvas to wander, sketch, or stamp comforting motifs with no right or wrong.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            title="Undo"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            title="Clear canvas"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner my-2">
        <canvas
          ref={canvasRef}
          width={560}
          height={340}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[260px] sm:h-[300px] cursor-crosshair touch-none"
        />
      </div>

      {/* Palette Colors */}
      <div className="flex flex-wrap items-center justify-between w-full gap-3 mt-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {paletteColors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setSelectedStamp(null);
              }}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                color === c && !selectedStamp ? 'scale-110 border-white shadow-md' : 'border-transparent hover:scale-105'
              }`}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>

        {/* Motifs / Stamps */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'star', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'heart', icon: <Heart className="w-3.5 h-3.5" /> },
            { id: 'moon', icon: <Moon className="w-3.5 h-3.5" /> },
            { id: 'flower', icon: <Flower2 className="w-3.5 h-3.5" /> },
            { id: 'leaf', icon: <Leaf className="w-3.5 h-3.5" /> },
          ].map((stamp) => (
            <button
              key={stamp.id}
              onClick={() => setSelectedStamp(selectedStamp === stamp.id ? null : stamp.id)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                selectedStamp === stamp.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title={`Stamp ${stamp.id}`}
            >
              {stamp.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
