export function getPointsAndValue(points: number): {
  points: number;
  monetaryValue: number;
} {
  const monetaryValue = (points / 1000) * 2; // 1000 points = $2.00
  return { points, monetaryValue };
}
