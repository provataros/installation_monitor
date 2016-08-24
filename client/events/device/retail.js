import { Session } from 'meteor/session'
import {createConfigsBatch} from "/client/lib/lib.js";
import {createConfigsBatch3G} from "/client/lib/lib.js";

import {createConfigs} from "/client/lib/lib.js";
import {createConfigs_3G} from "/client/lib/lib.js";
import {displayNotification} from "/client/lib/lib.js";

import {save_history} from "/client/lib/lib.js"

Template.retail.events({
  "click .fa-camera"(){
    Session.set("install-image","install-image");
  }
})

Template.retail.events({
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

Template.notes.events({
  "click #createNote" : function(){
    Session.set("popup","notes")
  },
})