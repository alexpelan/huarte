const levenshtein = require('fast-levenshtein');
const removeAccents = require('remove-accents');

const AND = ' and ';
const OR = ' or ';
const ARTICLES = ['the ', 'a ', 'an '];

class AnswerValidator {
  static removeArticlesFromFront(text) {
    let articleLessString = text;
    ARTICLES.forEach((article) => {
      if (text.startsWith(article)) {
        articleLessString = text.slice(article.length);
      }
    });
    return articleLessString;
  }

  static sanitizeText(text) {
    const lowerCaseText = text.toLowerCase();
    const lowerCaseTextWithoutPunctuation = lowerCaseText.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    const lowerCaseTextWithoutPunctuationOrAccents = removeAccents(lowerCaseTextWithoutPunctuation);
    const result = AnswerValidator.removeArticlesFromFront(
      lowerCaseTextWithoutPunctuationOrAccents,
    );
    return result;
  }

  static sanitizeToken(token) {
    const tokenWithoutArticles = AnswerValidator.removeArticlesFromFront(token);
    return tokenWithoutArticles.trim();
  }

  static checkOrAnswer(enteredText, answer) {
    let wasCorrect = false;
    let wasntQuiteCorrect = false;
    let i;

    // split on or and check against each half (or third, etc...)
    const answerTokens = answer.split(OR).map(token => AnswerValidator.sanitizeToken(token));

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

  static checkAndAnswer(enteredText, answer) {
    let wasCorrect = true;
    let wasntQuiteCorrect = false;

    const enteredTextTokens = enteredText.split(AND).map(token => (
      AnswerValidator.sanitizeToken(token)
    ));
    const answerTokens = answer.split(AND).map(token => AnswerValidator.sanitizeToken(token));

    answerTokens.forEach((answerToken) => {
      const enteredTextContainsExactMatch = enteredTextTokens.some(
        enteredTextToken => enteredTextToken === answerToken,
      );

      const enteredTextContainsLevenshteinMatch = enteredTextTokens.some(
        enteredTextToken => AnswerValidator.isLevenshteinMatch(enteredTextToken, answerToken),
      );

      if (!enteredTextContainsExactMatch && !enteredTextContainsLevenshteinMatch) {
        wasCorrect = false;
      } else if (!enteredTextContainsExactMatch && enteredTextContainsLevenshteinMatch) {
        wasntQuiteCorrect = true;
      }
    });

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

      // we'll allow one typo every...6 letters? idk, we can tweak this
      const allowedErrors = Math.ceil(answer.length / 6);
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
      return {
        wasCorrect,
        wasntQuiteCorrect,
      };
    }

    const isLevenshteinMatch = AnswerValidator.isLevenshteinMatch(text, answer);
    if (isLevenshteinMatch) {
      return {
        wasCorrect: true,
        wasntQuiteCorrect: true,
      };
    }

    const hasAnAnd = answer.includes(AND);
    if (hasAnAnd) {
      return AnswerValidator.checkAndAnswer(text, answer);
    }

    const hasAnOr = answer.includes(OR);
    if (hasAnOr) {
      return AnswerValidator.checkOrAnswer(text, answer);
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

    return {
      wasCorrect,
      wasntQuiteCorrect,
    };
  }
}

export default AnswerValidator;
