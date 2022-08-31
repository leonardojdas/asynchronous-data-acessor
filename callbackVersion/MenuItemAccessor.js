const fs = require("fs");
const dataSource = "./dataset/MenuItems.json";

exports.getAllItems = getAllItems;
exports.itemExists = itemExists;
exports.getItemByID = getItemByID;
exports.addItem = addItem;
exports.deleteItem = deleteItem;
exports.updateItem = updateItem;

/**
 * Gets all menu items.
 *
 * @param {function} callback - function to call when operation completes:
 *     - if operation is successful, err should be null,
 *       and data should contain an array of objects
 *     - if operation fails, err should contain the error,
 *       and data should be null
 */
function getAllItems(callback) {
    fs.readFile(dataSource, "utf8", function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

/**
 * Determines if a certain item is in the collection.
 *
 * @param {object} item - the item to find
 * @param {function} callback - function to call when operation completes:
 *     - if operation is successful, err should be null,
 *       and data should contain a boolean (true/false) indicating if the item exists
 *     - if operation fails, err should contain the error,
 *       and data should be null
 */
function itemExists(item, callback) {
    fs.readFile(dataSource, (err, data) => {
        if(err) {
            callback(err, null);
        } else {
            getAllItems((err, data) => {
                if(err) callback(err, null);
                let exist = false;
                for(let i = 0; i < data.length; i++){
                    if(data[i].id === item.id){
                        exist = true;
                        break;
                    }
                }
                callback(null, exist);
            });
        }
    });
}

/**
 * Gets the item matching the specified ID.
 *
 * @param {number} itemID - the ID to match
 * @param {function} callback - function to call when operation completes:
 *     - if the item exists, err should be null, and data should be the matching object.
 *     - if the item does not exist, err and data should both be null.
 *     - if there is a read error, err should contain the error, and data should be null.
 */
function getItemByID(itemID, callback) {
    fs.readFile(dataSource, (err, data) => {
        if(err) {
            callback(err, null);
        } else {
            getAllItems((err, data) => {
                if(err) callback(err, null);
                let match = null;
                for(let i = 0; i < data.length; i++){
                    if(data[i].id === itemID){
                        match = data[i];
                        break;
                    }
                }
                callback(null, match);
            });
        }
    });
}

/**
 * Adds a new item to the collection, if it does not already exist.
 *
 * @param {object} item - the item to add
 * @param {function} callback - function to call when operation completes:
 *     - if operation is successful, err should be null, and data should be true
 *     - if the item already exists, err should be null, and data should be false
 *     - if operation fails, err should contain the error, and data should be null
 */
function addItem(item, callback) {
    itemExists(item, (err, exist) => {
        if(err) callback(err, null);
        else if(exist) callback(null, false);
        else {
            getAllItems((err, data) => {
                if(err) callback(err, null);
                data.push(item);
                data = JSON.stringify(data);
                fs.writeFile(dataSource, data, (err) => {
                    if(err) callback(err, null);
                    callback(null, true);
                });
            });
        }
    });
}

/**
 * Deletes an item from the collection, if it exists.
 *
 * @param {object} item - the item to delete
 * @param {function} callback - function to call when operation completes:
 *     - if operation is successful, err should be null, and data should be true
 *     - if the item does not exist, err should be null, and data should be false
 *     - if operation fails, err should contain the error, and data should be null
 */
function deleteItem(item, callback) {
    itemExists(item, (err, exist) => {
        if(err) callback(err, null);
        else if(!exist) callback(err, false);
        else {
            getAllItems((err, data) => {
                if(err) callback(err, null);
                for(let i = 0; i < data.length; i++){
                    if(data[i].id === item.id){
                        data.splice(i, 1);
                        break;
                    }
                }
                data = JSON.stringify(data);
                fs.writeFile(dataSource, data, (err) => {
                    if(err) callback(err, null);
                    callback(null, true);
                });
            });
        }
    });
}

/**
 * Updates an item in the collection, if it exists.
 *
 * @param {object} item - the item to replace the current one
 * @param {function} callback - function to call when operation completes:
 *     - if operation is successful, err should be null, and data should be true
 *     - if the item does not exist, err should be null, and data should be false
 *     - if operation fails, err should contain the error, and data should be null
 */
function updateItem(item, callback) {
    itemExists(item, (err, exist) => {
        if(err) callback(err, null);
        else if(!exist) callback(null, false)
        else {
            getAllItems((err, data) => {
                if(err) callback(err, null);
                for(let i = 0; i < data.length; i++){
                    if(data[i].id === item.id){
                        data[i] = item;
                        break;
                    }
                }
                data = JSON.stringify(data);
                fs.writeFile(dataSource, data, (err) => {
                    if(err) callback(err, null);
                    callback(null, true);
                });
            });
        }
    });
}
