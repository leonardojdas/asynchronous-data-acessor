const fs = require("fs");
const dataSource = "./dataset/MenuItems.json";

exports.getAllItems = getAllItems;
exports.getItemByID = getItemByID;
exports.itemExists = itemExists;
exports.deleteItem = deleteItem;
exports.addItem = addItem;
exports.updateItem = updateItem;

/**
 * Gets all the menu items.
 *
 * @returns {array of object} an array of objects created from the JSON file
 * @throws exception if file cannot be read
 */
function getAllItems() {
    try {
        let contents = fs.readFileSync(dataSource, "utf-8");
        return JSON.parse(contents);
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Determines if a menu item exists in the collection.
 *
 * @param {object} item - the item to look for
 * @returns true if the item exists; false if not
 * @throws exception if collection cannot be accessed
 */
function itemExists(item) {
    let data = getAllItems();
    let exists = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === item.id) {
            exists = true;
            break;
        }
    }

    return exists;
}

/**
 * Gets the menu item matching a specific ID.
 *
 * @param {number} itemID - the ID to match
 * @returns the item with the matching ID, or null if the item doesn't exist
 * @throws exception if collection cannot be accessed
 */
function getItemByID(itemID) {
    let data = getAllItems();
    let result = null;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === itemID) {
            result = data[i];
            break;
        }
    }
    return result;
}

/**
 * Adds a new item to the collection.
 *
 * @param {object} item - the item to add
 * @returns true if the item was added; false otherwise
 * @throws exception if the collection cannot be accessed
 */
function addItem(item) {
    if (itemExists(item)) {
        return false;
    }

    let jsonData = getAllItems();
    jsonData.push(item);
    fs.writeFileSync(dataSource, JSON.stringify(jsonData), "utf8");
    return true;
}

/**
 * Deletes the item matching the specified item.
 *
 * @param {object} item - the item "equal to" the one to delete
 * @returns true if the item was deleted; false otherwise
 * @throws exception if the collection cannot be accessed
 */
function deleteItem(item) {
    if (!itemExists(item)) {
        return false;
    }

    let jsonData = getAllItems();
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id === item.id) {
            jsonData.splice(i, 1);
            break;
        }
    }

    fs.writeFileSync(dataSource, JSON.stringify(jsonData), "utf8");
    return true;
}

/**
 * Updates an item.
 *
 * @param {object} item - the item to replace the old one
 * @returns true if the item was updated; false otherwise
 * @throws exception if the collection cannot be accessed
 */
function updateItem(item) {
    if (!itemExists(item)) {
        return false;
    }

    let jsonData = getAllItems();
    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id === item.id) {
            jsonData[i] = item;
            break;
        }
    }

    fs.writeFileSync(dataSource, JSON.stringify(jsonData), "utf8");
    return true;
}
