import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js";



Template.stations.helpers({
    stations : function(){
        return Mongo._stations.find({});
    }
})