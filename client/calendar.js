$.fn.extend({
  datepicker : function(options,callback){
    if (!options)options = {};
    this.each(function(){
      var that = this;
      var val = options.value;
      this.date = val?moment(val,"YYYYMMDD"):moment();
      this.today = moment();
      this.selected = val?val:"";
      var calendar = $("<div class ='calendar'></div>");

      val?$(this).val(this.date.format(options.format?options.format:"YYYYMMDD")):null;

      console.log(this);
      $(this).on("click",function(e){
        e.preventDefault();
        e.stopPropagation();
        that.createCalendar();
      })

      this.removeCalendar = function(){
        calendar.remove();
        calendar.empty();
      }

      function unfocus(e){
        $(document).unbind("click",unfocus);
        e.preventDefault();
        e.stopPropagation();
        that.removeCalendar();
      }
      this.createCalendar = function(){
        that.removeCalendar();
        var table = $("<table></table>");
        calendar.append($("<div id = 'controls' ><button id='prev2'><<</button><button id='prev'><</button>"+this.date.format("MMMM YYYY")+"<button id='next'>></button><button id='next2'>>></button></div>"))
        table.append($("<tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr>"));
        var date = that.date.clone().subtract(1,"months").endOf('month').startOf('week');
        for (var i=0;i<6;i++){
          var row = $("<tr></tr>")
          for (var j=0;j<7;j++){
            row.append($("<td id='date_"+date.format("YYYYMMDD")+"'>"+(date.date()) +"</td>").data("date",date.format("YYYYMMDD")));
            date.add(1,"days");
          }
          table.append(row);
        }

        calendar.append(table);

        calendar.find("#prev").on("click",function(e){
          that.date.subtract(1,"months");
          that.createCalendar();
        });
        calendar.find("#next").on("click",function(e){
          that.date.add(1,"months");
          that.createCalendar();
        })
        calendar.find("#prev2").on("click",function(e){
          that.date.subtract(1,"years");
          that.createCalendar();
        });
        calendar.find("#next2").on("click",function(e){
          that.date.add(1,"years");
          that.createCalendar();
        })
        calendar.find("td").on("click",function(e){
          var date = $(this).data("date");
          if (date == that.selected)return;
          calendar.find("#date_"+that.selected).removeClass("selected");
          that.selected = date;
          calendar.find("#date_"+that.selected).addClass("selected");
          var val = moment(that.selected,"YYYYMMDD").format(options.format?options.format:"dddd DD MMMM YYYY");
          $(that).val(val);
          if (callback)callback(date);
        });
        calendar.find("#date_"+that.today.format("YYYYMMDD")).addClass("today");
        calendar.find("#date_"+that.selected).addClass("selected");
        calendar.css({top : $(that).position().top + $(that).outerHeight(true) + 10, left : $(that).position().left})

        calendar.on("click",function(e,t){
        });

        $(document).unbind("click",unfocus)
        $(document).on("click",unfocus);
        $("body").append(calendar);
      };
      //this.createCalendar();
    })
  }
})
