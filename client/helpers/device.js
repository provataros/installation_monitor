import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import {labels} from "/client/static/labels.js"
import {populateStations} from "/client/lib/lib.js"
import {save_history} from "/client/lib/lib.js"
import {construct_query} from "/client/lib/lib.js"


Template.registerHelper('populateStations',function(){
  populateStations(this.sub_agency);
});


Template.registerHelper("history",function(){//TODO
  return Session.get("history");
})

Template.registerHelper("notes",function(){
  return Session.get("notes");
})


Template.registerHelper("install_image",function(){
  return Session.get("install-image");
})