const levenshtein = require('fast-levenshtein');
const removeAccents = require('remove-accents');
const { wordsToNumbers } = require('words-to-numbers');


const removePunctuation = function (text) {
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
};

const convertNumericWordsToNumbers = function (text) {
  return wordsToNumbers(text);
};

class AnswerValidator {
  static sanitizeText(text) {
    let result;
    result = text.toLowerCase();
    result = removePunctuation(result);
    result = removeAccents(result);
    result = convertNumericWordsToNumbers(result);
    return result;
  }

  static checkAnswer(enteredText, clue) {
    const text = AnswerValidator.sanitizeText(enteredText);
    const answer = AnswerValidator.sanitizeText(clue.answer);


    let wasCorrect = false;
    let wasntQuiteCorrect = false;
    if (text === answer) {
      wasCorrect = true; // always down to take an exact match
    }

    const answerTokens = answer.split(' ');
    if (answerTokens.length > 1 && !wasCorrect) {
      // be super lenient for now - an exact match on one of the words will pass
      answerTokens.forEach((token) => {
        if (token === text) {
          wasCorrect = true;
          wasntQuiteCorrect = true;
        }
      });
    }

    // if the answer is long enough, do a levenshtein difference betwen entered and actual
    // - allow for some mispellings
    if (answer.length > 2) {
      const levDistance = levenshtein.get(text, answer);

      // we'll allow one typo every...four letters? idk, we can tweak this
      const allowedErrors = Math.ceil(answer.length / 4);
      if (levDistance <= allowedErrors && !wasCorrect) {
        wasCorrect = true;
        wasntQuiteCorrect = true;
      }
    }

    return {
      wasCorrect,
      wasntQuiteCorrect,
    };
  }
}

export default AnswerValidator;
