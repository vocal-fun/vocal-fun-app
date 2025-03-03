export function formatShortNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'b';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'm';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'k';
  } else {
    return num.toString();
  }
}

export function formatContract(contract: string): string {
  if (!contract || contract.length < 10) return contract; // Return as is if too short
  return `${contract.slice(0, 4)}...${contract.slice(-5)}`;
}
