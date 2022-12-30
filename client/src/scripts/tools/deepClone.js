const deepClone = (obj) => (obj ? JSON.parse(JSON.stringify(obj)) : null);

export default deepClone;
