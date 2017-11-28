import AnswerValidator from '../app/util/AnswerValidator';

const testData = [
  // exact match, exact capitalization
  {
    enteredText: 'schist',
    clue: { answer: 'schist' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // exact match, different capitalzation
  {
    enteredText: 'ChLOROPhyll',
    clue: { answer: 'chlorophyll' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // last name for a first and last name
  {
    enteredText: 'Jefferson',
    clue: { answer: 'Thomas Jefferson' },
    wasCorrect: true,
    wasntQuiteCorrect: true,
  },
  // levenshtein match - a (reasonable) mispelling
  {
    enteredText: 'levenshtien',
    clue: { answer: 'levenshtein' },
    wasCorrect: true,
    wasntQuiteCorrect: true,
  },
  // one-letter answer - doesn't allow mispellings (#1)
  {
    enteredText: 'G',
    clue: { answer: 'R' },
    wasCorrect: false,
    wasntQuiteCorrect: false,
  },
  // strip punctuation from both question and answer (#2)
  {
    enteredText: 'ER',
    clue: { answer: 'E.R.' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // #2, continued
  {
    enteredText: 'E.R.',
    clue: { answer: 'ER' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // remove accents from both input and anything stored (#8)
  {
    enteredText: 'acai',
    clue: { answer: 'açaí' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // #8 - other way around
  {
    enteredText: 'açaí',
    clue: { answer: 'acai' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // convert any words like 'nine' to their equivalent numbers (#)
  {
    enteredText: 'district Nine',
    clue: { answer: 'district 9' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
  // #9, other way around
  {
    enteredText: 'District 9',
    clue: { answer: 'district nine' },
    wasCorrect: true,
    wasntQuiteCorrect: false,
  },
];

test('marks correct answers correct and incorrect answers incorrect, and differentiates between exact matches and inexact matches', () => {
  testData.forEach((test) => {
    const {
      wasCorrect,
      wasntQuiteCorrect,
    } = AnswerValidator.checkAnswer(test.enteredText, test.clue);
    expect(wasCorrect).toEqual(test.wasCorrect);
    expect(wasntQuiteCorrect).toEqual(test.wasntQuiteCorrect);
  });
});
