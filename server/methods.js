import { Mongo } from 'meteor/mongo';
import {initlabels } from "./init/labels";


var xlsx = Npm.require("xlsx");
var fs = Npm.require("fs");

Meteor.methods({
  initlabels : initlabels
})




Meteor.methods({
  xlsx : function(){
    var f = xlsx.readFile("../../../../../server/onboard.xlsx");
    console.log(f);
  }
})