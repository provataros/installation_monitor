import {XLSX} from "meteor/huaming:js-xlsx"
import {filesaver} from "meteor/pfafman:filesaver"
import {labels} from "/client/static/labels.js"

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

var fields = [
  "register_date",
  "install_date",
  "schedule_date",
  "hw_id",
  "device_id",
  "agent_id",
  "service_id",
  "feeset_id",
  "lsam_id",
  "sam_tracking",
  "status_of_installation",
  "label",
  "agency",
  "sub_agency",
  "device_type",
  "firmware_type",
  "supervisor",
  "hp_number",
  "station_id",
  "station_name",
  "line",
  "location",
  "ip",
  "subnet",
  "gateway",
  "ntp",
  "dns1",
  "dns2",
  "host1",
  "host2",
  "host3",
  "swd",
  "operator_name",
  "operator_id",
  "operator_card",
  "hw_error",
  "hw_status",
  "hw_comments",
  "sw_error",
  "sw_version",
  "sw_status",
  "sw_comments",
  "urgent",
  "createdAt",
  "updatedAt",
]

function createArrays(data){
  var total = [];
  var cols = ["No"]
  $.each(fields,function(key,val){
    if (val){
      cols.push(labels[val]?labels[val].name:val);
    }
  })
  total.push(cols);
  total.push([])
  for (var i=0;i<data.length;i++){
    var arr = [i+1];
    $.each(fields,function(key,val){
      arr.push(labels[val]?(labels[val].type == "date" && data[i][val] != ""?moment(data[i][val],"YYYYMMDD").format("DD/MM/YYYY") :data[i][val]):data[i][val]);
    })
    total.push(arr);
  }
  return total;
}
function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}
export const Workbook = function() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

export const saveXLSX = function(data){
  var wb = new Workbook();
  var arrays = createArrays(data);
  var ws = sheet_from_array_of_arrays(arrays);

  wb.SheetNames.push("Search Results");
  wb.Sheets["Search Results"] = ws;

  ws.A1.s = "Bold"

  var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

  saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "SearchResults_"+moment().format("YYYYMMDD")+".xlsx")
}


export const readXLSX = function(){
  
}