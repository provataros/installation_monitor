import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"


import {construct_query} from "/client/lib/lib.js"
import {clear_query} from "/client/lib/lib.js"



Template.search_results.helpers({
  
  isUrgent : function(){
    return this.urgent=="true"?"urgent":"";
  },
  save : function(){
    Session.set("search_results",this.fetch());
  }
})

Template.dropdown.helpers({
  isSamTracking : function(){
    if (this.name == "sam_tracking")return true;
    return false;
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

Template.popup.onRendered(function(){
  var that = this;
  this.$('.datepicker').datepicker({
    value : $(this.find(".device-input")).val() ,
    format : "dddd DD MMM YYYY",
    position : "fixed"
  },function(date){
    $(that.find(".date-input")).val(date);
  });
  this.$('.datepicker').val(moment().format("dddd DD MMM YYYY"))
  this.$('.date-input').val(moment().format("YYYYMMDDHHmmss"))
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

Template.install_image.helpers({
  getImages : function(){
    //console.log(this);
    Meteor.call("getImages",this.image,function(error,result){
      $("#previous-images").empty();
      if (!result)return;
      result.reverse();
      for (var i=0;i<result.length;i++){
        if (!result[i].error){
          var image = new Image();
          image.src = 'data:image/png;base64,'+result[i].image;
          $("#previous-images").append(image);
        }
      }
    })
  }
})
