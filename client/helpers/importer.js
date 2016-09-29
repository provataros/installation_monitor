import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from "meteor/mongo"
import { Session } from 'meteor/session'
import { labels } from "/client/static/labels.js";
import { XLSX } from "meteor/huaming:js-xlsx"

import {displayNotification} from "/client/lib/lib.js";



Template.importer.events({
    "click #add-columns" : function(){
        console.log(this);
        var f = Session.get("import-columns");
        f.push({key : "hw_id",value:""});
        Session.set("import-columns",f);
    },
    "click #excel-search" : function(){
        displayExcel();
    }
})
//[{"key":"hw_id","value":"F","date":false},{"key":"device_id","value":"H","date":false},{"key":"agent_id","value":"I","date":false},{"key":"service_id","value":"K","date":false},{"key":"feeset_id","value":"L","date":false},{"key":"lsam_id","value":"P","date":false},{"key":"label","value":"T","date":false},{"key":"agency","value":"U","date":false},{"key":"sub_agency","value":"V","date":false},{"key":"device_type","value":"W","date":false},{"key":"station_id","value":"AA","date":false},{"key":"station_name","value":"AB","date":false},{"key":"register_date","value":"B","date":"true"}]
Template.column_selector.events({
    "change select" : function(e){
        var f = Session.get("import-columns");
        var index = e.target.id.split("__")[1];
        f[index].key = e.target.selectedOptions[0].value;
        Session.set("import-columns",f);
    },
    "change input[type='text']" : function(e){
        var f = Session.get("import-columns");
        var index = e.target.id.split("__")[1];
        console.log("asdas");
        f[index].value = $(e.target).val();
        Session.set("import-columns",f);
    },
    "change input[type='checkbox']" : function(e){
        var f = Session.get("import-columns");
        var index = e.target.id.split("__")[1];
        f[index].date = $(e.target).getVal();
        Session.set("import-columns",f);
    },
    "click button" : function(e){
        var f = Session.get("import-columns");
        var index = $(e.target).siblings("input[type='checkbox']").attr("id").split("__")[1];
        console.log(index);
        f.splice(index,1);
        Session.set("import-columns",f);
    }
})
Template.importer.helpers({
    init : function(){
        Session.set("import-wb",null);
        Session.set("import-data",null);
    },
    workbook : function(){
        return Session.get("import-wb");
    },
})
Template.importer.events({
    "dragover #importer" : function(event){
        event.preventDefault();  
        event.stopPropagation();
    },

    "dragleave #importer": function(event) {
            event.preventDefault();  
            event.stopPropagation();
    },

    "drop #importer" :  function(event) {
            event.preventDefault();  
            event.stopPropagation();
            handleDrop(event.originalEvent);
    }
})

Template.column_selector.helpers({
    fields : function(){
        return labels;
    },
    isKey : function(value){
        return this.key==value?"selected":"";
    },
    isChecked : function(value){
        return this.date==true?"checked":"";
    },
    columns : function(){
        return Session.get("import-columns");
    }
})


Template.registerHelper("objectToPairs",function(object){
  return _.map(object, function(value, key) {
    return {
      key: key,
      value: value
    };
  });
});


function displayExcel(){
    var wb = Session.get("import-wb");
    var cols = Session.get("import-columns");
    var _from = parseInt($("#import-from").val());
    var _to = parseInt($("#import-to").val());
    var ws = wb.Sheets[$("#import-ws").val()]


    localStorage.setItem("importSettings",JSON.stringify(cols));
    if (!ws || isNaN(_from) || isNaN(_to)){
        displayNotification("Please check your inputs","heads-up");
        return;
    }
    var arr = [];
    for (var j=_from;j<=_to;j++){
        var obj = {};
        for (var i=0;i<cols.length;i++){       
            var c =(ws[cols[i].value+j]);
            if (c){
                var val = c.v;
                if (cols[i].date || cols[i].date=="true"){
                    val = moment(xl2jsdt(val)).format("YYYYMMDD");
                }
                obj[cols[i].key] = ""+val;
            }
            else{
                obj[cols[i].key] = "";
            }
        }
        arr.push(obj);
    }
    console.log(arr);
    Session.set("import-data",arr);
}



Template.import_data.helpers({
    data : function(){
        return Session.get("import-data");
    },
    columns : function(){
        return Session.get("import-columns");
    }
})

Template.import_data.events({
    "click button" : function(){
        var obj = this;


        Session.modal.yes = function(){
            Meteor.call("backupDatabase",function(e,r){
                if (r=="done"){
                    Meteor.call("importData",obj,function(){
                        displayNotification("Updated","success");
                    });
                }
            })
          }
        Session.set("modal",{message : 'Are you sure you want to save?',focus : "yes"})

        
    }
})





function handleDrop(e) {
    var files = e.dataTransfer.files;
    var i,f;
    
    console.log($("#importer")[0])
    var settings = localStorage.getItem("importSettings");
    if (settings)Session.set("import-columns",JSON.parse(settings));
    else{
        Session.set("import-columns",[{key :"hw_id",value:"A"}]);
    } 
    for (i = 0, f = files[i]; i != files.length; ++i) {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
            var data = e.target.result;
        
            /* if binary string, read with type 'binary' */
            var wb = XLSX.read(data, {type: 'binary'});
            //Meteor.wb = wb;
            //wb.Sheets["09-16"];
            //Meteor.ws=wb.Sheets["09-16"];
            Session.set("import-wb",wb);
            /*var ws = wb.Sheets["09-16"];

            var length = 0;
            var f;
            while ((f= ws[XLSX.utils.encode_cell({r:3,c:(6+length)})]) != undefined){
                length++;
            }

            var master = {data : []};
            master.headers = getRow(ws,3,6,length,xl2jsdt);

            var depot_row = 9;
            var cell;
            master.sum = {
                cabling_start : getRowEdit(ws,4,4,length),
                cabling_end : getRowEdit(ws,4+1,4,length),
                equipment_installation_start : getRowEdit(ws,4+2,4,length),
                equipment_installation_end : getRowEdit(ws,4+3,4,length),
                ic_confirm : getRowEdit(ws,4+4,4,length),

            }
            while (  (cell = ws["C"+(depot_row+1)]) != undefined) {
                master.data.push(
                    {
                        operator : cell.v,
                        installer : ws["D"+(depot_row+1)],
                        cabling_start : getRowEdit(ws,depot_row,4,length),
                        cabling_end : getRowEdit(ws,depot_row+1,4,length),
                        equipment_installation_start : getRowEdit(ws,depot_row+2,4,length),
                        equipment_installation_end : getRowEdit(ws,depot_row+3,4,length),
                        ic_confirm : getRowEdit(ws,depot_row+4,4,length),

                    }
                )


          depot_row += 5;
      }
      Session.set("xlsx",master);*/
    };
    reader.readAsBinaryString(f);
  }
}










Template.importer.rendered = function(){
        
    }



function xl2jsdt(serial) {
   var utc_days  = Math.floor(serial - 25569);
   var utc_value = utc_days * 86400;                                        
   var date_info = new Date(utc_value * 1000);

   var fractional_day = serial - Math.floor(serial) + 0.0000001;

   var total_seconds = Math.floor(86400 * fractional_day);

   var seconds = total_seconds % 60;

   total_seconds -= seconds;

   var hours = Math.floor(total_seconds / (60 * 60));
   var minutes = Math.floor(total_seconds / 60) % 60;

   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}