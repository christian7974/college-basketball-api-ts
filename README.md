# College Basketball API (Now in TS)

# Table of Contents
1. [Features/Functionality](#featuresfunctionality)
2. [Table of Statistics](#table-of-statistics)
3. [Examples/Results of Use](#examplesresults-of-use)
4. [Handling Errors](#handling-errors)
5. [Problem/How to Contribute](#problem)

# Description of Project
This is an API that has the 2023-2024 Statistics of every NCAA DI Men's Basketball team in the country. There is also functionality to fetch all teams and their stats, fetch a team by name as well as other capabilities.  

I wanted to make an API that was easy to use and had ample documentation so that someone who is unfamiliar with using an API can feel comfortable using it and get as much out of it as someone who is technically literate. If anything in the documentation is unclear (such as how to use a feature or how to read an error message), please create an issue with your question and I would be happy to help (or someone else may get to help before I can). 

This is the **third** iteration of the project, where the project is now written in Typescript and the problem with querying teams with symbols in their names has been resolved.

This project was made using Typescript, Node.js, Express, Mongoose/MongoDB and hosted on Render. The website scraped was [Basketball Reference](https://www.sports-reference.com/cbb/seasons/men/2024-school-stats.html#basic_school_stats), which is a website that I use a lot to settle sports arguments.

# Challenges I Faced
One challenge that I faced was how the user was going to look up teams that had special symbols in their team name (for instance, Texas A&M). 

Since you cannot have special symbols in the name, I added another field to each team called the ```school_id```, where it contains the encoded version of the school name, which is what will be used whenever you want to query the team. This is easy for teams like Alabama, where the ```school_id``` is just ```alabama```. However for a team like Texas A&M, the encoded name is  ```texas%20a%26m```, where the space is ```%20``` and the ampersand (&) is ```%26```. This is because you cannot have some symbols in a URL (such as spaces and parantheses, so the school Albany (NY) encoded is ```albany%20%28ny%29```).

# Inspiration
I got the inspiration for this project when I wanted something to help me create a bracket for March Madness. I could not find a tool that listed out every statistic for a team (While ESPN was a good start, they did not have the stats that I was looking for when making a decision). The tools that did were either really difficult to use or were not free.  

I made this tool so that other people can have access to statistics about every NCAA Division I Men's Basketball team and can use that information to make better brackets and to have more fun during March Madness.

## Important Note
When entering in a team name in the URL, it is important that the name is **encoded**. Here is a [source](https://www.animalgenome.org/community/angenmap/URLEncoding.html#:~:text=As%20a%20rule%20of%20thumb,need%20to%20be%20URL%2DEncoded.) with a brief intro on URL encoding, how to do so in some languages as well as a table of the various symbols that should be encoded. Some examples of encoded names are:
Alabama -> ```alabama```  
Oral Roberts -> ```oral%20roberts```, where the space is %20  
Texas A&M -> ```texas%20a%26m```, where the ampersand (&) is encoded as %20  
Albany (NY) -> ```albany%20%28ny%29```, where the opening parenthesis is %28 and the closing parenthesis is %29

# Features/Functionality

## Fetch Every Team
To fetch every team and their statistics, use the following:
```
https://college-basketball-api-ts.onrender.com/all
```
This will send an array of every team as a JSON object to the client. **This is automatically sorted by team name, starting with A**.

## Fetch One Team By Name:
To only get one team by name, use the following:
```
https://college-basketball-api-ts.onrender.com/one/team_name
```
where *team_name* is the name of the team that you want to fetch.

## Sort Teams by a Statistic
[Here is the table](#table-of-statistics) of eligible statistics you can query for

To sort the teams by a statistic, use the following:
```
https://college-basketball-api-ts.onrender.com/sort/stat_to_sort_by/order
```
where *stat_to_sort_by* is that stat that you want to sort the teams by and *order* is whether you want to sort the teams by **asc**ending value or **des**cending value.

## Fetch a Team with the Most/Least of a Statistic
To find the team with the most/least of a statistic, use:
```
https://college-basketball-api-ts.onrender.com/extreme/stat/extreme/numExtreme
```
where the *stat* is the stat you want to check, *extreme* is which extreme you want (*most* being the team with the highest of that stat, least being the lowest of that stat) and *numExtreme* is how many teams you want shown in order of the extreme. If this number is omitted, then it will default to one and only show one team.

## Fetch Two Teams to Compare
If you want to fetch two teams and compare their stats, use the following:
```
https://college-basketball-api-ts.onrender.com/multiple?teams=team1&teams=team2
```
where *team1* is the first team that you want to compare and *team2* is the second team that you want to compare. This returns an array of JSON objects with both teams in the array. You can add as many teams as needed to this call by adding ```&teams=team_id```.

## Table of Statistics
| Abbreviation    | Statistic                                        | API Abbreviation   |
|-----------------|---------------------------------------------------|--------------------|
| School Name     | The name of the school                           | school_name        |
| School ID       | The URL encoded version of the school name       | school_id          |
| Wins            | Total number of games won                        | wins               |
| Losses          | Total number of games lost                       | losses             |
| Win-Loss Pct    | Winning percentage of the team                   | win_loss_pct       |
| SRS             | Simple Rating System, a team rating that takes into account average point differential and strength of schedule | srs                |
| SOS             | Strength of Schedule, a measure of the difficulty of a team's schedule | sos                |
| Wins Conf       | Number of conference games won                   | wins_conf          |
| Losses Conf     | Number of conference games lost                  | losses_conf        |
| Wins Home       | Number of home games won                         | wins_home          |
| Losses Home     | Number of home games lost                        | losses_home        |
| Wins Visitor    | Number of away games won                         | wins_visitor       |
| Losses Visitor  | Number of away games lost                        | losses_visitor     |
| PTS             | Total points scored                              | pts                |
| Opp PTS         | Total points scored by opponents against the team| opp_pts            |
| MP              | Total minutes played                             | mp                 |
| FG              | Total field goals made                           | fg                 |
| FGA             | Total field goals attempted                      | fga                |
| FG Pct          | Field goal percentage (FG/FGA)                   | fg_pct             |
| FG3             | Total three-point field goals made               | fg3                |
| FG3A            | Total three-point field goals attempted          | fg3a               |
| FG3 Pct         | Three-point field goal percentage (FG3/FG3A)     | fg3_pct            |
| FT              | Total free throws made                           | ft                 |
| FTA             | Total free throws attempted                      | fta                |
| FT Pct          | Free throw percentage (FT/FTA)                   | ft_pct             |
| ORB             | Total offensive rebounds grabbed                 | orb                |
| TRB             | Total rebounds grabbed                           | trb                |
| AST             | Total assists made                               | ast                |
| STL             | Total steals made                                | stl                |
| BLK             | Total blocks made                                | blk                |
| TOV             | Total turnovers committed                        | tov                |
| PF              | Total personal fouls committed                   | pf                 |



For instance, if you wanted to sort teams by their 3-point shots attempted per game in ascending order, it would look something like:
```
https://college-basketball-api.onrender.com/teams/sort/fg3a/asc
```

# Examples/Results Of Use

## 1. Fetch One Team By Name  
If you wanted to find the stats for Gonzaga, use the following:  
```
https://college-basketball-api-ts.onrender.com/one/gonzaga
```  
which would return the following JSON:

```JSON
{
	"school_name": "Gonzaga",
	"school_id": "gonzaga",
	"wins": 27,
	"losses": 8,
	"win_loss_pct": 0.771,
	"srs": 17.93,
	"sos": 4.02,
	"wins_conf": 14,
	"losses_conf": 2,
	"wins_home": 13,
	"losses_home": 2,
	"wins_visitor": 8,
	"losses_visitor": 2,
	"pts": 2959,
	"opp_pts": 2420,
	"mp": 1400,
	"fg": 1120,
	"fga": 2162,
	"fg_pct": 0.518,
	"fg3": 243,
	"fg3a": 674,
	"fg3_pct": 0.361,
	"ft": 476,
	"fta": 660,
	"ft_pct": 0.721,
	"orb": 379,
	"trb": 1355,
	"ast": 585,
	"stl": 233,
	"blk": 135,
	"tov": 342,
	"pf": 546
}
```

## 2. Sort Teams by Statistic  
If you wanted to sort all of the teams by total blocks ascending, use the following:  
```
https://college-basketball-api-ts.onrender.com/teams/sort/blk/asc
```  
which would send the client an array of every team sorted by blocks per game in ascending order:
```JSON
[
	{
		"school_name": "North Dakota State",
		"school_id": "north%20dakota%20state",
		"wins": 15,
		"losses": 17,
		"win_loss_pct": 0.469,
		"srs": -7.57,
		"sos": -3.15,
		"wins_conf": 8,
		"losses_conf": 8,
		"wins_home": 10,
		"losses_home": 4,
		"wins_visitor": 5,
		"losses_visitor": 11,
		"pts": 2388,
		"opp_pts": 2366,
		"mp": 1315,
		"fg": 873,
		"fga": 1834,
		"fg_pct": 0.476,
		"fg3": 252,
		"fg3a": 667,
		"fg3_pct": 0.378,
		"ft": 390,
		"fta": 543,
		"ft_pct": 0.718,
		"orb": 271,
		"trb": 1097,
		"ast": 370,
		"stl": 139,
		"blk": 43,
		"tov": 355,
		"pf": 468
	},
	{
		"school_name": "UC Riverside",
        ...
]
```

## 3. Fetch a Team with the Extreme of a Stat  
If you wanted to find the team with the most offensive rebounds, use the following:  
```
https://college-basketball-api-ts.onrender.com/extreme/orb/most
```  
which would result in the following:  
```JSON
{
	"school_name": "Texas A&M",
	"school_id": "texas%20a%26m",
	"wins": 21,
	"losses": 15,
	"win_loss_pct": 0.583,
	"srs": 13.35,
	"sos": 9.32,
	"wins_conf": 9,
	"losses_conf": 9,
	"wins_home": 10,
	"losses_home": 5,
	"wins_visitor": 6,
	"losses_visitor": 6,
	"pts": 2736,
	"opp_pts": 2591,
	"mp": 1450,
	"fg": 926,
	"fga": 2304,
	"fg_pct": 0.402,
	"fg3": 255,
	"fg3a": 869,
	"fg3_pct": 0.293,
	"ft": 629,
	"fta": 890,
	"ft_pct": 0.707,
	"orb": 627,
	"trb": 1541,
	"ast": 412,
	"stl": 250,
	"blk": 108,
	"tov": 346,
	"pf": 611
}
```
**Please note**: If numExtreme is anything other than 1, then an array of JSON objects will be returned. If 0 is entered, then only one team will be shown.

## 4. Fetch Two Teams to Compare  
If you wanted to compare the statistics of Connecticut and Southern Indiana, the following would be used:
```
https://college-basketball-api-ts.onrender.com/multiple?teams=connecticut&teams=southern_indiana
```  
and the outcome would be:
```JSON
[
	{
		"school_name": "Connecticut",
		"school_id": "connecticut",
		"wins": 37,
		"losses": 3,
		"win_loss_pct": 0.925,
		"srs": 26.7,
		"sos": 8.7,
		"wins_conf": 18,
		"losses_conf": 2,
		"wins_home": 16,
		"losses_home": 0,
		"wins_visitor": 9,
		"losses_visitor": 3,
		"pts": 3256,
		"opp_pts": 2536,
		"mp": 1600,
		"fg": 1177,
		"fga": 2367,
		"fg_pct": 0.497,
		"fg3": 340,
		"fg3a": 951,
		"fg3_pct": 0.358,
		"ft": 562,
		"fta": 756,
		"ft_pct": 0.743,
		"orb": 469,
		"trb": 1553,
		"ast": 748,
		"stl": 246,
		"blk": 217,
		"tov": 383,
		"pf": 650
	},
	{
		"school_name": "Southern Indiana",
		"school_id": "southern%20indiana",
		"wins": 8,
		"losses": 24,
		"win_loss_pct": 0.25,
		"srs": -13.63,
		"sos": -5.59,
		"wins_conf": 5,
		"losses_conf": 13,
		"wins_home": 5,
		"losses_home": 10,
		"wins_visitor": 3,
		"losses_visitor": 13,
		"pts": 2195,
		"opp_pts": 2335,
		"mp": 1285,
		"fg": 737,
		"fga": 1811,
		"fg_pct": 0.407,
		"fg3": 215,
		"fg3a": 664,
		"fg3_pct": 0.324,
		"ft": 506,
		"fta": 679,
		"ft_pct": 0.745,
		"orb": 319,
		"trb": 1139,
		"ast": 362,
		"stl": 204,
		"blk": 94,
		"tov": 423,
		"pf": 672
	}
]
```

# Handling Errors & A Note on Error Messages.
When using this API, you may mispell a team name (Orel Roberts vs Oral Roberts) or try to find a stat that is not accounted for (for instance, OREB% or FPG). If that is the case, a JSON object will be sent to the user that has the following structure:
```JSON
{
	"message": "A brief description about what went wrong (i.e. a team was not found, an invalid statistic was entered, etc.)",
	"code": "A number representing the error code (most likely 400, but 500 if the API cannot connect to the database)",
	"endpont": "The endpoint that resulted in the error (to help the user figure out what went wrong when using the API)"
}
```

This allows for people using the API to easily see what went wrong when using that endpoint and to display that error if someone using their app tries to make an invalid request. 

For instance, if you tried to use this endpoint (notice the two teams that are being compared):
```
https://college-basketball-api-ts.onrender.com/multiple?teams=road%20island&teams=gonzaguh
```
you would get the following JSON:
```JSON
{
	"message": "One or more of the teams you provided does not exist in the database.",
	"code": 400,
	"endpoint": "/compare?teams=road_island&teams=gonzaguh"
}
```
alerting you that those teams do not exist in the database. If you tried using this endpoint:
```
https://college-basketball-api-ts.onrender.com/extreme/fouls/most
```
the following JSON would be sent to the client:
```JSON
{
	"message": "fouls is not a valid statistic. Please refer to the documentation to find a proper statistic.",
	"code": 400,
	"endpoint": "/extreme/fouls/most"
}
```
letting them know that fouls is not a statistic stored for the teams.


# Features To Be Implemented
Within the code, there are some comments labeled TODO - those are features that I plan on adding to the API, but some of the notable ones are:
- Add Women's NCAA D1 Team statistics
- When sorting teams, showing only the first N results
- Query for teams with stats over a certain amount, under a certain amount or between two amounts
- Possible Chrome Extension that shows the stats of the teams when clicking on the matchups (allowing for better analysis of games)
- Come up with a formula that produces a number on the team most likely to win a matchup (great for quick selections)
- Add per-game statistics to each team.

# Problem?
If you notice a problem (a team has an incorrect value for a statistic, some functionality does not work, etc.) then please create an issue with a description of the issue and how you reproduced that mishap. A helpful issue would include:
- A short but descriptive title about the problem
- The URL that you used that caused the error
- Steps to replicate that issue
- An image of your code and the result that the endpoint produced  

Any more information would be very helpful in debugging and resolving the issue.


