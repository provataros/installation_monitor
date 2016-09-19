import {Mongo} from "meteor/mongo";

export const initlabels = function(){
    db={};
    db.labels = Mongo._labels;
    db.labels.insert({
        id : "hw_status",
        options : ["",
            "Not Done",
            "Done"]
        }
    );

    db.labels.insert({
        id : "sw_status",
        options : [
            "",
            "Operating System Update",
            "Firmware Update",
            "Testing",
            "Done",
        ]
        }
    );

    db.labels.insert({
        id : "agency",
        options : [
            "",
            "OASA",
            "STASY",
            "OSY",
            "TRAINOSE",
        ]
        });

    db.labels.insert({
        id : "sub_agency",
        options : [
            "",
            "Tram",
            "Metro",
            "Suburban",
            "Bus",
        ]
        });


    db.labels.insert({
        id : "device_type",
        options : [
            "",
            "ACIM",
            "TIT",
            "CIT",
            "PCRS",
            "PCRS for TIT",
            "PCRS for CIT",
            "PSCCS",
            "Gate",
            "OVMC",
        ]
        });

    db.labels.insert({
        id : "sam_tracking",
        options : [
            "",
            "Office",
            "Installed inside ACIM",
            "Installed inside TIT",
            "Installed inside PCRS",
            "Installed inside Card Printer",
            "OS Update",
            "Installation"
        ]
    });

    db.labels.insert({
        id : "sw_version",
        options : [
            "",
            "1.3.10.30773",
            "1.3.2.14572",
        ]
    })
}