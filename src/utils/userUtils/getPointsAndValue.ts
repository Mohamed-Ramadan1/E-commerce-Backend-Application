export function getPointsAndValue(points: number): {
  points: number;
  monetaryValue: number;
} {
  const monetaryValue = (points / 1000) * 2; 
  return { points, monetaryValue };
}
