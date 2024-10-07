import express from 'express';

const router = express.Router();

import {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareTwoTeams, clearDatabase} from '../controllers/teamController';

// Clear all of the teams in the database
router.delete('/', clearDatabase);

// Add all of the teams to the database
router.post('/add-all', addAllTeams);

// Query all of the teams in the country
router.get('/all', showAllTeams);

// Find a team by its name
router.get('/:teamName', findTeamByName);

// Sort the teams by a certain statistic
router.get('/sort/:stat/:order', sortTeams);

// Get the team with the most or the least of a statistic
router.get('/extreme/:stat/:whichExtreme', getExtreme);

// Compare two teams by their statistics
router.get('/compare/:team1/:team2', compareTwoTeams);


export default router;