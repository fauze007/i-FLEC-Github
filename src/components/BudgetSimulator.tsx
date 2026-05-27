import React, { useState, useEffect } from 'react';

export default function BudgetSimulator() {
  const [monthlyContribution, setMonthlyContribution] = useState(2500);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [initialCapital, setInitialCapital] = useState(50000);
  const [timeHorizon, setTimeHorizon] = useState(25);
  const [netWorth, setNetWorth] = useState(2744575);

  // Formatter for currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Recalculate compound formula
  useEffect(() => {
    const P = initialCapital;
    const PMT = monthlyContribution;
    const r = (expectedReturn / 100) / 12;
    const n = timeHorizon * 12;

    let fv = 0;
    if (r === 0) {
      fv = P + PMT * n;
    } else {
      // Future Value of Series formula
      fv = P * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    }
    setNetWorth(Math.round(fv));
  }, [monthlyContribution, expectedReturn, initialCapital, timeHorizon]);

  // Generate SVG path coordinate points to draw a dynamic exponential curve
  const generatePathData = () => {
    const P = initialCapital;
    const PMT = monthlyContribution;
    const r = (expectedReturn / 100) / 12;
    
    const points: { x: number; y: number }[] = [];
    const totalSteps = 24; // divide timeline
    const width = 1000;
    const height = 300;

    // Calculate future state values across timeline steps
    const values: number[] = [];
    for (let step = 0; step <= totalSteps; step++) {
      const stepYears = (timeHorizon / totalSteps) * step;
      const stepMonths = stepYears * 12;
      let val = 0;
      if (r === 0) {
        val = P + PMT * stepMonths;
      } else {
        val = P * Math.pow(1 + r, stepMonths) + PMT * ((Math.pow(1 + r, stepMonths) - 1) / r);
      }
      values.push(val);
    }

    const maxValue = Math.max(...values, 100000);

    // Map each step to coordinates
    values.forEach((v, index) => {
      const x = (index / totalSteps) * width;
      // y is inverted layout, where height (300) is base year 0, and peak is 30 (giving breathing margin)
      const y = height - ((v / maxValue) * (height * 0.85)) - 15;
      points.push({ x, y });
    });

    // Generate Cubic/quadratic line path from point series
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Use neat cubic smoothing
      const xc = (points[i - 1].x + points[i].x) / 2;
      const yc = (points[i - 1].y + points[i].y) / 2;
      d += ` Q ${points[i - 1].x} ${points[i - 1].y}, ${xc} ${yc}`;
    }
    // append final point
    const lastPoint = points[points.length - 1];
    d += ` T ${lastPoint.x} ${lastPoint.y}`;

    // Path fill area back down to ground anchor points
    const areaPath = `${d} L 1000 ${height} L 0 ${height} Z`;

    return { linePath: d, areaPath };
  };

  const { linePath, areaPath } = generatePathData();

  // Dynamically position milestone markers over the graph relative to net worth ranges
  const milestone100kY = `${Math.max(10, Math.min(85, 80 - (100000 / netWorth) * 60))}%`;
  const houseDepositY = `${Math.max(5, Math.min(65, 80 - (250000 / netWorth) * 60))}%`;

  return (
    <div className="w-full max-w-2xl mx-auto pb-32 space-y-8 animate-fade-in">
      
      {/* Projected Net Worth Metric display section */}
      <section className="text-center space-y-2 py-8">
        <p className="font-display text-xs tracking-[0.2em] font-bold text-indigo-400 uppercase">
          Tinjauan Simulator
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-[#818cf8] shadow-[0_0_15px_rgba(99,102,241,0.5)] leading-tight">
          Unjuran Nilai Bersih:<br/>{formatCurrency(netWorth)}
        </h1>
        <p className="text-sm text-[#a1a1aa]/70 max-w-lg mx-auto font-normal leading-relaxed">
          Terkumpul unjuran berdasarkan pilihan aset ASB/KWSP dan faedah kompaun anda untuk <strong className="text-slate-300 font-bold">{timeHorizon} tahun</strong> berikutnya.
        </p>
      </section>

      {/* Grid controllers of Sliders */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-display text-xs font-semibold text-slate-300 tracking-wide">
              Sumbangan Bulanan (RM)
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {formatCurrency(monthlyContribution)}
            </span>
          </div>
          <input 
            type="range"
            min="100"
            max="10000"
            step="100"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-display text-xs font-semibold text-slate-300 tracking-wide">
              Jangkaan Pulangan ASB/Amanah Saham (%)
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {expectedReturn}%
            </span>
          </div>
          <input 
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-display text-xs font-semibold text-slate-300 tracking-wide">
              Modal Permulaan (RM)
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {formatCurrency(initialCapital)}
            </span>
          </div>
          <input 
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={initialCapital}
            onChange={(e) => setInitialCapital(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-[32px] space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-display text-xs font-semibold text-slate-300 tracking-wide">
              Tempoh Masa (Tahun)
            </span>
            <span className="font-display text-2xl font-bold text-white">
              {timeHorizon}
            </span>
          </div>
          <input 
            type="range"
            min="1"
            max="50"
            step="1"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </section>

      {/* SVG Trajectory Chart area */}
      <section className="glass-panel p-6 md:p-8 rounded-[32px] relative overflow-hidden h-[400px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-white">Trajektori Kekayaan (RM)</h3>
            <p className="text-xs text-[#a1a1aa]/70">Keluk pertumbuhan eksponen mewakili aset kompaun tempatan</p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-[#6366f1]/25 text-indigo-300 text-[10px] font-bold border border-indigo-500/20 tracking-widest">
            MOD SEUMUR HIDUP
          </span>
        </div>

        {/* Adaptive SVG Curve Plotter */}
        <div className="absolute inset-x-8 top-32 bottom-12">
          <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#312e81" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Shaded Area */}
            <path d={areaPath} fill="url(#chartGradient)" className="transition-all duration-300" />
            {/* Luminous Neon Line */}
            <path 
              d={linePath} 
              fill="none" 
              className="chart-line stroke-[#6366f1] stroke-[3px] transition-all duration-300" 
              filter="drop-shadow(0 0 8px rgba(99,102,241,0.5))"
            />
          </svg>

          {/* Interactive floating Milestone Markers */}
          {netWorth >= 100000 && (
            <div 
              style={{ top: milestone100kY, left: '38%' }}
              className="absolute glass-panel-high px-3 py-1.5 rounded-full flex items-center gap-1.5 border-white/25 shadow-lg select-none transition-all duration-500 ease-out animate-bounce pointer-events-none"
            >
              <span className="material-symbols-outlined text-[14px] text-indigo-300">military_tech</span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-white">Matlamat 100k</span>
            </div>
          )}

          {netWorth >= 250000 && (
            <div 
              style={{ top: houseDepositY, left: '78%' }}
              className="absolute glass-panel-high px-3 py-1.5 rounded-full flex items-center gap-1.5 border-white/25 shadow-lg select-none transition-all duration-500 ease-out pointer-events-none"
            >
              <span className="material-symbols-outlined text-[14px] text-indigo-300">home</span>
              <span className="text-[9px] font-extrabold tracking-widest uppercase text-white">Deposit Rumah</span>
            </div>
          )}
        </div>

        {/* X-Axis labels */}
        <div className="absolute bottom-4 inset-x-8 flex justify-between text-[10px] font-medium text-[#a1a1aa]/50 tracking-widest">
          <span>TAHUN 0</span>
          <span>TAHUN {Math.floor(timeHorizon / 2)}</span>
          <span>TAHUN {timeHorizon}</span>
        </div>
      </section>

      {/* Mentor Strategy Column Summary */}
      <section className="glass-panel p-6 rounded-[32px] border-l-[6px] border-l-[#818cf8] flex items-start gap-4">
        <div className="bg-indigo-500/10 p-3 rounded-xl">
          <span className="material-symbols-outlined text-indigo-300 text-2xl">record_voice_over</span>
        </div>
        <div>
          <h4 className="font-display text-sm font-bold text-white mb-1">Unjuran Strategi Mentor</h4>
          <p className="text-xs text-[#f4f4f5]/80 leading-relaxed">
            By boosting your monthly addition by just <strong className="text-indigo-300">$200</strong>, you will unlock your <strong className="text-slate-300">"Deposit Rumah" milestone 3 years earlier</strong>. Kesan faedah kompaun daripada {expectedReturn}% jangkaan pulangan memihak kepada portfolio KWSP/ASB jangka panjang anda. Teruskan mencarum.
          </p>
        </div>
      </section>
    </div>
  );
}
