# Overview

A web application for sentiment analysis of classic literature. Currently, a small set of works is available for analysis.

The web application uses ExpressJS on the backend to listen and respond to HTTP requests. When the client selects a book, a GET request is sent to analyze the selected book. The backend loads the selected book and sends the text to a python script (`scripts/afinn_analysis.py`). The python script returns the sentiment scores on a per-sentence basis in JSON format. The JSON text is packaged in the HTTP response. The client-side parses the JSON text and displays the data using D3. It may take up to a minute for the results to appear, depending on the length of the book.

The project is set up for deployment to heroku, but can be deployed manually by first installing the node dependencies in package.json using npm and the python dependencies listed in requirements.txt. Build with `npm build` and start the server with `npm start` or `node server.js`.
