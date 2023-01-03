const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const typesMap = {
    parent: 'string',
    priority: 'int',
    order: 'int',
    dueDate: 'datetime',
    tagsIDs: 'json',
};

const getTrueType = (key, value) => {
    switch (typesMap[key]) {
        case 'int':
            return parseInt(value);
        case 'json':
            return JSON.stringify(value);
        case 'datetime':
            return new Date();
        default:
            return value;
    }
};

const prismaQuery = (mode, table, query) =>
    prisma[table][mode](query)
        .then((res) => res)
        .catch((err) => {
            console.log(err);
            return err;
        }); //- false if for production

const create = (table, data) => {
    console.log(data);
    Object.keys(data).forEach((propKey) => {
        data[propKey] = getTrueType(propKey, data[propKey]);
    });

    console.log('l39 index.js: ', data)

    return prismaQuery('create', table, {data});
};

const read = (username, table, reqBody) => {
    let query = {data: {where: {username}, select: {}}};

    if (table != 'all') {
        reqBody.props.forEach((prop) => {
            query.select[prop] = true;
        });

        const filters = Object.keys(reqBody.filters);
        filters.forEach((filterKey) => {
            //- transition all the validation to the controllers
            if (filterKey != 'username') {
                query.where[filterKey] = getTrueType(filterKey, reqBody.filters[filterKey]);
            }
        });
    } else {
        query = query.data;
        query.select = reqBody.select;
        table = 'Users'; //! not really clean way
    }

    // console.log(query);
    return prismaQuery('findMany', table, query);
};

const update = (username, table, reqBody) => {
    const query = {where: {username}, data: {}};

    const filters = Object.keys(reqBody.filters);
    filters.forEach((filterKey) => {
        //- transition all the validation to the controllers
        if (filterKey != 'username') {
            query.where[filterKey] = getTrueType(filterKey, reqBody.filters[filterKey]);
        }
    });

    const propKeys = Object.keys(reqBody.data);
    propKeys.forEach((propKey) => {
        if (propKey != 'username') {
            query.data[propKey] = getTrueType(propKey, reqBody.data[propKey]);
        }
    });

    return prismaQuery('updateMany', table, query);
};

const remove = (username, table, reqBody) => {
    const query = {where: {username}};

    const filters = Object.keys(reqBody.filters);
    filters.forEach((filterKey) => {
        //- transition all the validation to the controllers
        if (filterKey != 'username') {
            query.where[filterKey] = getTrueType(filterKey, reqBody.filters[filterKey]);
        }
    });

    // console.log(query);

    return prismaQuery('deleteMany', table, query);
};

module.exports = {
    create,
    read,
    update,
    remove,
};
