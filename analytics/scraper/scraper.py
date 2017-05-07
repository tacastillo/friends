import requests
from bs4 import BeautifulSoup as bs
from os import listdir
import csv
import pandas as pd
import re as regex

ROOT_URL = "http://www.livesinabox.com/friends/"
SCRIPTS = ROOT_URL + "scripts.shtml"
SPECIAL = True

def get_speaker(speaker):
	if speaker == "MNCA":
		formatted_speaker = "Monica"
	elif speaker == "RACH":
		formatted_speaker = "Rachel"
	elif speaker == "CHAN":
		formatted_speaker = "Chandler"
	elif speaker == "PHOE":
		formatted_speaker = "Phoebe"
	elif speaker == "JOEY":
		formatted_speaker = "Joey"
	elif speaker == "ROSS":
		formatted_speaker = "Ross"
	else:
		formatted_speaker = speaker
	return formatted_speaker

def get_lines_from_page(path, filename):
	list_of_lines = []
	all_text = []
	transcript_response = requests.get(ROOT_URL + path)
	transcript_page = bs(transcript_response.content, "html.parser")
	all_text = transcript_page.find_all("p")
	if len(all_text) < 10:
		return
	for p in all_text:
		working_string = p.text
		merged_line = working_string.replace("\n", " ")
		if " by:" in merged_line:
			continue
		if ":" in merged_line:
			cleaned_text = regex.sub(r'(?:(\(.*?\)|(\[.*?\])))', "", merged_line, regex.DOTALL)  # Removes Stage Notes
			try:
				speaker, line = cleaned_text.split(":", 1)
				speaker = get_speaker(speaker)
				list_of_lines.append({"Speaker": speaker.upper(), "Line": line.lower()})
			except:
				pass

	write_to_csv(filename, list_of_lines, path)

def get_lines_from_page_sp(filename):
	list_of_lines = []
	episode_name = filename[:3]
	with open("handparsed/{}".format(filename), encoding="utf-8", mode="r") as lines:
		for line in lines:
			line = line.replace("\n", "")
			if " by:" in line:
				continue
			if ":" in line:
				cleaned_text = regex.sub(r'(?:(\(.*?\)|(\[.*?\])))', "", line, regex.DOTALL)  # Removes Stage Notes
				try:
					speaker, line = cleaned_text.split(":", 1)
					speaker = get_speaker(speaker)
					list_of_lines.append({"Speaker": speaker.upper(), "Line": line.lower()})
				except:
					pass
	write_to_csv(episode_name, list_of_lines)

def write_to_csv(filename, list_of_lines):
	df = pd.DataFrame(list_of_lines)
	df.astype(str)
	with open("transcripts/{}.csv".format(filename), encoding='utf-8', mode='w') as output:
		df.to_csv(output, index=False, quoting=csv.QUOTE_ALL, encoding='utf-8')

if __name__ == "__main__":

	if SPECIAL:
		episode_paths = listdir("handparsed")
	else:
		scripts_home = bs(requests.get(SCRIPTS).content, "html.parser")
		episode_paths = scripts_home.find_all("div", align="center")[2].find("div", align="left").find_all("a")

	for episode in episode_paths:
		if SPECIAL:
			get_lines_from_page_sp(episode)
		else:
			title, href = " ".join(episode.text.replace('\n', '').split()), episode['href']
			episode_number = regex.search('\s([\d]+):', title).group(1)
			get_lines_from_page(href, episode_number)