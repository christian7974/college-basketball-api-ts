import asyncHandler from "express-async-handler"
import Team from '../models/teamModel';
import TeamsList from '../../teams_list';

const arrayOfStats = ['school_name', 'g', 'wins', 'losses', 'win_loss_pct', 'srs', 'sos', 'wins_conf', 'losses_conf', 'wins_home', 'losses_home', 'wins_visitor', 'losses_visitor', 'pts', 'opp_pts', 'mp', 'fg', 'fga', 'fg_pct', 'fg3', 'fg3a', 'fg3_pct', 'ft', 'fta', 'ft_pct', 'orb', 'trb', 'ast', 'stl', 'blk', 'tov', 'pf'];

const statExists = function(inputtedStat: string): boolean {
    /**
     * This function checks if the inputted stat exists in the array of stats
     * 
     * @remarks
     * This is a helper function for the sortTeams and getExtreme functions that ensure a stat exists before sorting it
     * 
     * @param inputtedStat - The stat that the user wants to sort by
     * @returns Boolean value indicating if the stat exists
     */
    if (!arrayOfStats.includes(inputtedStat)) {
        return false;
    } else {
        return true;
    }
};

const teamExists = function(inputtedTeam: string) {
    /**
     * This function checks if the inputted team exists in the array of teams. Since the amount of teams is a small constant, we can use a linear search to find the team
     * 
     * @remarks
     * This is a helper function for the compareTwoTeams function that ensures a team exists before comparing it
     * 
     * @param inputtedTeam - The team that the user wants to compare
     * @returns Boolean value indicating if the team exists
     */
    for (var i = 0; i < TeamsList.length; i ++) {
        if (inputtedTeam === TeamsList[i].school_name) {
            return true;
        }
    }
    return false;
};

const addAllTeams = asyncHandler(async(req, res) => {
    /**
     * Function to add all of the teams to the database (since they are stored in a separate file after the website is scraped)
     * 
     * @remarks
     * The function adds all of the teams to the database and sends a 200 status code if successful
     * 
     * @returns 200 status code if successful, 500 status code if unsuccessful
     */
    try {
        await Team.create(TeamsList); // Add every team into the database
        res.status(200).send("You have inserted all of the teams!");
    } catch (error) {
        res.status(500);
    }
});

const clearDatabase = asyncHandler(async(req, res) => {
    /**
     * Function to clear the database of all teams (used when changing the schema of the database)
     * 
     * @remarks
     * This function gets rid of every team in the database
     * 
     * @returns 200 status code if successful, 500 status code if unsuccessful
     */
    try {
        await Team.deleteMany({}); // Remove every team from the database
        res.status(200).send("You have deleted all of the teams!");
    } catch (error) {
        res.status(500);
    }
});

const showAllTeams = asyncHandler(async(req, res) => {
    /**
     * Function to show all of the teams in the database (useful for finding the school_id of a team)
     * 
     * @remarks 
     * Used in the all route to show all of the teams in the database
     * 
     * @returns 200 status code if successful, 500 status code if unsuccessful
     */
    try {
        const allTeams = await Team.find({}, {_id: 0, __v: 0});
        res.status(200).json(allTeams);
    } catch (error) {
        res.status(500);
    }
});

function titleCase(teamName: any) {
    /**
     * Function to convert a string to title case
     * 
     * @remarks
     * This function is used to convert a team name to title case (i.e. "alabama" -> "alabama")
     * 
     * @params teamName - The team name that the user wants to convert to title case
     * @returns The team name in title case
     */
    teamName = teamName.toLowerCase().split(' ');
    for (var i = 0; i < teamName.length; i++) {
        teamName[i] = teamName[i].charAt(0).toUpperCase() + teamName[i].slice(1); 
    }
    return teamName.join(' ');
}

const findTeamByName = asyncHandler(async(req, res) => {
    /**
     * Function to find a team by its name
     * 
     * @remarks
     * Function to search the database for a team by its name.
     * 
     * @param req - The name of the team that the user wants to find
     * @return JSON object of the team that is found or an error message indicating that the team is not found
     */
    try {
        var {teamName} = req.params;
        console.log(teamName);
        teamName = encodeURI(teamName);
        teamName = teamName.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/&/g, '%26');;
        console.log(teamName);
        var theTeam = await Team.find({"school_id": teamName}, {_id: 0, __v: 0});

        res.status(200).json(theTeam[0]); // The [0] is so the client has a single JSON instead of an array with only one JSON in it
    } catch (error) {
        res.status(500);
    }
});

