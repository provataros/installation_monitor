export const labels = {
  no : {
    name : "No",
    group : "misc",
  },
  hw_comments : {
    name : "Hardware Comments",
    group : "comments",
  },
  sw_comments : {
    name : "Software Comments",
    group : "comments",
  },
  agency_comments : {
    name : "Agency Comments",
    group : "comments",
  },
  misc_comments : {
    name : "Miscelaneous Comments",
    group : "comments",
  },
  hw_id : {
		name : "Hardware ID",
    group : "hardware",
	},
  device_id : {
		name : "Device ID",
    group : "hardware",
	},
  agent_id : {
		name : "Agent ID",
    group : "agency",
	},
  service_id : {
		name : "Service Account ID",
    group : "software",
	},
  feeset_id : {
		name : "Feeset ID",
    group : "software",
	},
  lsam_id : {
		name : "LSAM ID",
    group : "hardware",
	},
  hw_status : {
		name : "Hardware Installation Status",
    type : "dropdown",
    group : "hardware",
    options : [
      "",
      "Not Done",
      "Done",
    ]
	},
  sw_status : {
		name : "Software Installation Status",
    type : "dropdown",
    group : "software",
    options : [
      "",
      "Operating System Update",
      "Firmware Update",
      "Testing",
      "Done",
    ]
	},
  label : {
		name : "Hardware Label",
    group : "hardware",
	},
  agency : {
		name : "Agency",
    group : "agency",
    type : "dropdown",
    options : [
      "",
      "OASA",
      "STASY",
      "OSY",
      "TRAINOSE",
    ]
	},
  sub_agency : {
		name : "Sub Agency",
    group : "agency",
    type : "dropdown",
    options : [
      "",
      "Tram",
      "Metro",
      "Suburban",
      "Bus",
    ]
	},
  device_type : {
		name : "Device Type",
    group : "hardware",
    type : "dropdown",
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
	},
  firmware_type : {
		name : "Firmware Type",
    group : "software",
	},
  supervisor : {
		name : "Supervisor",
    group : "agency",
	},
  hp_number : {
		name : "HP Number",
    group : "agency",
	},
  station_id : {
		name : "Station ID",
    group : "location",
    type : "dropdown",
    options : []
	},
  station_name : {
		name : "Station Name",
    group : "location",
    type : "dropdown",
    options : []
	},
  line : {
		name : "Line",
    group : "location",
	},
  location : {
		name : "Installation Location",
    group : "location",
	},
  ip : {
		name : "Device IP",
    group : "network",
	},
  subnet : {
		name : "Subnet",
    group : "network",
	},
  ntp : {
		name : "NTP Server",
    group : "network",
	},
  gateway : {
		name : "Gateway",
    group : "network",
	},
  dns1 : {
		name : "DNS 1",
    group : "network",
	},
  dns2 : {
		name : "DNS 2",
    group : "network",
	},
  host1 : {
		name : "Host 1 (OASA)",
    group : "network",
	},
  host2 : {
		name : "Host 2",
    group : "network",
	},
  host3 : {
		name : "Host 3",
    group : "network",
	},
  swd : {
		name : "Software Delivery Server (swd)",
    group : "network",
	},
  operator_name : {
		name : "Operator Name",
    group : "",////////////////////////
	},
  operator_id : {
		name : "Operator ID",
    group : "",////////////////////////
	},
  operator_card : {
		name : "Operator Card",
    group : "",////////////////////////
	},
  status_of_installation : {
		name : "Installation Status",
    group : "comments",////////////////////////
	},
  sam_tracking : {
		name : "SAM Location",
    group : "comments",////////////////////////
    type : "dropdown",
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
	},
  sw_version : {
		name : "Software Version",
    group : "software",////////////////////////
	},
  install_date : {
		name : "Installation Date",
    type : "date",
    group : "location",////////////////////////
	},
  schedule_date : {
		name : "Schedule Date",
    type : "date",
    group : "location",////////////////////////
	},
  register_date : {
		name : "Register Date",
    type : "date",
    group : "location",////////////////////////
	},
  urgent : {
		name : "Urgent",
    type : "checkbox",
    group : "misc",////////////////////////
	},
  hw_error : {
		name : "Hardware Error",
    type : "checkbox",
    group : "misc",////////////////////////
	},
  sw_error : {
		name : "Software Error",
    type : "checkbox",
    group : "misc",////////////////////////
	},
}
