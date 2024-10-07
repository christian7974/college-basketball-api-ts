from bs4 import BeautifulSoup
import requests
import json
import re
import urllib.parse
url = "https://www.sports-reference.com/cbb/seasons/men/2024-school-stats.html#basic_school_stats"
response = requests.get(url)
# TODO: Add functionality to scrape the table for women's basketball
# array of all the teams
array_of_teams = []

if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')
    title = soup.title
    all_table_rows = soup.find_all("tr")
    for row in all_table_rows:
        # if (row):
        individual_team = {}
        # find all the team names
        all_tds = row.find_all("td")
        if all_tds:
            for td in all_tds:
                if (td['data-stat'] != "DUMMY"):
                    if (td['data-stat'] == "school_name"):
                        
                        team_name = td.text.replace('\u00a0NCAA', '') # Remove the NCAA from the team name
                        individual_team[td['data-stat']] = team_name

                        # Encode the Team Name to be used as the school ID
                        school_id = urllib.parse.quote(team_name.lower())
                        individual_team["school_id"] = school_id
                        
                    else:
                        # Program continues if the cell is blank
                        if td.text == "":
                            individual_team[td['data-stat']] = 0
                        else:
                            individual_team[td['data-stat']] = float(td.text)
            array_of_teams.append(individual_team)

else:
    print("Error: " + str(response.status_code))
# Write the array to a JSON file
# Pretty Print the array of JSON objects
with(open("teams.json", "w")) as file:
    file.write(json.dumps(array_of_teams, indent=4))