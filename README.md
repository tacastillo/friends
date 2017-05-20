This repo contains the code used to produce [this](https://tacastillo.github.io/friends) collection of visualizations of Friends dialogue.

The file structure is as follows:
* *analytics/Friends Foolery.ipynb* contains the Juptyer notebook for exploratory text analysis
* *analytics/data* contains the all the outputted JSON data from the Jupyter notebook
* *analytics/scraper* contains the web scraper used to grab all the episode transcripts from the web, parse it and save it outwards
* *src* is the root directory for all the JS and CSS used to build the page. Produced by [create-react-app](https://github.com/facebookincubator/create-react-app/)
* *src/charts* contains the slightly modified, but for the most part general, graphs used to produce these visualizations