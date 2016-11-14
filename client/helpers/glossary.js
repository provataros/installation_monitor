import { Mongo } from "meteor/mongo"
import { Template } from 'meteor/templating';


Template.translation_requests.helpers({
    translation_requests : function(){
        return Mongo._glossary.find({type : "request"});
    },
})

Template.translation_terms.helpers({
    translation_terms : function(){
        if (Session.get("termsearch") && Session.get("termsearch").length >=3)
        return Mongo._glossary.find({$or : [
            {searchtext :  new RegExp(Session.get("termsearch"), "i")},
            {searchtr : new RegExp(Session.get("termsearch"), "i")},
        ],type : "term"});
    }
})