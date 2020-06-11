exports.getMood = score => {
  const moodMap = {
    '0': 'Neutral',
    '1': 'Positive',
    '-1': 'Negative'
  };
  return moodMap[Math.sign(score)];
};
