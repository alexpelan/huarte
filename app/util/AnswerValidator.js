const levenshtein = require('fast-levenshtein');

class AnswerValidator {
  static checkAnswer(enteredText, clue) {
    const text = enteredText.toLowerCase();
    const answer = clue.answer.toLowerCase();

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

    // otherwise, do a levenshtein difference based on the length of the combined answers 
    // - allow for some mispellings
    const levDistance = levenshtein.get(text, answer);

    // we'll allow one typo every...four letters? idk, we can tweak this
    const allowedErrors = Math.ceil(answer.length / 4);
    if (levDistance <= allowedErrors && !wasCorrect) {
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
