const {create, read, update, remove} = require('./../imports');
const {
    verifiedUsername,
    updateHash,
    restructureCreate,
    getTableName,
    parseInputs,
} = require('./../shared');

const itemType = 'workflow';
const tableName = getTableName(itemType);

const createWorkflows = async (req, res) => {
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

const readWorkflows = async (req, res) => {
    const response = await read(verifiedUsername, tableName, req.body);
    res.json(response);
};

const updateWorkflows = async (req, res) => {
    const response = await update(verifiedUsername, tableName, req.body);
    res.json(response);
};

const deleteWorkflows = async (req, res) => {
    const response = await remove(verifiedUsername, tableName, req.body);
    res.json({hash: updateHash, ...response});
};

module.exports = {
    createWorkflows,
    readWorkflows,
    updateWorkflows,
    deleteWorkflows,
};
