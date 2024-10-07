import express, { Request, Response } from 'express';

const router = express.Router();

import {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareTwoTeams, clearDatabase} from '../controllers/teamController';

router.delete('/', clearDatabase);

router.post('/add-all', addAllTeams);

router.get('/all', showAllTeams);

router.get('/:teamName', findTeamByName);

router.get('/sort/:stat/:order', sortTeams);

router.get('/extreme/:stat/:whichExtreme', getExtreme);

export default router;