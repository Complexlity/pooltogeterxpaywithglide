import { formatUnits } from 'viem'

export const formatTokenAmount = (
  amount: bigint,
  decimals: number,
  options?: Intl.NumberFormatOptions
) => {
  const tokenAmount = parseFloat(formatUnits(amount, decimals))

  const returned = tokenAmount.toLocaleString('en', {
    maximumFractionDigits: tokenAmount > 1_000 ? 0 : tokenAmount < 0 ? 4 : 2,
    ...options
  })
   return returned
}


export function customFloor(balance: number) {
  if (balance > 1) {
    return Math.floor(balance * 100) / 100;
  } else {
    let numStr = balance.toString();
    let decimalIndex = numStr.indexOf('.');
    if (decimalIndex === -1) return balance; // No decimals
    
    let significantIndex = decimalIndex + 1;
    while (numStr[significantIndex] === '0') {
      significantIndex++;
    }

    let resultStr = numStr.slice(0, significantIndex + 2); // Including two significant decimal places
    return parseFloat(resultStr);
  }
}
