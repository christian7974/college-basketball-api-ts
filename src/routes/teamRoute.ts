import express, { Request, Response } from 'express';

const router = express.Router();

import {addAllTeams, showAllTeams, findTeamByName, sortTeams, getExtreme, compareTwoTeams, clearDatabase} from '../controllers/teamController';

router.delete('/', clearDatabase);

router.post('/add-all', addAllTeams);

router.get('/all', showAllTeams);

router.get('/:teamName', findTeamByName);

export default router;