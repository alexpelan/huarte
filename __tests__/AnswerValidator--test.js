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
