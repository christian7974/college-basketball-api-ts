import asyncHandler from "express-async-handler"
import Team from '../models/teamModel';
import TeamsList from '../../teams_list';

const arrayOfStats = ['school_name', 'g', 'wins', 'losses', 'win_loss_pct', 'srs', 'sos', 'wins_conf', 'losses_conf', 'wins_home', 'losses_home', 'wins_visitor', 'losses_visitor', 'pts', 'opp_pts', 'mp', 'fg', 'fga', 'fg_pct', 'fg3', 'fg3a', 'fg3_pct', 'ft', 'fta', 'ft_pct', 'orb', 'trb', 'ast', 'stl', 'blk', 'tov', 'pf'];

const statExists = function(inputtedStat: string): boolean {
    if (!arrayOfStats.includes(inputtedStat)) {
        return false;
    } else {
        return true;
    }
};

const teamExists = function(inputtedTeam: string) {
    for (var i = 0; i < TeamsList.length; i ++) {
        if (inputtedTeam === TeamsList[i].school_name) {
            return true;
        }
    }
    return false;
};

const addAllTeams = asyncHandler(async(req, res) => {
    try {
        await Team.create(TeamsList); // Add every team into the database
        res.status(200).send("You have inserted all of the teams!");
    } catch (error) {
        res.status(500);
    }
});

// Clears the database
const clearDatabase = asyncHandler(async(req, res) => {
    try {
        await Team.deleteMany({}); // Remove every team from the database
        res.status(200).send("You have deleted all of the teams!");
    } catch (error) {
        res.status(500);
    }
});

// Shows every team and their stats in the database
const showAllTeams = asyncHandler(async(req, res) => {
    try {
        const allTeams = await Team.find({}, {_id: 0, __v: 0});
        res.status(200).json(allTeams);
    } catch (error) {
        res.status(500);
    }
});

// Function that turns a string into titlecasse (that is how the team names are stored in the database)
function titleCase(str: any) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
}

// Function that can find a team by the name passed in as a parameter
// If the team name has a space, then type the name with underscores (i.e. Oral_Roberts for Oral Roberts)
const findTeamByName = asyncHandler(async(req, res) => {
    try {
        var {teamName} = req.params;
        console.log(teamName);
        teamName = encodeURI(teamName);
        teamName = teamName.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/&/g, '%26');;
        console.log(teamName);
        var theTeam = await Team.find({"school_id": teamName}, {_id: 0, __v: 0});

        // if (theTeam.length == 0) {
        //     theTeam = await Team.find({"school_name": properTeamNameUpper}, {_id: 0, __v: 0});
        // }
        res.status(200).json(theTeam[0]); // The [0] is so the client has a single JSON instead of an array with only one JSON in it
    } catch (error) {
        res.status(500);
    }
});
// [statToSortBy] 1 is ascending, -1 is descending
const sortTeams = asyncHandler(async(req, res) => {
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
            res.status(400).json({error: order + " is not a valid parameter. Please use either asc or des."});
            res.end();
        }
        const sortedJSON = await (Team.find({}, {_id: 0, __v: 0}).sort({[statToSortBy]: valToSort}));
        res.status(200).json(sortedJSON);
    } catch (error) {
        res.status(500);
    }
});

// Get the team that has the most/least of a statistic
// 1 -> is the least
// -1 -> is the most
const getExtreme = asyncHandler(async(req, res) => {
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

// Function to return an array of JSONs of two teams that the user wants to fetch
const compareTwoTeams = asyncHandler(async(req, res) => {
    try {
        var teamOneName = req.params['team1'];
        var teamTwoName = req.params['team2'];
        const teamOneNameNoUnderscores = teamOneName.replace(/_/g, " ");
        const properTeamOneName = titleCase(teamOneNameNoUnderscores);
        const properTeamOneNameUpper = properTeamOneName.toUpperCase();

        const teamTwoNameNoUnderscores = teamTwoName.replace(/_/g, " ");
        const properTeamTwoName = titleCase(teamTwoNameNoUnderscores);
        const properTeamTwoNameUpper = properTeamTwoName.toUpperCase();

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