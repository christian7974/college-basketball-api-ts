const mongoose = require('mongoose');

// This is the backend schema for an individual team

const teamSchema = mongoose.Schema({
    // team name
    school_name: {
        type: String,
        required: [true, "Every team must have a name"]
    },
    school_id: {
        type: String,
        required: [true, "Every team must have a name"]
    },
    // points per game
    games: {
        type: Number
    },
    // field goals made per game
    wins: {
        type: Number
    },
    // field goal attempts per game
    losses: {
        type: Number
    },
    // field goal percent per game
    win_loss_pct: {
        type: Number
    },
    // 3 point shots made per game
    srs: {
        type: Number
    },
    // 3 point shots attempted per game
    sos: {
        type: Number
    },
    // 3 point percentage
    wins_conf: {
        type: Number
    },
    // free throws made per game
    losses_conf: {
        type: Number
    },
    // free throws attempted per game
    wins_home: {
        type: Number
    },
    // free throw percentage
    losses_home: {
        type: Number
    },
    // offensive rebounds per game
    wins_visitor: {
        type: Number
    },
    // defensive rebounds per game
    losses_visitor: {
        type: Number
    },
    // total rebounds per game
    pts: {
        type: Number
    },
    // assists per game
    opp_pts: {
        type: Number
    },
    // steals per game
    mp: {
        type: Number
    },
    // blocks per game
    fg: {
        type: Number
    },
    // turnovers committed per game
    fga: {
        type: Number
    },
    fg_pct: {
        type: Number
    },
    fg3: {
        type: Number
    },
    fg3a: {
        type: Number
    },
    fg3_pct: {
        type: Number
    },
    ft: {
        type: Number
    },
    fta: {
        type: Number
    },
    ft_pct: {
        type: Number
    },
    orb: {
        type: Number
    },
    trb: {
        type: Number
    },
    ast: {
        type: Number
    },
    stl: {
        type: Number
    },
    blk: {
        type: Number
    },
    tov: {
        type: Number
    },
    pf: {
        type: Number
    },
});

const individualTeam = mongoose.model('Team', teamSchema);

export default individualTeam;
