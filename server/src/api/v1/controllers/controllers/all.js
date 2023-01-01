const {read} = require('./../imports');

const {verifiedUsername, updateHash, restructureAll} = require('./../shared');

const readAll = async (req, res) => {
    let response = await read(verifiedUsername, 'all', {
        select: {
            passhash: false,
            username: false,
            Workflows: {
                include: {
                    children: {
                        include: {
                            children: {
                                include: {
                                    children: true,
                                },
                            },
                        },
                    },
                },
            },
            Profiles: true,
            Tags: true,
        },
    })
        .then((res) => res)
        .catch((err) => err);
    // console.log(response);

    if (response.length) {
        const newResponse = {
            hash: updateHash,
            ...restructureAll({
                children: [
                    {children: response[0]?.Workflows, type: 'work', id: 'dummy', childrenIDs: []},
                ],
                type: 'dbObj',
                profiles: response[0].Profiles,
                tags: response[0].Tags,
            }),
        };
        // console.log(newResponse.project.);
        res.json(newResponse);
    } else {
        res.json(response);
        // res.json({errmsg: 'db is empty'});
    }
};

module.exports = {readAll};
