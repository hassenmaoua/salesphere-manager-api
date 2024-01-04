// Helper function to calculate percentage progress
function calculatePercentageProgress(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return Number(
    (((currentValue - previousValue) / previousValue) * 100).toFixed(0)
  );
}

module.exports = { calculatePercentageProgress };
