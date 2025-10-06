export const toNum = (v) => {
  if (v == null) return 0;
  if (typeof v === "number") return isFinite(v) ? v : 0;
  const m = String(v).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
};

export const calcMetrics = (basePrice, amazonBb, amazonFees) => {
  const profit = amazonBb - (basePrice + amazonFees);
  const margin = amazonBb > 0 ? (profit / amazonBb) * 100 : 0;
  const roi = basePrice > 0 ? (profit / basePrice) * 100 : 0;
  return { basePrice, profit, margin, roi };
};

// Caps ROI to 40% by setting basePrice' = (amazonBb - amazonFees) / 1.4
 export const applyRoiCap = (basePrice0, amazonBb, amazonFees) => {
  let { basePrice, profit, margin, roi } = calcMetrics(basePrice0, amazonBb, amazonFees);
  if (basePrice > 0 && roi > 40) {
    // Calculate what the new base price should be to achieve exactly 40% ROI
    const S = amazonBb - amazonFees;              // Net revenue
    basePrice = S / 1.4;                          // This gives exactly 40% ROI
    ({ profit, margin, roi } = calcMetrics(basePrice, amazonBb, amazonFees));
  }
  return { basePrice, profit, margin, roi };
};