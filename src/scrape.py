from bs4 import BeautifulSoup
import requests
import json
import re

url = "https://www.sports-reference.com/cbb/seasons/men/2024-school-stats.html#basic_school_stats"
response = requests.get(url)

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
                        team_name = td.text.replace('\u00a0NCAA', '') # remove the NCAA from the team name
                        team_name = re.sub(r'\(([^)]*)\)', r'\1', team_name).strip() # Removes the Parantheses from the team name
                        individual_team[td['data-stat']] = team_name.title()

                        school_id = team_name.lower().replace(" ", "-")
                        school_id = school_id.replace("&", "")
                        individual_team["school_id"] = school_id
                        
                    else:
                        # make it so that the program continues if the cell is blank
                        if td.text == "":
                            individual_team[td['data-stat']] = 0
                        else:
                            individual_team[td['data-stat']] = float(td.text)
            array_of_teams.append(individual_team)

else:
    print("Error: " + str(response.status_code))
# print(array_of_teams[0])
# write the array to a json file
# pretty print the array of json objects
with(open("teams.json", "w")) as file:
    file.write(json.dumps(array_of_teams, indent=4))

# print(array_of_teams[3])
# list_of_properties = list(array_of_teams[3].keys())
# print(list_of_properties)
# write the array to a json file