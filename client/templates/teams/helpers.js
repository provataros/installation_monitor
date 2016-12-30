import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'


Template.myteams.helpers({
    ownTeams : function(){
        var f = Session.get("selectedTeam");
        
        var res = Mongo._teams.find({creator : Meteor.userId()}).fetch();
        if (!f){
            if(res[0]){
                Session.set("selectedTeam",res[0]._id);
                console.log("autoselect");
            }
        }
        return res;
    },
    isSelectedTeam : function(){
        return this._id==Session.get("selectedTeam")?"active":"";
    }
})

Template.showSelectedTeam.helpers({
    selectedTeam : function(){
        var team = Session.get("selectedTeam");
        if (!team)return;
        return Mongo._teams.findOne({_id : team});
    }
})