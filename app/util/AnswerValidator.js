const levenshtein = require('fast-levenshtein');
const removeAccents = require('remove-accents');

const OR = 'or';

class AnswerValidator {
  static sanitizeText(text) {
    const lowerCaseText = text.toLowerCase();
    const lowerCaseTextWithoutPunctuation = lowerCaseText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const lowerCaseTextWithoutPunctuationOrAccents = removeAccents(lowerCaseTextWithoutPunctuation);
    const result = lowerCaseTextWithoutPunctuationOrAccents;
    return result;
  }

  static checkOrAnswer(enteredText, answer) {
    let wasCorrect = false;
    let wasntQuiteCorrect = false;
    let i;

    // split on or and check against each half (or third, etc...)
    const answerTokens = answer.split(OR).map(token => token.trim());

    // what, an actual for loop in 2017? want it to be break;able....
    for (i = 0; i < answerTokens.length; i += 1) {
      const token = answerTokens[i];
      if (token !== OR) {
        if (token === enteredText) {
          wasCorrect = true;
          wasntQuiteCorrect = false;
          break;
        } else if (AnswerValidator.isLevenshteinMatch(enteredText, token)) {
          wasCorrect = true;
          wasntQuiteCorrect = true;
        }
      }
    }

    return {
      wasCorrect,
      wasntQuiteCorrect,
    };
  }

  static isLevenshteinMatch(text, answer) {
    // if the answer is long enough, do a levenshtein difference betwen entered and actual
    // - allow for some mispellings
    if (answer.length > 2) {
      const levDistance = levenshtein.get(text, answer);

      // we'll allow one typo every...four letters? idk, we can tweak this
      const allowedErrors = Math.ceil(answer.length / 4);
      if (levDistance <= allowedErrors) {
        return true;
      }
    }
    return false;
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

    const hasAnOr = answerTokens.some(answerToken => answerToken === OR);
    if (hasAnOr) {
      // I think there's an object destructuring way to do this but i couldn't figure it out
      const result = AnswerValidator.checkOrAnswer(text, answer);
      wasCorrect = result.wasCorrect;
      wasntQuiteCorrect = result.wasntQuiteCorrect;
    }

    const isLevenshteinMatch = AnswerValidator.isLevenshteinMatch(text, answer);
    if (isLevenshteinMatch && !wasCorrect) {
      wasCorrect = true;
      wasntQuiteCorrect = true;
    }

    return {
      wasCorrect,
      wasntQuiteCorrect,
    };
  }
}

export default AnswerValidator;
