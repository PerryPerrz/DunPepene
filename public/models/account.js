const fs = require('fs');
const fileName = './public/models/account.json';
const json = require('./account.json'); //json is an object that's contains the whole file content "account.json"

module.exports = {
    signIn: function (email, password) {
        let account = findAccountByEmail(email);
        if (account[0] === null)
            return "failure";

        //Here, the account exist.
        //We search the account in the Json object.
        if (account[1].email === email && account[1].password === password)
            return "success";

        return "failure";
    },
    signUp: function (username, email, password) {
        if (findAccountByEmail(email)[0] !== null)
            return "failure";

        //Here, the account doesn't exist yet.
        //We add the account in the Json object.
        json.push({"username": username, "email": email, "password": password});
        //We rewrite the Json file with the Json object's content.
        saveInJsonFile();

        return "success";
    },
    getUsernameWithEmail: function (email) {
        let account = findAccountByEmail(email);
        if (account[0] === null)
            return "failure";

        return account[1].username;
    }
}

//Function that rewrites the content of the .json file with the new content of the json object.
function saveInJsonFile() {
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
    });
}

//Function that finds an account by a given email, it returns an array that contains the index and the content of the account.
function findAccountByEmail(email) {
    let res = null;
    let res2 = null;
    let i = 0;
    //We search in the JSON file for the event that has the id (an id is unique) we are searching for.
    json.forEach(function (account) {
        if (account.email === email) {
            res = i;
            res2 = account;
        }
        i++;
    })
    return [res, res2];
}