/*============ CAPITALIZE FIRST LETTER MODULE ============*/
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};


/*============ EXPORT MODULE ============*/
module.exports = capitalizeFirstLetter;
