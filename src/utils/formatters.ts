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
  if (!contract || contract.length < 10) return contract; 
  return `${contract.slice(0, 4)}...${contract.slice(-5)}`;
}

export function timeAgo(timestamp: string, nowMillis: number = Date.now()): string {
  const past = new Date(timestamp).getTime();
  let diffInSeconds = Math.floor((nowMillis - past) / 1000);

  if (diffInSeconds < 1) {
    diffInSeconds = 1; 
  }

  if (diffInSeconds < 60) {
    const unit = diffInSeconds === 1 ? 'second' : 'seconds';
    return `${diffInSeconds} ${unit} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const unit = diffInMinutes === 1 ? 'minute' : 'minutes';
    return `${diffInMinutes} ${unit} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const unit = diffInHours === 1 ? 'hour' : 'hours';
    return `${diffInHours} ${unit} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    const unit = diffInDays === 1 ? 'day' : 'days';
    return `${diffInDays} ${unit} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    const unit = diffInWeeks === 1 ? 'week' : 'weeks';
    return `${diffInWeeks} ${unit} ago`;
  }

  // Approximate a month as 30 days
  const diffInMonths = Math.floor(diffInDays / 30);
  const unit = diffInMonths === 1 ? 'month' : 'months';
  return `${diffInMonths} ${unit} ago`;
}

