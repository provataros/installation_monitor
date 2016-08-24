import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"

import {saveXLSX} from "/client/lib/excel.js";
import {createConfigsBatch} from "/client/lib/lib.js";
import {createConfigsBatch3G} from "/client/lib/lib.js";
import {displayNotification} from "/client/lib/lib.js";

Template.side_panel.events({
  "click #download"(){
    saveXLSX(this.fetch());
  },
  "click #generate"(){
    createConfigsBatch(Session.get("multiSelected"));
  },
  "click #generate3g"(){
    createConfigsBatch3G(Session.get("multiSelected"));
  },
  "click #notes" : function(){
    Session.set("notes","Notes")
  },
  "click #history" : function(){
    Session.set("history","History")
  },
  "click #back" : function(){
    Session.set("selected_device",null);
  },
  "click #save" : function(){
    var id = this._id;
    var flag = false;
    var fields = {};
    var that = this;
    $.each( $(".device-input"), function( key, value ) {
      key = $(value).attr("id").substr(5,$(value).attr("id").length-1)
      value = $(value).getVal();
      if ((value !== that[key] || !id) && value != undefined){
        flag = true;
        fields[key] = value;
      }
    });
    if (flag){
    //  console.log(id);
      if (this.new){
        if (!fields.hw_id || !fields.device_type){
          Session.set("alert",{message : ("Please fill the mandatory fields :<br /><br />Hardware ID<br />Device Type")});;
        }
        else{
          Session.modal.yes = function(){
            var result = Meteor.call("create",fields,function(error,result){
              if (!result.error){
                var str = "Succesfully created with _id : " + result;
                Session.set("alert",{message : (str)});;
                Session.set("selected_device",result);
              }
              else{
                Session.set("alert",{message : ("An error has occured while creating : " + result.error.err)});;
              }
            });
          }
          Session.set("modal",{message : 'Are you sure you want to save?',focus : "yes"})
        }
      }
      else{

        Session.modal.yes = function(){
          var result = Meteor.call("save",id,fields,function(err,res){
            if (res == 1){
              var str = "Succesfully updated : <br /><br />";
              $.each(fields,function(key,value){
                str += labels[key].name +'<br />';
              });
              Session.set("alert",{message : (str.substring(0,str.length))});;
            }
            else{
              console.log(err,res);
              Session.set("alert",{message : ("An error has occured while updating : " + res.error.errmsg)});;
            }
          });
        }
        Session.set("modal",{message : 'Are you sure you want to save?',focus : "yes"})
      }
    }
    else{
      displayNotification("Nothing to update","heads-up");;
    }
  },
  "click #reset" : function(){
    var that = this;
    $(".device-input").each(function( key,value) {
        $(value).val(that[$(value).attr("id").substr(5,$(value).attr("id").length-1)])
    });
    $(".datepicker").each(function(key,value){
      var id = $(value).attr("id").substr(5,$(value).attr("id").length-1);
      if ($("#edit_"+id).val()){
        $(value).val(moment($("#edit_"+id).val(),"YYYYMMDD").format("dddd DD MMM YYYY"));
      }
      else{
        $(value).val("");
      }
    });
  },
  "click #new_acim" : function(){
    Session.set("selected_device","__new__")

  },
  "click #delete" : function(){
    var that = this;
    Session.modal.no = function(){};
    Session.modal.yes = function(){
      Meteor.call("delete",that,function(result,error){
        if (error){
          Session.set("alert",{message : (error.err)});
        }
      });
    }
    Session.set("modal",{message : ("Are you sure you want to delete this device? Hardware ID : '"+that.hw_id),focus : "no"})
  },
  "click #copy" : function(){
    for (var key in this) {
       if (this.hasOwnProperty(key)) {
         delete this[key];
       }
    }
    this.new = true;
    $("#edit_hw_id").val(undefined);
    $("#edit_lsam_id").val(undefined);
    $("#edit_device_id").val(undefined);
    $("#edit_label").val(undefined);
    $("#edit_ip").val(undefined);
    $("#edit_service_id").val(undefined);
    console.log(this);
  },
  "click #usb" : function(){
  },
  "click #logout" : function(){
    Meteor.logout();
  },
  "click #search" : function(){
    Session.set("menu","search");
  },
  "click #map" : function(){
    Session.set("menu","map");
  },
  "click #settings" : function(){
    Session.set("settings","settings");
  }
})