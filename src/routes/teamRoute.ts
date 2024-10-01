import express, { Request, Response } from 'express';

const router = express.Router();

import { clearDatabase, addAllTeams } from '../controllers/teamController';

router.delete('/', clearDatabase);

router.post('/add-all', addAllTeams);

export default router;