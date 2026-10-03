export function lightningColor(original: string): string {
  let theme='default'; try{theme=localStorage.getItem('theme-preference') || 'default';}catch{}
  if(theme==='original') return original;
  const colors: Record<string,string> = {'#FFB300':'#f7931a','#D81B60':'#b66e23','#D81B60AA':'#b66e23aa','#1E88E5':'#76512e','#466d9d':'#986337','#bafcff':'#ffd4a0','#FDD835':'#f7931a','#be7d4c':'#907050','#be7d4cAA':'#907050aa','#7D4698':'#b89367','#7D4698AA':'#b89367aa','#FFB300AA':'#f7931aaa'};
  return colors[original] || original;
}

export function lightningColors(original: string[]): string[] {
  let theme='default';try{theme=localStorage.getItem('theme-preference')||'default';}catch{}
  return theme==='original' ? original : original.map((_,index) => ['#f7931a','#e4c797','#b98758','#80654d','#d46b12','#b9ac95','#997238','#eaaf56','#727070','#f1ddbb','#be6c28','#aaa397'][index % 12]);
}
