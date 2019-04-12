const getConfig = require('probot-config');

/**
 * Function to check if a key is present in the labels object list
 * @param {String} key 
 * @param {Array<String>} labels 
 */
const checkForLabel = (key, labels) => {
    if (key && labels && labels.length > 0) {
        // loop through all the label names
        labels.forEach( ({ name }) => {
            if (name == key) {
                return true;
            }
        });
    }

    return false;
}

/**
 * Function to return the list of names of labels in a Label object list.
 * @param {Labels<Object>} lables 
 */
const getLabels = (labels) => {
    let labelArray = [];
    console.log(labels);
    labels.forEach( ({name}) => {
        console.log(name)
        labelArray.push(name);
    });

    return labelArray;
}

/**
 * Get the config file from the repo
 * @param {Probot Context} context 
 */
const getRepoConfig = async (context) => {
    return await getConfig(context, 'news-room.yml');
}

/**
 * Check if a user is in the admin list
 * @param {String} user 
 * @param {Array<String>} admins 
 */
const checkIfAdmin = (user, admins) => {
    if (user && user.length > 0) {
        if (admins.indexOf(user) > -1) {
            return true;
        }
    }
    return false;
}

/**
 * Function takes a string and tests wheather it's a valid email.
 * @parm {String} text
 */
const validateEmail = (text) => {
    const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regex.test(text);
}


/**
 * Function to replace a given string into astericks except the first and last characters
 * @param {String} string 
 */
function replaceWithAstericks(string) {
    let stars = '';
    for (let i = 0; i < string.length-2; i++) {
        stars += '•'
    }

    const obfs =`${string[0]}${stars}${string[string.length-1]}`;
    return obfs;
}
/**
 * Function to obfuscate an email into astericks
 * eg: hello@mail.com to h***o@m*****m
 * @param {String} email 
 */
const obfuscateEmail = (email) => {
    const [username, domain] = email.split('@');
    const obfuscatedEmail = `${replaceWithAstericks(username)}@${replaceWithAstericks(domain)}`;
    return obfuscatedEmail;
}


module.exports = {
    checkForLabel,
    getRepoConfig,
    checkIfAdmin,
    getLabels,
    validateEmail,
    obfuscateEmail
}

