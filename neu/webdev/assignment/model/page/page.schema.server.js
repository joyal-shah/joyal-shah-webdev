module.exports = function(){

    var mongoose = require("mongoose");

    var PageSchema = mongoose.Schema({
            _website: {type: mongoose.Schema.ObjectId, ref:"websiteModel"},
            name: {type: String, required: true},
            title: String,
            description: String,
            dateCreated: {type: Date, default: Date.now()},
            widgets: [{type: mongoose.Schema.Types.ObjectId, ref:'widgetModel'}]
        },
        {collection: "page"});
    return PageSchema;
};
