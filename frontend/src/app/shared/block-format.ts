const DECIMALS = 8, SYMBOL = 'BTC', FEE_UNIT = 'sat/vB', FEE_SCALE = 1;

// Angular inlines the number locale in each translated bundle; the hub uses
// the same translated native component and formatter.
function blockNumberLocale(): string {
  return $localize`:@@taxi.block.numberLocale:en-US`;
}

function localizeExactDecimal(value: string): string {
  return blockNumberLocale().startsWith('es') ? value.replace('.', ',') : value;
}

// Presentation only: never round provider data or detail-page amounts.
export function compactBlockNumber(value: number, amount = false): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs > 0 && abs < 0.001) return (value < 0 ? '>−' : '<') + localizeExactDecimal('0.001');
  if (abs >= 1000) {
    const units = ['', 'k', 'M', 'B', 'T'];
    let group = Math.min(4, Math.floor(Math.log10(abs) / 3));
    let scaled = Number((value / 1000 ** group).toPrecision(3));
    if (Math.abs(scaled) >= 1000 && group < 4) { group++; scaled /= 1000; }
    return scaled.toLocaleString(blockNumberLocale(), { maximumSignificantDigits: 3, useGrouping: false }) + units[group];
  }
  return value.toLocaleString(blockNumberLocale(), amount
    ? { minimumFractionDigits: 2, maximumFractionDigits: 3, useGrouping: false }
    : { maximumSignificantDigits: 3, useGrouping: false });
}

export function compactBlockAmount(value: number | string, atomic = false): string {
  if (value == null) return '—';
  return compactBlockNumber(Number(value) / (atomic ? 1 : 10 ** DECIMALS), !atomic);
}

export function exactBlockAmount(value: number | string): string {
  if (value == null) return '—';
  try {
    const n = BigInt(value), abs = n < 0n ? -n : n, scale = 10n ** BigInt(DECIMALS);
    const fraction = (abs % scale).toString().padStart(DECIMALS, '0').replace(/0+$/, '');
    return (n < 0n ? '-' : '') + (abs / scale).toString() + (fraction ? localizeExactDecimal('.' + fraction) : '');
  } catch { return '—'; }
}

export function blockValueDetails(total: number | string, median: number, min: number, max: number): string {
  const rate = (value: number) => value == null || !Number.isFinite(value) ? '—' : localizeExactDecimal(String(value / FEE_SCALE));
  const totalFees = $localize`:@@taxi.block.details.totalFees:Total fees`;
  const medianFeeRate = $localize`:@@taxi.block.details.medianFeeRate:Median fee rate`;
  const feeRange = $localize`:@@taxi.block.details.feeRange:Fee range`;
  return `${totalFees}: ${exactBlockAmount(total)} ${SYMBOL}. ${medianFeeRate}: ${rate(median)} ${FEE_UNIT}. ${feeRange}: ${rate(min)}–${rate(max)} ${FEE_UNIT}.`;
}
