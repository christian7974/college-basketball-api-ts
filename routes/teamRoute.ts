import express from 'express';

import {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareMultipleTeams, clearDatabase} from '../controllers/teamController';

const router = express.Router();

// Clear all of the teams in the database
router.delete('/', clearDatabase);

// Add all of the teams to the database
router.post('/add-all', addAllTeams);

// Query all of the teams in the country
router.get('/all', showAllTeams);

// Find a team by its name
router.get('/one/:teamName', findTeamByName);

// Sort the teams by a certain statistic
router.get('/sort/:stat/:order', sortTeams);

// Get the team with the most or the least of a statistic (the question mark after the parameter means that it is optional)
router.get('/extreme/:stat/:whichExtreme/:numExtreme?', getExtreme);

// Compare two teams by their statistics (Uses query parameters instead of URL parameters)
router.get('/multiple', compareMultipleTeams);


export default router;