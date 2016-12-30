import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'


Template.side_panel.events({
    "click #teams" : function(){
        Session.set("menu","teams")
    }
    ,
    "click #team_button_create" : function(){
        console.log("got in");
        Session.set("menu","dropdown_search")
    }
    
})


Template.teams.events({
    "click #team_button_create" : function(){
        var name = $("#team_name_create").val();
        var team  = {
            name : name,
            creator : Meteor.userId(),
            members : [Meteor.userId()]
        }
        var result = Meteor.call("create_team",team,function(err,res){ //call server function "create_team" to create a team
        console.log(err,res);
            if (res == "success")console.log(team.creator + " created team " + team.name + " successfully")
            else console.log(res);
        });

    }
    
})

Template.myteams.events({
    "click .team-tab" : function(){
        Session.set("selectedTeam",this._id);
    }
})

Template.showSelectedTeam.events({
    "click #team_member_add" : function(){
        var member = $("#team_member_name").val();
        if (!member)return;

        var result = Meteor.call("add_team_member",Session.get("selectedTeam"),member,function(err,res){ //call server function "create_team" to create a team
            if (res == "success")console.log(member + " added successfully")
            else console.log(res);
        });
    }
})