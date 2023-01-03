const BRIDGE = (() => {
    // const typesMap = {
    //     parent: 'string',
    //     priority: 'int',
    //     order: 'int',
    //     dueDate: 'datetime',
    // };

    // const getTrueType = (key, value) => {
    //     // console.log(key);
    //     switch (typesMap[key]) {
    //         case 'int':
    //             return parseInt(value);
    //         case 'json':
    //             return JSON.stringify(value);
    //         case 'datetime':
    //             return new Date(value);
    //         default:
    //             return value;
    //     }
    // };

    const APIUTILS = {
        location: 'http://127.0.0.1:2000/api/',
        options: (method, body) => ({
            method,
            headers: {
                Accept: 'application.json',
                'Content-Type': 'application/json',
            },
            cache: 'default',
            body: JSON.stringify(body),
        }),
    };

    // checks if cache is empty or out of date
    const checkUpdate = async () => {
        // checking for empty cache
        localStorage.removeItem('dbObj');
        const cache = JSON.parse(localStorage.getItem('dbObj'));
        if (cache) {
            // checking for updates
            // let res = false;
            // for (let i = 0; i < 3 && !res; i++) {
            //     res = await read('update', {hash: cache.hash});
            //     if (!res) {
            //         if (i == 2) {
            //             return -1;
            //         }
            //     }
            // }
            // return Number(res.isChanged);
            return 0;
        }

        return 1;
    };

    // fetch ALL from db and populate cache
    const updateCacheAll = async () => {
        const response = await read('all', {});
        // console.log(response)

        if (response.hasOwnProperty('errmsg')) {
            console.log('no work to load');
            return false;
        }

        localStorage.setItem('dbObj', JSON.stringify(response));
    };

    const sync = async () => {
        const res = await checkUpdate();
        if (res == 1) {
            console.log('fetching new changes');
            await updateCacheAll(); // fetch all data
        } else if (res < 0) {
            console.error('failed while checking for updates');
        } else {
            console.log('already up to date');
        }
    };

    const write = async (component, body) => {
        return fetch(`${APIUTILS.location}${component}`, APIUTILS.options('post', body))
            .then((res) =>
                res
                    .json()
                    .then((res) => res)
                    .catch(() => false)
            )
            .catch(() => false);
    };

    const read = (component, body) => {
        return fetch(`${APIUTILS.location}get/${component}`, APIUTILS.options('post', body))
            .then((res) =>
                res
                    .json()
                    .then((res) => res)
                    .catch((err) => err)
            )
            .catch(() => false);
    };

    const update = (component, body) => {
        return fetch(`${APIUTILS.location}${component}`, APIUTILS.options('put', body))
            .then((res) =>
                res
                    .json()
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return err;
                    })
            )
            .catch((err) => {
                return err;
            });
    };

    const remove = (component, body) => {
        return fetch(`${APIUTILS.location}${component}`, APIUTILS.options('delete', body))
            .then((res) =>
                res
                    .json()
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        return err;
                    })
            )
            .catch((err) => {
                return err;
            });
    };

    return {
        write,
        read,
        update,
        remove,
        sync,
    };
})();

export default BRIDGE;
