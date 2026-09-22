import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, ShieldCheck, ArrowRight } from 'lucide-react';

interface FinancingCalculatorProps {
  vehiclePrice: number;
  onApplyNow: () => void;
}

export const FinancingCalculator: React.FC<FinancingCalculatorProps> = ({
  vehiclePrice,
  onApplyNow
}) => {
  const [downPayment, setDownPayment] = useState<number>(Math.round(vehiclePrice * 0.2)); // 20% default
  const [termMonths, setTermMonths] = useState<number>(60);
  const [interestRate, setInterestRate] = useState<number>(5.9); // 5.9% default APR
  const [tradeInValue, setTradeInValue] = useState<number>(0);

  const loanAmount = Math.max(0, vehiclePrice - downPayment - tradeInValue);

  // Monthly payment calculation
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : loanAmount / termMonths;

  const totalFinanced = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalFinanced - loanAmount);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-[#12151D] border border-white/10 rounded-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-red-500" />
          <h4 className="font-heading font-bold text-white text-base">
            Payment Estimator & Financing
          </h4>
        </div>
        <span className="text-xs text-slate-400">Competitive Luxury Tier Rates</span>
      </div>

      {/* Main Result Display */}
      <div className="bg-[#0B0D12] border border-white/5 rounded p-4 text-center">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
          Estimated Monthly Investment
        </span>
        <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          {formatCurrency(monthlyPayment)}
          <span className="text-sm font-normal text-slate-400 font-sans"> / month</span>
        </div>
        <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-4">
          <span>Loan: {formatCurrency(loanAmount)}</span>
          <span>&bull;</span>
          <span>Interest: {formatCurrency(totalInterest)}</span>
          <span>&bull;</span>
          <span>Term: {termMonths} mos</span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="space-y-4 text-xs">
        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
            <span>Down Payment ({Math.round((downPayment / vehiclePrice) * 100)}%)</span>
            <span className="font-mono text-red-400 font-semibold">{formatCurrency(downPayment)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={vehiclePrice * 0.6}
            step="1000"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        {/* Trade-in Allowance */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
            <span>Trade-in Value Allowance</span>
            <span className="font-mono text-slate-200">{formatCurrency(tradeInValue)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="2500"
            value={tradeInValue}
            onChange={(e) => setTradeInValue(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        {/* Loan Term Selection */}
        <div>
          <label className="text-slate-300 block mb-1.5 font-medium">Financing Term</label>
          <div className="grid grid-cols-4 gap-2">
            {[36, 48, 60, 72].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setTermMonths(term)}
                className={`py-2 text-center rounded border font-semibold transition-colors ${
                  termMonths === term
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-[#0B0D12] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {term} Mo.
              </button>
            ))}
          </div>
        </div>

        {/* Estimated APR Rate Slider */}
        <div>
          <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
            <span>Estimated Credit Tier APR</span>
            <span className="font-mono text-slate-200">{interestRate.toFixed(1)}% APR</span>
          </div>
          <input
            type="range"
            min="2.9"
            max="11.9"
            step="0.2"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>
      </div>

      {/* Disclaimer and CTA */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
        <div className="flex items-start gap-2 text-[11px] text-slate-400 leading-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Estimate excludes tax, licensing, registration, and destination fees. Custom tailored leasing and balloon notes also available through our private banking partners.
          </span>
        </div>

        <button
          onClick={onApplyNow}
          className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2"
        >
          <span>Request Custom Financing Quote</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
