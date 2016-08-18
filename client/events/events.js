import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"

import {saveXLSX} from "/client/lib/excel.js";
import {createConfigs} from "/client/lib/lib.js";
import {createConfigsBatch} from "/client/lib/lib.js";
import {createConfigsBatch3G} from "/client/lib/lib.js";
import {createConfigs_3G} from "/client/lib/lib.js";
import {displayNotification} from "/client/lib/lib.js";
import {clear_query} from "/client/lib/lib.js";


var modalyesfunc;
var modalnofunc;



Template.register.events({
  "click #cancel" : function(){
    Session.set("register",false)
  },
  "click #register" : function(){
    var user = $("#username").val();
    var pass = $("#password").val();
    if (!user || !pass){
      Session.set("alert",{message : "Please fill all the fields"})
      return false;
    }
    Meteor.call("register_user",user,pass,function(err,res){
      if (err){
        Session.set("alert",{message : err.reason})
      }
      else{
        if (res){
          Session.set("alert",{message : "Register succesful!"})
          Meteor.loginWithPassword(user,pass)
        }
        else{
          Session.set("alert",{message : "Something went wrong, please retry"})
        }
      }
    })
  }
})

Template.login.events({
  "click #login" : function(){
    var user = $("#username").val();
    var pass = $("#password").val();
    if (!user || !pass){
      Session.set("alert",{message : "Please fill all the fields"})
      return false;
    }
    Meteor.loginWithPassword(user,pass,function(err,res){
      if (err){
        console.log(err,res);
        Session.set("alert",{message : err.reason})
      }
      else{

      }
    })
  },
  "click #register" : function(){
    Session.set("register",true);
  }
})


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


Template.notes.events({
  "click #createNote" : function(){
    Session.set("popup","notes")
  },
})

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
            if (result == 1){
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
Template.settings.events({
  "change input[type='checkbox']"(e,t){
    var id = (e.target.id);
    var value = e.target.checked;
    var settings = JSON.parse(localStorage.getItem("displayColumns"));
    settings[id]=value;
    localStorage.setItem("displayColumns",
      JSON.stringify(settings)
    )
    Session.set("displayColumns",settings)
  },
  "change input[type='text']"(e,t){
    var id = (e.target.id);
    var value = e.target.value;
    var settings = JSON.parse(localStorage.getItem("config"));
    settings[id]=value;
    localStorage.setItem("config",
      JSON.stringify(settings)
    )
    Session.set("config",settings)
  }
})

Template.device.events({
  "click #configs"(){
    createConfigs(this);
  },
  "click #configs-3g"(){
    createConfigs_3G(this,$("#ip-3g").val());
  }
})

Template.install_image.events({
  "change #image"(e,r){
    console.log(e);
    if (e.target.files && e.target.files[0]){
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#image-preview').empty().append("<img src = '"+e.target.result+"'>");
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  },
  "click #ok"(){
    console.log(this);
    Session.set("install-image",undefined);
  },
  "click #upload"(){
    var img = $("#image")[0];
    var that = this;
    if (img && img.files && img.files[0]){
      var fr = new FileReader();
      fr.onload = function(e){
        var data = e.target.result.replace(/^data:image\/[a-zA-Z]{3,4};base64,/, "")
        Meteor.call("saveImage",that._id,data,function(){
          displayNotification("Image Uploaded","success");;
          Session.set("install-image",undefined);
        });
      }
      fr.readAsDataURL(img.files[0]);
    }
    return;
  }
})


Template.device.events({
  "click .fa-camera"(){
    Session.set("install-image","install-image");
  }
})

