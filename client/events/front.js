import { Session } from 'meteor/session'

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
