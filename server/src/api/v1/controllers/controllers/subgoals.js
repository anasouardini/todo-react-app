const {create, read, update, remove} = require('./../imports');
const {
    verifiedUsername,
    updateHash,
    restructureCreate,
    parseInputs,
    getTableName,
} = require('./../shared');

const itemType = 'subgoal';
const tableName = getTableName(itemType);

const createSubgoals = async (req, res) => {
    const inputs = req.body.props;
    const response = await create(
        tableName,
        parseInputs(inputs, {username: verifiedUsername, type: itemType})
    );

    const newResponse = {
        hash: updateHash,
        ...restructureCreate(response),
    };

    // console.log(newResponse);
    res.json(newResponse);
};

const readSubgoals = async (req, res) => {
    const response = await read(verifiedUsername, tableName, req.body);
    res.json(response);
};

//! needs validation
const updateSubgoals = async (req, res) => {
    const response = await update(verifiedUsername, tableName, req.body);
    res.json({hash: updateHash, ...response});
};

//! needs validation
const deleteSubgoals = async (req, res) => {
    const response = await remove(verifiedUsername, tableName, req.body);
    res.json({hash: updateHash, ...response});
};

module.exports = {
    createSubgoals,
    readSubgoals,
    updateSubgoals,
    deleteSubgoals,
};
