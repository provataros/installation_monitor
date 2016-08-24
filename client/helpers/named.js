import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"


import {construct_query} from "/client/lib/lib.js"
import {clear_query} from "/client/lib/lib.js"

function getStationInfo(name){
  var f = Mongo._devices.find({station_name : name}).fetch();
    var types = {};
    var type;
    for (var i=0;i<f.length;i++){
      type = f[i].device_type;
      !types[type]?(types[type] = {name : type , data : [],hw : 0,sw : 0}):null;
      types[type].data.push(f[i])
      if (f[i].hw_status == "Done"){
        types[type].hw++;
      }
      if (f[i].sw_status == "Done"){
        types[type].sw++;
      }
    }
    var result = [];
    _.each(types,function(key,value){
      key.dcount = key.data.length;
      if (key.hw==0)key.hw = "<label class = 'error'>"+key.hw+"</label>"
      else if (key.hw==key.dcount)key.hw = "<label class = 'success'>"+key.hw+"</label>"
      else key.hw = "<label class = 'warning'>"+key.hw+"</label>"
      if (key.sw==0)key.sw = "<label class = 'error'>"+key.sw+"</label>"
      else if (key.sw==key.dcount)key.sw = "<label class = 'success'>"+key.sw+"</label>"
      else key.sw = "<label class = 'warning'>"+key.sw+"</label>"
      result.push(key);
    })
    //console.log(result)
    return result
  }

  function getAllStations(){
      var obj = {};
      
      var now = Date.now();
      var f = Mongo._devices.find({},{fields : {hw_status : 1,station_name : 1,device_type : 1,sw_status : 1}}).forEach(function(data){
          obj[data.station_name]?obj[data.station_name].push(data):obj[data.station_name] = [data];
      })
      var result = {};
      _.each(obj,function(f,a){
        var types = {};
        var type;
        for (var i=0;i<f.length;i++){
            type = f[i].device_type;
            !types[type]?(types[type] = {name : type , data : [],hw : 0,sw : 0}):null;
            types[type].data.push(f[i])
            if (f[i].hw_status == "Done"){
                types[type].hw++;
            }
            if (f[i].sw_status == "Done"){
                types[type].sw++;
            }
        }
        var status = 0;
        var flag = true;
        var flag2 = false;
        var flag3 = false;
        _.each(types,function(f){
            flag3 = true;
            if ((f.hw == f.sw) && (f.hw == f.data.length))flag = flag && true;
            else flag = false;
            if (f.hw > 0 || f.sw > 0 )flag2 = true;
        });
        if (flag2)status=2;
        if ((flag == flag3) && (flag ==true))status = 1;
        
        f.data = types;
        f.status = status;
        for (var i=0;i<f.length;i++){
            f[i] = null;
        }
         
      })
      return obj;
  }

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
