const {create, read, update, remove} = require('./../imports');
const {
    verifiedUsername,
    updateHash,
    restructureCreate,
    getTableName,
    parseInputs,
} = require('./../shared');

const itemType = 'project';
const tableName = getTableName(itemType);

const createProjects = async (req, res) => {
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

    // console.log(newResponse.fields);
    // console.log(newResponse);
    res.json(newResponse);
};

const readProjects = async (req, res) => {
    const response = await read(verifiedUsername, tableName, parseInputs(req.body));
    // console.log(response);
    const newResponse = {
        hash: updateHash,
        ...restructureCreate(response),
    };

    // console.log(newResponse);
    res.json(newResponse);
};

const updateProjects = async (req, res) => {
    const response = await update(verifiedUsername, tableName, parseInputs(req.body));
    res.json({hash: updateHash, ...response});
};

const deleteProjects = async (req, res) => {
    const response = await remove(verifiedUsername, tableName, parseInputs(req.body));
    // console.log(response);
    res.json({hash: updateHash, ...response});
};

module.exports = {
    createProjects,
    readProjects,
    updateProjects,
    deleteProjects,
};
