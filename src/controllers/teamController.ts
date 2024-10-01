import { Request, Response } from 'express';
import asyncHandler from "express-async-handler"
import Team from '../models/teamModel';
import TeamsList from '../../teams_list';
// Clears the database
const clearDatabase = asyncHandler(async (req: Request, res: Response) => {
    try {
        await Team.deleteMany({}); // Remove every team from the database
        res.status(200).send("You have deleted all of the teams!");
    } catch (error) {
        res.status(500).send("Error deleting teams");
    }
});

const addAllTeams = asyncHandler(async(req: Request, res: Response) => {
    try {
        await Team.create(TeamsList); // Add every team into the database
        res.status(200).send("You have inserted all of the teams!");
    } catch (error) {
        res.status(500);
    }
})

export { clearDatabase, addAllTeams };