import asyncHandler from "express-async-handler"
import Team from '../models/teamModel';
import TeamsList from '../teams_list';
import { IndividualTeam, Order, Extreme, ErrorMessage } from '../types';
import teamsList from "../teams_list";

const arrayOfStats = ['school_name', 'school_id', 'g', 'wins', 'losses', 'win_loss_pct', 'srs', 'sos', 'wins_conf', 'losses_conf', 'wins_home', 'losses_home', 'wins_visitor', 'losses_visitor', 'pts', 'opp_pts', 'mp', 'fg', 'fga', 'fg_pct', 'fg3', 'fg3a', 'fg3_pct', 'ft', 'fta', 'ft_pct', 'orb', 'trb', 'ast', 'stl', 'blk', 'tov', 'pf'];
const [databaseErrorMessage, databaseErrorCode]: [string, number] = 
    ["There was an error connecting with the database. Check the README to ensure that the API is up and running", 
        500];

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

const encodeTeamName = function(teamName: string): string { 
    teamName = encodeURI(teamName);
    teamName = teamName.replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/&/g, '%26');
    return teamName;
}

const addAllTeams = asyncHandler(async(_, res) => {
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
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/all"
        } as ErrorMessage);
    }
});

const clearDatabase = asyncHandler(async(_, res) => {
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
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/"
        } as ErrorMessage);
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
        const allTeams: IndividualTeam[] = await Team.find({}, {_id: 0, __v: 0});
        res.status(200).json(allTeams);
    } catch (error) {
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
        });
    }
});

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
        var teamName = req.params['teamName'];
        // Encode the name again, in case for some reason it is not encoded
        teamName = encodeTeamName(teamName);
        var theTeam = await Team.find({"school_id": teamName}, {_id: 0, __v: 0});
        if (theTeam.length === 0) {
            res.status(400).json({
                message: "The team you are looking for does not exist in the database.",
                code: 400,
                endpoint: "/one/" + teamName
            } as ErrorMessage);
        }
        res.status(200).json(theTeam[0]); // The [0] is so the client has a single JSON instead of an array with only one JSON in it
    } catch (error) {
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/one/" + req.params['teamName']
        } as ErrorMessage);
    }
});

// TODO: Add a third parameter for the first n teams sorted by the stat
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
        const statToSortBy: string = req.params['stat'];
        const order: string = req.params['order'].toString();
        if (!statExists(statToSortBy)) {
            res.status(400).json(
                {
                    message: statToSortBy + " is not a valid statistic. Please refer to the documentation to find a proper statistic.",
                    code: 400,
                    endpoint: "/sort/" + statToSortBy + "/" + order
                } as ErrorMessage);
        }
        let valToSort: Order;
        if (order === "asc") {
            valToSort = Order.asc;
        } else if (order === "des"){
            valToSort = Order.des;
        } else {
            res.status(400).json({
                message: order + " is not a valid order. Please use either asc for ascending or des for descending.",
                code: 400,
                endpoint: "/sort/" + statToSortBy + "/" + order
            } as ErrorMessage);
            return;
        }
        const sortedJSON = await (Team.find({}, {_id: 0, __v: 0}).sort({[statToSortBy]: valToSort}));
        res.status(200).json(sortedJSON);
    } catch (error) {
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/sort/" + req.params['stat'] + "/" + req.params['order']
        } as ErrorMessage);
    }
});

const getExtreme = asyncHandler(async(req, res) => {
    /**
     * Function to get the team with the most or least of a statistic (1 is the least and -1 is the most)
     * 
     * @remarks
     * This function is used for the Extreme route that retrieves the team with the most or least of a statistic. Can also be used to find the top n teams of that statistic.
     * 
     * @param req - The stat the user wants to find the extreme of, the most or least of that stat and how many of the top (or bottom) teams to show
     * @returns JSON object of the team with the most or least of a statistic
     */
    try {
        const statToGetExtremeOf: string = req.params['stat'];
        if (!statExists(statToGetExtremeOf)) {
            res.status(400).json({
                message: statToGetExtremeOf + " is not a valid statistic. Please refer to the documentation to find a proper statistic.",
                code: 400,
                endpoint: "/extreme/" + statToGetExtremeOf + "/most"
            } as ErrorMessage
            );
        };
        const whichExtreme = req.params['whichExtreme'].toString();
        const numExtreme: number = +req.params['numExtreme'] || 1;
        numExtreme > teamsList.length && res.status(400).json({error: "The number of teams you want to find is greater than the number of teams in the database."});

        var extremeSide: Extreme;
        if (whichExtreme == "least") {
            extremeSide = Extreme.least;
        } else if (whichExtreme == "most"){
            extremeSide = Extreme.most;
        } else {
            res.status(400).json({
                message: whichExtreme + " is not a valid extreme. Please use either most for the most of a statistic or least for the least of a statistic.",
                code: 400,
                endpoint: "/extreme/" + statToGetExtremeOf + "/" + whichExtreme
            } as ErrorMessage);
            return;
        }

        const theTeam = await (Team.find({}, {_id: 0, __v: 0}).sort({[statToGetExtremeOf] : extremeSide}).limit(numExtreme));
        numExtreme === 1 ? res.status(200).json(theTeam[0]) : res.status(200).json(theTeam); // The [0] is so this sends a single JSON instead of an array containing one JSON
    } catch (error) {
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/extreme/" + req.params['stat'] + "/" + req.params['whichExtreme']
        } as ErrorMessage);
    }
});

// TODO: Make this endpoint variable to compare n teams
const compareMultipleTeams = asyncHandler(async(req, res) => {
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
        const teams = req.query.teams;
        if (!teams) {
            res.status(400).json({
                message: "You must provide two teams to compare.",
                code: 400,
                endpoint: "/compare?teams="
            });
        }
        const teamsArray = Array.isArray(teams) ? teams : [teams];
        const decodedTeamsArray = teamsArray.map(team => encodeTeamName(team as string));
        const foundTeams = await Team.find({"school_id": {$in: decodedTeamsArray}}, {_id: 0, __v: 0});

        foundTeams.length != teamsArray.length && res.status(400).json({
            message: "One or more of the teams you provided does not exist in the database.",
            code: 400,
            endpoint: "/compare?teams=" + teamsArray.join("&teams=")
        } as ErrorMessage);
        teamsArray.length < 2 ? res.status(200).json(foundTeams[0]) : res.status(200).json(foundTeams);
    } catch (error) {
        res.status(500).json({
            message: databaseErrorMessage,
            code: databaseErrorCode,
            endpoint: "/compare?teams=" + req.query.teams
        });
    }
});

export {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareMultipleTeams, clearDatabase};