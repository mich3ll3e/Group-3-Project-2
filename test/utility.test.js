const moment = require("moment");
const formatMessage = require("../utils/messages");
describe("Utility", () => {
  describe("messages", () => {
    it("Should return messages ", () => {
      const messages = formatMessage("Michelle", "Hello");
      expect(messages.username).toEqual("Michelle");
    });
  });

  describe("messages", () => {
    it("Should return messages ", () => {
      const messages = formatMessage("Michelle", "Hello");
      expect(messages.text).toEqual("Hello");
    });
  });

  describe("messages", () => {
    it("Should return messages ", () => {
      const messages = formatMessage("Michelle", "Hello");
      expect(messages.time).toEqual(moment().format("h:mm a"));
    });
  });
});
