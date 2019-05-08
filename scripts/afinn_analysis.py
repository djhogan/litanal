import os
import re
import sys
import json
import afinn
import nltk
import numpy as np

# from contextlib import redirect_stdout
# with redirect_stdout(open(os.devnull, 'w')):
nltk.download('punkt')

class TextScores:
    def __init__(self, sentences, scores):
        self.sentences = sentences
        self.scores = scores
    @staticmethod
    def from_text(text):
        ''' returns text scores of text.
        '''
        text_fmt = text.replace('\n', ' ')
        text_fmt = re.sub(r'[ ]+', ' ', text_fmt)
        text_fmt = re.sub(r'[.]+', '.', text_fmt)
        scorer = afinn.Afinn()
        sentences = nltk.sent_tokenize(text_fmt)
        sentences = [sentence for sentence in sentences if sentence != '.']
        scores = [scorer.score(sentence) for sentence in sentences]
        return TextScores(sentences, np.array(scores))
    def cumulative():
        pass
        # return np.cumsum(self.scores)
        ''' returns cumulative score.
        '''
    def running_mean(self, width):
        ''' returns running mean.
        '''
        return np.convolve(self.scores, np.ones((width,))/width, mode='valid')
    def __str__(self):
        for score, sentence in zip(self.scores, self.sentences):
            print(f'{score}\t{sentence}')

text = sys.stdin.read()
scores = TextScores.from_text(text)
scores_list = []
for score, sentence, mean in zip(
        scores.scores, 
        scores.sentences, 
        scores.running_mean(100)):
    scores_list.append({'score': score, 'sentence': sentence, 'mean': mean})
print(json.dumps(scores_list))