// TODO: add a third parameter for the first n teams sorted by the stat
const sortTeams = asyncHandler(async(req, res) => {
    /**
     * Function to sort the teams by a statistic and which order, where asc is ascending and des is descending
     * 
     * @remarks
     * This function sorts the teams by a statistic and which order the user wants to sort it by (for Mongoose, 1 is ascending and -1 is descending)
     * 
     * @param req - The statistic that the user wants to sort by and the order that the user wants to sort it by
     * @returns JSON object of the teams sorted by the statistic
     */
    try {
        const statToSortBy = req.params['stat'];
        const order = req.params['order'].toString();
        if (!statExists(statToSortBy)) {
            res.status(400).json({error: statToSortBy + " is not a valid statistic to sort by. Please use another statistic."});
            res.end();
        }
        var valToSort = 0;
        if (order == "asc") {
            valToSort = 1;
        } else if (order == "des"){
            valToSort = -1;
        } else {
            res.status(400).json({error: order + " is not a valid order. Please use either asc or des."});
            res.end();
        }
        const sortedJSON = await (Team.find({}, {_id: 0, __v: 0}).sort({[statToSortBy]: valToSort}));
        res.status(200).json(sortedJSON);
    } catch (error) {
        res.status(500);
    }
});

// TODO: Get the first n teams with the most/least of a statistic
const getExtreme = asyncHandler(async(req, res) => {
    /**
     * Function to get the team with the most or least of a statistic (1 is the least and -1 is the most)
     * 
     * @remarks
     * This function is used for the Extreme route that retrieves the team with the most or least of a statistic.
     * 
     * @param req - The statistic that the user wants to find the extreme of and which extreme they want to find
     * @returns JSON object of the team with the most or least of a statistic
     */
    try {
        const statToGetExtremeOf = req.params['stat'];
        if (!statExists(statToGetExtremeOf)) {
            res.status(400).json({error: statToGetExtremeOf + " is not a valid statistic. Please refer to documentation to find a proper statistic."});
            res.end();
        };
        const whichExtreme = req.params['whichExtreme'].toString();
        var valToSort = 0;

        if (whichExtreme == "least") {
            valToSort = 1;
        } else if (whichExtreme == "most"){
            valToSort = -1;
        } else {
            res.status(400).json({error: whichExtreme + " is not a valid extreme. Please use either most for the highest or least for the lowest."});
            res.end();
        }

        const theTeam = await (Team.find({}, {_id: 0, __v: 0}).sort({[statToGetExtremeOf] : valToSort}).limit(1));
        res.status(200).json(theTeam[0]); // The [0] is so this sends a single JSON instead of an array containing one JSON
    } catch (error) {
        res.status(500);
    }
});

// TODO: Make this endpoint variable to compare n teams
const compareTwoTeams = asyncHandler(async(req, res) => {
    /**
     * Function that retrieves two teams that the user wants to compare
     * 
     * @remarks
     * This function is used to compare two teams that the user wants to compare
     * 
     * @params req - The two teams that the user wants to compare
     * @returns Array of JSON objects of both teams
     */
    try {
        var teamOneName = req.params['team1'];
        var teamTwoName = req.params['team2'];
        const teamOneNameNoUnderscores = teamOneName.replace(/_/g, " ");
        const properTeamOneName = titleCase(teamOneNameNoUnderscores);
        const properTeamOneNameUpper = properTeamOneName.toUpperCase();

        const teamTwoNameNoUnderscores = teamTwoName.replace(/_/g, " ");
        const properTeamTwoName = titleCase(teamTwoNameNoUnderscores);
        const properTeamTwoNameUpper = properTeamTwoName.toUpperCase();

        // TODO: Make this code leaner
        if (!teamExists(properTeamOneName) && !teamExists(properTeamTwoName) && !teamExists(properTeamOneNameUpper) && !teamExists(properTeamTwoNameUpper)){
            res.status(400).json({error: properTeamOneName + " and " + properTeamTwoName + " are not in the database of teams. Please use two different teams."});
            res.end();
        } else if (!teamExists(properTeamOneName) && !teamExists(properTeamOneNameUpper)) {
            res.status(400).json({error: properTeamOneName + " is not in the database of teams. Please try another team."});
            res.end();
        } else if (!teamExists(properTeamTwoName) && !teamExists(properTeamTwoNameUpper)) {
            res.status(400).json({error: properTeamTwoName + " is not in the database of teams. Please try another team."});
            res.end();
        };
        const bothTeams = await Team.find({
            "school_name": {
                $in : [
                    properTeamOneName,
                    properTeamTwoName,
                    properTeamOneNameUpper,
                    properTeamTwoNameUpper
                ]
            }
        }, {_id: 0, __v: 0});
        res.status(200).json(bothTeams);
    } catch (error) {
        res.status(500);
    }
});

export {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareTwoTeams, clearDatabase};