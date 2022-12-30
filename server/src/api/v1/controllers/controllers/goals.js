const {create, read, update, remove} = require('./../imports');
const {
    verifiedUsername,
    updateHash,
    restructureCreate,
    getTableName,
    parseInputs,
} = require('./../shared');

const itemType = 'goal';
const tableName = getTableName(itemType);

const createGoals = async (req, res) => {
    const inputs = req.body.props;
    const response = await create(
        tableName,
        parseInputs(inputs, {username: verifiedUsername, type: itemType})
    );
    // console.log(response);
    const newResponse = {
        hash: updateHash,
        ...restructureCreate(response),
    };

    // console.log(newResponse);
    res.json(newResponse);
};

const readGoals = async (req, res) => {
    const response = await read(verifiedUsername, tableName, req.body);
    res.json(response);
};

const updateGoals = async (req, res) => {
    const response = await update(verifiedUsername, tableName, req.body);
    res.json(response);
};

const deleteGoals = async (req, res) => {
    const response = await remove(verifiedUsername, tableName, req.body);
    // console.log(response);
    res.json({hash: updateHash, ...response});
};

module.exports = {
    createGoals,
    readGoals,
    updateGoals,
    deleteGoals,
};
