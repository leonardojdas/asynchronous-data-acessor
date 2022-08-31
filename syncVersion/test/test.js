const assert = require("chai").assert;
const fs = require("fs");
const acc = require("../MenuItemAccessor.js");
const originalNumberOfItems = 39;
let testItems;

describe("MenuItemAccessor Tests", function () {
    // Before running any of the tests, ensure that the dataset
    // has been restored to its original state.
    before("Setup", function () {
        testItems = defineTestItems();
        fs.copyFileSync(
            "./dataset/MenuItems_Original.json",
            "./dataset/MenuItems.json"
        );
        console.log("<<setup: Dataset restored to original state.>>");
    });

    describe("Normal Behaviour: operations that should succeed", function () {
        it("get all items returns all the items in the dataset", function () {
            let stuff = acc.getAllItems();
            assert.equal(stuff.length, originalNumberOfItems);
        });

        it("itemExists returns true for an item that exists", function () {
            let result = acc.itemExists(testItems.goodItem);
            assert.isTrue(result);
        });

        it("itemExists returns false for an item that does not exist", function () {
            let result = acc.itemExists(testItems.badItem);
            assert.isFalse(result);
        });

        it("getItemByID returns correct item if it exists", function () {
            let item = acc.getItemByID(testItems.goodItem.id);
            assert.equal(item.id, testItems.goodItem.id);
        });

        it("deleteItem successfully deletes an item from the dataset", function () {
            let result = acc.deleteItem(testItems.itemToDelete);
            assert.isTrue(result);
            assert.isFalse(acc.itemExists(testItems.itemToDelete));
        });

        it("addItem successfully adds an item that does not already exist", function () {
            let result = acc.addItem(testItems.itemToAdd);
            assert.isTrue(result);
            assert.isTrue(acc.itemExists(testItems.itemToAdd));
        });

        it("updateItem successfully updates an item in the dataset", function () {
            let result = acc.updateItem(testItems.itemToUpdate);
            assert.isTrue(result);
            let updatedItem = acc.getItemByID(testItems.itemToUpdate.id);
            assert.equal(testItems.itemToUpdate.category, updatedItem.category);
            assert.equal(
                testItems.itemToUpdate.description,
                updatedItem.description
            );
            assert.equal(testItems.itemToUpdate.price, updatedItem.price);
            assert.equal(
                testItems.itemToUpdate.vegetarian,
                updatedItem.vegetarian
            );
        });
    });

    describe("Errors: operations that should fail", function () {
        it("getItemByID returns null if item does not exist", function () {
            let item = acc.getItemByID(testItems.badItem.id);
            assert.equal(item, null);
        });

        it("addItem returns false, and does not change the dataset, if item already exists", function () {
            let result = acc.addItem(testItems.goodItem);
            let exists = acc.itemExists(testItems.goodItem);
            assert.isFalse(result);
            assert.isTrue(exists);
        });

        it("deleteItem returns false and does not change the dataset, if item does not exist", function () {
            let result = acc.deleteItem(testItems.badItem);
            let exists = acc.itemExists(testItems.badItem);
            assert.isFalse(result);
            assert.isFalse(exists);
        });

        it("updateItem returns false and does not change the dataset, if item does not exist", function () {
            let result = acc.updateItem(testItems.badItem);
            let exists = acc.itemExists(testItems.badItem);
            assert.isFalse(result);
            assert.isFalse(exists);
        });
    });
});

///*** HELPERS ***///
function defineTestItems() {
    return {
        goodItem: {
            id: 107,
            category: "",
            description: "",
            price: 0,
            vegetarian: false,
        },
        badItem: {
            id: 777,
            category: "",
            description: "",
            price: 0,
            vegetarian: false,
        },
        itemToDelete: {
            id: 202,
            category: "ENT",
            description: "seared digby scallops on leek fettuccine",
            price: 30,
            vegetarian: false,
        },
        itemToAdd: {
            id: 888,
            category: "ENT",
            description: "Poutine",
            price: 11,
            vegetarian: false,
        },
        itemToUpdate: {
            id: 303,
            category: "ENT",
            description: "description of item after update",
            price: 11,
            vegetarian: false,
        },
    };
}
