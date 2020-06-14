const Analyzer = require('natural').SentimentAnalyzer;
const WordTokenizer = require('natural').WordTokenizer;
const stemmer = require('natural').PorterStemmer;
const stemmerFr = require('natural').PorterStemmerFr;
const SW = require('stopword');

const defaultAnalyzer = new Analyzer('English', stemmer, 'afinn');
const frAnalyzer = new Analyzer('French', stemmerFr, 'pattern');
const tokenizer = new WordTokenizer();

exports.analyze = (report, lang = 'en') => {
  const tokenizedReport = tokenizer.tokenize(report);
  const filteredReport = SW.removeStopwords(tokenizedReport);

  return lang === 'en'
    ? defaultAnalyzer.getSentiment(filteredReport)
    : frAnalyzer.getSentiment(filteredReport);
};

exports.getMood = score => {
  const moodMap = {
    '0': 'Neutral',
    '1': 'Positive',
    '-1': 'Negative'
  };
  const mood = moodMap[Math.sign(score)];
  return !mood ? 'Unknown' : mood;
};
