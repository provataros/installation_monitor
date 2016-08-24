import { Session } from 'meteor/session'
import {clear_query} from "/client/lib/lib.js";

Template.search_bar.events({
  "click #clear-button" : function(){
    clear_query();
  },
  "keypress .search_input" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).val()+String.fromCharCode(event.charCode);
    Session.set(id,value);
  },
  "keyup .search_input" : function(event,target){
    if (event.key != "Backspace")return;
    var id = $(event.target).attr("id");
    var value = $(event.target).val();
    Session.set(id,value);
  },
  "change select" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).val();
    Session.set(id,value);
  },
  "change input[type='checkbox']" : function(event,target){
    var id = $(event.target).attr("id");
    var value = $(event.target).getVal();
    Session.set(id,value);
  },
  "click #search_button" : function(){
    //Meteor.call("test","test");
  },
  "change .showbox:not(:checked)" : function(event,target){
    $(event.target).siblings(".checkboxDiv").find("input[type='hidden']").each(function(){
      Session.set(this.id,undefined)
    });
  },
});





Template.search_results.events({
  "click .device_item" : function(e,t){
    if (e.ctrlKey){
      var f = Session.get("multiSelected");
      if (f[this._id])delete f[this._id]
      else f[this._id] = this;
      Session.set("multiSelected",f);
    }
    else{
      Session.set("selected_device",this._id);
      status = {};
    }
  },
  "click .sort" : function(e){
    var sort = Session.get("sort");
    var id = e.target.id.substr(5,e.target.id.length-1);
    if (sort === id){
      Session.set("sort_order",Session.get("sort_order")*(-1));
    }
    else{
      Session.set("sort",id);
      Session.set("sort_order",-1);
    }
  }
})





