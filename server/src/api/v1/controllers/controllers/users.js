const {create} = require('./../imports');
const {verifiedUsername, parseInputs} = require('./../shared');

const createUsers = async (req, res) => {
    const inputs = req.body.props;
    res.json(
        await create(
            'Users',
            parseInputs({}, {username: verifiedUsername, passhash: inputs.password})
        )
    );
};

module.exports = {createUsers};
