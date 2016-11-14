import { Mongo } from "meteor/mongo"
import { Template } from 'meteor/templating';

function replaceD(text){
    var f = text;
    f = f.replace("έ","ε");
    f = f.replace("ά","α");
    f = f.replace("ί","ι");
    f = f.replace("ό","ο");
    f = f.replace("ή","η");
    f = f.replace("ύ","υ");
    f = f.replace("ώ","ω");

    f = f.replace("ΐ","ι");
    f = f.replace("ΰ","υ");

    f = f.replace("Έ","ε");
    f = f.replace("Ά","α");
    f = f.replace("Ί","ι");
    f = f.replace("Ό","ο");
    f = f.replace("Ή","η");
    f = f.replace("Ύ","υ");
    f = f.replace("Ώ","ω");
    return f;
}


Template.createTerm.events({
    "click #requestTranslation .divButton" : function(){
        var f = $("#requestTranslation textarea").val();
        if (!f)return;
        Meteor.call("requestTranslation",{
            text : f,
            tr : null,
            type : "request",
            searchtext : replaceD(f).toLowerCase()
        },function(res,err){
            console.log (res,err);
        })
    },
    "input #findTerm input"(){
        Session.set("termsearch",replaceD($("#findTerm input").val()))
    },
    "click #createTerm .divButton" : function(){
        var f = $("#createTerm #trtext").val();
        var x = $("#createTerm #trtr").val();
        if (!f || !x)return;
        Meteor.call("createTerm",{
            text : f,
            tr : x,
            type : "term",
            searchtext : replaceD(f).toLowerCase(),
            searchtr : replaceD(x).toLowerCase()
        },function(res,err){
            console.log (res,err);
            Session.set("termsearch",replaceD(f).toLowerCase());
        })
    },
    "click .tr-request .edit"(e){
        $(".tr-request .inputcontrols").hide();
        $(".tr-request .tr").show();
        $(e.target).siblings(".tr").hide();
        $(e.target).siblings(".inputcontrols").css("display","inline-block");
    },
    "click .tr-request .submit"(e){
        var f = $(e.target).siblings("input").val();
        if (!f)return;
        this.tr = f;
        this.searchtr = replaceD(f).toLowerCase();
        Meteor.call("translate",this,function(res,err){
            console.log(res,err)
        });
        $(".tr-request .inputcontrols").hide();
        $(".tr-request .tr").show();
    },
    "click .tr-term .edit"(e){
        $(e.target).siblings(".react").css("display","inline");
        $(e.target).siblings(".react2").hide();
        $(".tr-request .tr").show();
        $(e.target).siblings(".tr").hide();
        console.log($(e.target).siblings(".inputcontrols").css("display","inline-block"));
    },
    "click .tr-term .save"(e){
        var f = $(e.target).siblings(".edit-inputs").find(".trtext").val();
        var x = $(e.target).siblings(".edit-inputs").find(".trtr").val();
        if (!f || !x)return;
        if (f==this.text && x==this.tr)return;
        this.text = f;
        this.tr = x;
        this.searchtext = replaceD(f).toLowerCase();
        this.searchtr = replaceD(f).toLowerCase();
        Meteor.call("saveTranslation",this);

        $(e.target).siblings(".react2").css("display","inline");
        $(e.target).siblings(".react").hide();
        $(e.target).hide();
    },
    "click .tr-term .delete"(e){
        Meteor.call("deleteTerm",this);
    },
})