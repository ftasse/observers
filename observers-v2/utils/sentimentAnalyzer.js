const Analyzer = require('natural').SentimentAnalyzer;
const WordTokenizer = require('natural').WordTokenizer;
const stemmer = require('natural').PorterStemmer;
const stemmerFr = require('natural').PorterStemmerFr;
const SW = require('stopword');

const defaultAnalyzer = new Analyzer('English', stemmer, 'afinn');
const frAnalyzer = new Analyzer('French', stemmerFr, 'senticon');
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
  return moodMap[Math.sign(score)];
};
