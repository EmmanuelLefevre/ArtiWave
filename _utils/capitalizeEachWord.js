/*===============================================*/
/*============ capitalizeEachWord.js ============*/
/*===============================================*/


/*============ CAPITALIZE FIRST LETTERS MODULE ============*/
const capitalizeEachWord = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


/*============ EXPORT MODULE ============*/
module.exports = capitalizeEachWord;
