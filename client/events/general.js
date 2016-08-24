import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"

import {save_history} from "/client/lib/lib.js"

Meteor.startup(function(){
  $(document).on('keydown', function (e) {
    if (e.ctrlKey && (e.key == "a" || e.key == "A")){
      var f = Session.get("search_results");
      var dict = {};
      $.each(f,function(key,value){
        dict[value._id] = value;
      })
      Session.set("multiSelected",dict);
      e.preventDefault();
    }
    if (e.keyCode == 27){
       Session.set("modal",undefined);
       Session.set("alert",undefined);
       Session.set("popup",undefined);
       Session.set("notes",undefined);
       Session.set("history",undefined);
       Session.set("multiSelected",{});
    }
  });
})

Template.date.events({
  "click .fa.fa-times" : function(e,t){
    $(e.delegateTarget).find("input").val(undefined);
  }
})

Template.dropdown.events({
  "change #edit_station_name" : function(event,target){
    $("#edit_station_id")[0].selectedIndex = event.target.selectedIndex;
  },
  "change #edit_station_id" : function(event,target){
    $("#edit_station_name")[0].selectedIndex = event.target.selectedIndex;
  },
  "change select" : function(e,t){
    $(e.target).css("color",$(e.target.options[e.target.selectedIndex]).css("color"))
  },
  "change #edit_sub_agency" : function(event,target){
    populateStations(event.target.value);
    $("#edit_station_id").empty();
    $("#edit_station_name").empty();

    $.each(labels.station_id.options,function(key,value){
      $("#edit_station_id").append($("<option></option>").attr("value", value).text(value));
    })
    $.each(labels.station_name.options,function(key,value){
      $("#edit_station_name").append($("<option></option>").attr("value", value).text(value));
    })
    $("#edit_station_id")[0].selectedIndex = 0;
    $("#edit_station_name")[0].selectedIndex = 0;
  },
  "change #edit_agency" : function(e,t){
    if (event.target.value == "STASY"){
      $("#edit_host2").val("10.232.10.31:10005");
    }
    else if(event.target.value == "TRAINOSE"){
      $("#edit_host2").val("10.233.10.31:10005");
    }
    else{
      $("#edit_host2").val("");
    }
  }
});

Template.confirm.events({
  "click #yes"(){
    Session.modal.yes();
    Session.set("modal",undefined);
  },
  "click #no"(){
    Session.modal.no();
    Session.set("modal",undefined);
  }
})

Template.alert.events({
  "click #ok"(){
    Session.set("alert",undefined);
  },
})

Template.notes.events({
  "click #ok"(){
    Session.set("notes",undefined);
  },
})
Template.history.events({
  "click #ok"(){
    Session.set("history",undefined);
  },
})
Template.settings.events({
  "click #ok"(){
    Session.set("settings",undefined);
  },
})
Template.popup.events({
  "click #yes"(){
    save_history($(".popup .date-input").val(),$(".popup #history-info").val(),this._id);
    Session.set("popup",undefined);
  },
  "click #no"(){
    Session.set("popup",undefined);
  }
})