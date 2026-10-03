export function lightningColor(original: string): string {
  let theme='default'; try{theme=localStorage.getItem('theme-preference') || 'default';}catch{}
  if(theme==='original') return original;
  const colors: Record<string,string> = {'#FFB300':'#f7931a','#D81B60':'#7b1af7','#D81B60AA':'#7b1af7aa','#1E88E5':'#c7a2ff','#466d9d':'#9c5df7','#bafcff':'#dac3ff','#FDD835':'#f7931a','#be7d4c':'#b78ff7','#be7d4cAA':'#b78ff7aa','#7D4698':'#57228e','#7D4698AA':'#57228eaa','#FFB300AA':'#f7931aaa'};
  return colors[original] || original;
}

export function lightningColors(original: string[]): string[] {
  let theme='default';try{theme=localStorage.getItem('theme-preference')||'default';}catch{}
  return theme==='original' ? original : original.map((_,index) => ['#7b1af7','#c7a2ff','#9d67e0','#57228e','#a99bb8','#f7931a','#73558f','#dac3ff','#787078','#d2b780','#b45ff0','#a6a0ad'][index % 12]);
}
