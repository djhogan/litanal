# -*- coding utf-8 -*-
""" Usage: afinn_analysis.py [-hw WINDOW_WIDTH]

Sentiment analysis using the AFINN lexicon.

-h                  Show this.
-w WINDOW_WIDTH     Width of window (in sentences) for calculating the sliding average of sentiment scores [default: 100].
"""
from docopt import docopt

import os
import re
import sys
import json
import afinn
import nltk
import numpy as np

nltk.download('punkt')

class TextScores:
    """ Dataset of sentences and associated sentiment scores.

    Attributes:
        sentences: List of setences.
        scores: List of sentiment scores for `sentences`.
    """
    def __init__(self, sentences, scores):
        self.sentences = sentences
        self.scores = scores

    @staticmethod
    def from_text(text):
        """ Creates a `TextScores` object from the given string.

        The given string is tokenized into sentences and sentiments scores are 
        calculated for each sentence.

        Args:
            text (str): The text to analyze.

        Returns:
            A TextScores object.
        """
        text_fmt = text.replace('\n', ' ')
        text_fmt = re.sub(r'[ ]+', ' ', text_fmt)
        text_fmt = re.sub(r'[.]+', '.', text_fmt)
        scorer = afinn.Afinn()
        sentences = nltk.sent_tokenize(text_fmt)
        sentences = [sentence for sentence in sentences if sentence != '.']
        scores = [scorer.score(sentence) for sentence in sentences]
        return TextScores(sentences, np.array(scores))
    
    def running_mean(self, width):
        """ Calculate the sliding average of sentiment scores.

        Args:
            width (int):    Width of the window (in sentences) over which to 
                            calculate the sliding average.

        Returns:
            A numpy array of the smoothed scores.
        """
        return np.convolve(self.scores, np.ones((width,))/width, mode='valid')
    
    def __str__(self):
        retval = ''
        for score, sentence in zip(self.scores, self.sentences):
            retval += f'{score}\t{sentence}'
        return retval

if __name__ == '__main__':
    arguments = docopt(__doc__)
    text = sys.stdin.read()
    scores = TextScores.from_text(text)
    scores_list = []
    for score, sentence, mean in zip(
            scores.scores, 
            scores.sentences, 
            scores.running_mean(int(arguments['-w']))):
        scores_list.append({'score': score, 'sentence': sentence, 'mean': mean})
    print(json.dumps(scores_list))
