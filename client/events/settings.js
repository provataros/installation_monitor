import { Session } from 'meteor/session'

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







