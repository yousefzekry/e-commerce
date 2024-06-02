import { assert } from "chai";

describe("App", function () {
	it("app should return ReferenceError: app is not defined", function () {
		assert.equal(app(), "ReferenceError: app is not defined");
	});
});
