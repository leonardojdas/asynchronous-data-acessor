/**
 * Tester for MenuItemAccessor - requires Mocha and Chai.
 *
 * DO NOT MODIFY THIS FILE.
 *
 * @author S. Monk
 * @version 28-Apr-2022
 */
const assert = require("chai").assert;
const fs = require("fs");
const acc = require("../MenuItemAccessor.js");
const originalNumberOfItems = 39;
let testItems;

describe("MenuItemAccessor Tests", function () {
    // Before running any of the tests, ensure that the dataset
    // has been restored to its original state.
    before("Setup", function (done) {
        testItems = defineTestItems();
        fs.copyFile(
            "./dataset/MenuItems_Original.json",
            "./dataset/MenuItems.json",
            function (err) {
                if (err) return done(err);
                console.log("<<setup: Dataset restored to original state.>>");
                done();
            }
        );
    });

    describe("Normal Behaviour: operations that should succeed", function () {
        it("get all items returns all the items in the dataset", function (done) {
            acc.getAllItems(function (err, data) {
                if (err) return done(err);
                assert.equal(data.length, originalNumberOfItems);
                done();
            });
        });

        it("itemExists returns true for an item that exists", function (done) {
            acc.itemExists(testItems.goodItem, function (err, data) {
                if (err) return done(err);
                assert.isTrue(data);
                done();
            });
        });

        it("itemExists returns false for an item that does not exist", function (done) {
            acc.itemExists(testItems.badItem, function (err, data) {
                if (err) return done(err);
                assert.isFalse(data);
                done();
            });
        });

        it("getItemByID returns correct item if it exists", function (done) {
            acc.getItemByID(testItems.goodItem.id, function (err, data) {
                if (err) return done(err);
                assert.equal(data.id, testItems.goodItem.id);
                done();
            });
        });

        it("addItem returns true, and item is added to the dataset (if the item does not already exist)", function (done) {
            acc.addItem(testItems.itemToAdd, function (err, data) {
                acc.itemExists(testItems.itemToAdd, function (err2, data2) {
                    if (err) return done(err);
                    if (err2) return done(err2);
                    assert.isTrue(data);
                    assert.isTrue(data2);
                    done();
                });
            });
        });

        it("deleteItem returns true, and item is removed from the dataset (if the item exists)", function (done) {
            acc.deleteItem(testItems.itemToDelete, function (err, data) {
                acc.itemExists(testItems.itemToDelete, function (err2, data2) {
                    if (err) return done(err);
                    if (err2) return done(err2);
                    assert.isTrue(data);
                    assert.isFalse(data2);
                    done();
                });
            });
        });

        it("updateItem returns true, and the item is updated in the dataset (if it exists)", function (done) {
            acc.updateItem(testItems.itemToUpdate, function (err, data) {
                acc.getItemByID(
                    testItems.itemToUpdate.id,
                    function (err2, updatedItem) {
                        if (err) return done(err);
                        if (err2) return done(err2);
                        assert.isTrue(data);
                        assert.equal(
                            testItems.itemToUpdate.category,
                            updatedItem.category
                        );
                        assert.equal(
                            testItems.itemToUpdate.description,
                            updatedItem.description
                        );
                        assert.equal(
                            testItems.itemToUpdate.price,
                            updatedItem.price
                        );
                        assert.equal(
                            testItems.itemToUpdate.vegetarian,
                            updatedItem.vegetarian
                        );
                        done();
                    }
                );
            });
        });
    });

    describe("Errors: operations that should fail", function () {
        it("getItemByID returns null if item does not exist", function (done) {
            acc.getItemByID(testItems.badItem.id, function (err, data) {
                if (err) return done(err);
                assert.equal(data, null);
                done();
            });
        });

        it("addItem returns false, and does not change the dataset, if item already exists", function (done) {
            acc.addItem(testItems.goodItem, function (err, data) {
                acc.itemExists(testItems.goodItem, function (err2, data2) {
                    if (err) return done(err);
                    if (err2) return done(err2);
                    assert.isFalse(data);
                    assert.isTrue(data2);
                    done();
                });
            });
        });

        it("deleteItem returns false and does not change the dataset, if item does not exist", function (done) {
            acc.deleteItem(testItems.badItem, function (err, data) {
                acc.itemExists(testItems.badItem, function (err2, data2) {
                    if (err) return done(err);
                    if (err2) return done(err2);
                    assert.isFalse(data);
                    assert.isFalse(data2);
                    done();
                });
            });
        });

        it("updateItem returns false and does not change the dataset, if item does not exist", function (done) {
            acc.updateItem(testItems.badItem, function (err, data) {
                acc.itemExists(testItems.badItem, function (err2, data2) {
                    if (err) return done(err);
                    if (err2) return done(err2);
                    assert.isFalse(data);
                    assert.isFalse(data2);
                    done();
                });
            });
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
