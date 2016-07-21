import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"


import {construct_query} from "/client/lib/lib.js"

Template.search_results.helpers({
  results : function(){
    var query = construct_query();
    var sort = Session.get("sort");
    if (sort){
      obj = {};
      obj[sort] = Session.get("sort_order");
      sort = {sort : obj}
    }
    else{
      sort = null;
    }
    if (query){
      return sort?Mongo._devices.find(query,sort):Mongo._devices.find(query);
    }
  },
  isUrgent : function(){
    return this.urgent=="true"?"urgent":"";
  }
})


Template.date.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(this.find(".device-input")).val() ,
    format : "dddd DD MMM YYYY"
  },function(date){
    $(that.find(".device-input")).val(date);
  });
})


Template.searchDate.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(that.find(".search_input")).val() ,
    format : "dddd DD MMM YYYY"
  },function(date){
    $(that.find(".search_input")).val(date);
    var id = $(that.find(".search_input")).attr("id");
    Session.set(id,date);
  });
})
