export type IndividualTeam = {
    schoolId: string;      // school name api-friendly (no spaces, no special characters, lowercase)
    schoolName: string;    // official school name
    gamesPlayed: number;   // games played
    wins: number;
    losses: number;
    winLossPct: number;    // win-loss percentage
    srs: number;           // Simple Rating System
    sos: number;           // Strength of Schedule
    winsConf: number;      // conference wins
    lossesConf: number;    // conference losses
    winsHome: number;      // home wins
    lossesHome: number;    // home losses
    winsVisitor: number;   // road wins
    lossesVisitor: number; // road losses
    points: number;        // points scored
    oppPoints: number;     // opponent points
    minutesPlayed: number; // minutes played
    fieldGoals: number;    // field goals made
    fieldGoalAttempts: number; // field goals attempted
    fieldGoalPct: number;  // field goal percentage
    threePointers: number; // 3-pointers made
    threePointAttempts: number; // 3-pointers attempted
    threePointPct: number; // 3-point percentage
    freeThrows: number;    // free throws made
    freeThrowAttempts: number; // free throws attempted
    freeThrowPct: number;  // free throw percentage
    offensiveRebounds: number;  // offensive rebounds
    totalRebounds: number;      // total rebounds
    assists: number;       // assists
    steals: number;        // steals
    blocks: number;        // blocks
    turnovers: number;     // turnovers
    personalFouls: number; // personal fouls
};

export enum Order {
    "asc" = 1,
    "des" = -1
}

export enum Extreme {
    "least" = 1,
    "most" = -1
}

export type ErrorMessage = {
    message: string;
    code: number;
    endpoint: string;
}
