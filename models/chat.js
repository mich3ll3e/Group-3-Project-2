const mongoose = require("mongoose");
const schema = mongoose.schema;
const chatSchema = new schema(
    {
        message: {
            type: String
        },
        sender:{
            type:String
        }},
        {
            timestamps: true
        }
    );

mongoose.Promise = require("bluebird");
const url = "mongodb://localhost:2020/chat";
const connect = mongoose.connect(url,{useNewUrlParser: true});
let chat = mongoose.mode("Chat",chatSchema);
module.exports = chat;
module.exports = connect;


