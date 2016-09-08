import {Mongo} from "meteor/mongo";
todo = new Mongo.Collection("todo");
Mongo._todo = todo;


Template.side_panel.events({
    "click #tasks" : function(){
        Session.set("menu","tasks");
    }
})


Template.todo_personal.events({
    "keydown .createQuick" : function(e){
        if(e.keyCode == 13){
            if (e.target.value && e.target.value != ""){
                Meteor.call("createQuickTaskPersonal",e.target.value);
                e.target.value = "";
            }
        }
    },
})

Template.todo_team.events({
    "keydown .createQuick" : function(e){
        if(e.keyCode == 13){
            if (e.target.value && e.target.value != ""){
                Meteor.call("createQuickTaskTeam",e.target.value);
                e.target.value = "";
            }
        }
    },
})

Template.view_todo.events({
    "click .task-personal.task-quick.task-incomplete" : function(){
        Meteor.call("completeQuickTask",this._id);
    },
    "click .task-personal.task-quick.task-complete" : function(){
        Meteor.call("enableQuickTask",this._id);
    },
    "click .task-team.task-quick.task-incomplete" : function(){
        Meteor.call("completeQuickTaskTeam",this._id);
    },
    "click .task-team.task-quick.task-complete" : function(){
        Meteor.call("enableQuickTaskTeam",this._id);
    },
    "click .fa-times" : function(){
        Meteor.call("deleteTask",this._id)
    }
})

Template.todo_personal.helpers({
    tasks : function(){
        return  Meteor.user() && Mongo._todo.find({"user" :  Meteor.user().username,status : "incomplete"},{sort: {created : -1}});
    },
    completed : function(){
        return  Meteor.user() && Mongo._todo.find({"user" :  Meteor.user().username,status : "complete"},{sort: {created : -1}});
    }
})

Template.todo_team.helpers({
    tasks : function(){
        return  Meteor.user() && Mongo._todo.find({"user" :  "___TEAM",status : "incomplete"},{sort: {created : 1}});
    },
    completed : function(){
        return  Meteor.user() && Mongo._todo.find({"user" : "___TEAM",status : "complete"},{sort: {created : 1}});
    },
    isOwn : function(){
        return Meteor.user() && this.author == Meteor.user().username;
    }
})