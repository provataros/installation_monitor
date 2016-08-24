import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"
import {save_history} from "/client/lib/lib.js"
import {construct_query} from "/client/lib/lib.js"


Template.registerHelper('selected_agency', function(id) {
  return Session.get("s_agency")===id?"selected":"";
});

Template.registerHelper('selected_hw_status', function(id) {
  return Session.get("s_hw_status")===id?"selected":"";
});

Template.registerHelper('isMultiSelected', function(id) {
  return Session.get("multiSelected")[this._id]!=null?"multiSelected":"";
});

Template.registerHelper('multiSelectedCount', function(id) {
  var f = Session.get("multiSelected");
  var count=0;
  for (i in f) {
    if (f.hasOwnProperty(i)) {
        count++;
    }
  }
  return count;
});

Template.registerHelper("displayColumn",function(col){
  return (Session.get("displayColumns"))[col]
})

Template.registerHelper('selected_type', function(id) {
  return Session.get("s_device_type")===id?"selected":"";
});

Template.registerHelper('selected_sw_status', function(id) {
  return Session.get("s_sw_status")===id?"selected":"";
});

Template.registerHelper('fromSessionP', function(id) {
  return Session.get("s_"+id);
});

Template.registerHelper("results",function(){
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
      var f= sort?Mongo._devices.find(query,sort):Mongo._devices.find(query);

      Session.set("multiSelected",{});
      return f;
    }
})