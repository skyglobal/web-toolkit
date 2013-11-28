if (typeof toolkit==='undefined') toolkit={};
toolkit.datepicker = (function () {

    var monthNames=[ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];

    function DatePicker($datepicker) {
        this.$el = {
            datepicker: $datepicker.find('input'),
            calendar: $datepicker.find('.calendar'),
            date:  $datepicker.find('.datepicker-input'),
            day:  $datepicker.find('.day'),
            month:  $datepicker.find('.month'),
            year:  $datepicker.find('.year'),
            monthleft:  $datepicker.find('.monthleft'),
            monthright:  $datepicker.find('.monthright'),
            datespan: $datepicker.find('.daycontainer .date'),
            monthyear:  $datepicker.find('.monthyear'),
            monthyearval:  $datepicker.find('.monthyearval')
        };

        var date = new Date();
        this.date = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getYear()
        };

        this.inDate = this.date;
        this.toDate = this.date;
        this.addCalenderHTML();
        this.renderCalendar();
        this.bindEvents();

    }

    DatePicker.prototype = {

        onKeyUp:function(strPart, max) {
            var datepicker = this;
            var $el = datepicker.$el[strPart];
            if ($el.val() > max) {
                $el.val(max);
            }
            if ($el.val() === '00' || $el.val() === '0') {
                $el.val('01');
            }

            if ($el.val().length === 2) {
                datepicker.date[strPart] = parseInt($el.val(), 10);
                datepicker.inDate[strPart] = parseInt(datepicker.date[strPart], 10);
                datepicker.renderCalendar();
            }
        },

        onBlur: function(strPart) {
            var datepicker = this;
            var $el = datepicker.$el[strPart];
            if ($el.val().length < 2 && $el.val().length !== 0) {
                datepicker.date[strPart] = parseInt($el.val(), 10);
                datepicker.inDate[strPart] = parseInt(datepicker.date[strPart], 10);
                if ($el.val() !== "00" && $el.val() !== "0") {
                    $el.val("0" + $el.val());
                } else {
                    $el.val("01");
                }
                datepicker.renderCalendar();
            }
        },

        bindEvents: function() {
            var datepicker = this;
            datepicker.$el.datepicker.keyup(function () {
                if (this.value != this.value.replace(/\D/g, '')) {
                    this.value = this.value.replace(/\D/g, '');
                }
            });

            datepicker.$el.datepicker.on('focus', function(){
                datepicker.$el.calendar.show();
            });
            datepicker.$el.day.on('keyup', function() {
                datepicker.onKeyUp('day', daysInMonth(datepicker.date.month, datepicker.date.year));
            }).on('blur', function(e) {
                    datepicker.onBlur('day');
            });


            datepicker.$el.month.on('keyup', function() {
                datepicker.onKeyUp('month', 12);
            }).on('blur', function() {
                    datepicker.onBlur('month');
            });

            datepicker.$el.year.on('keyup', function() {
                if (datepicker.$el.year.val().length === 4) {
                    datepicker.date.year = parseInt(datepicker.$el.year.val(), 10);
                    datepicker.inDate.year = parseInt(datepicker.date.year, 10);
                    datepicker.renderCalendar();
                }
            });

            datepicker.$el.datepicker.on('keydown', '.day, .month, .year', function(e) {
                if(e.shiftKey && e.keyCode == 9) {
                    datepicker.$el.calendar.hide();
                }
            });

            $(document).on('keydown', function(e) {
                if (e.keyCode == 27) {
                    datepicker.$el.calendar.hide();
                }
            });

            datepicker.$el.monthleft.on('click', datepicker.monthLeft.bind(datepicker));
            datepicker.$el.monthright.on('click', datepicker.monthRight.bind(datepicker));
        },

        monthLeft: function() {
            var datepicker = this;
            if (datepicker.date.month === 0) {
                datepicker.date.month = 11;
                datepicker.date.year--;
            } else {
                datepicker.date.month--;
            }

            datepicker.renderCalendar();
        },

        monthRight: function() {
            var datepicker = this;
            if (datepicker.date.month === 11) {
                datepicker.date.month = 0;
                datepicker.date.year++;
            } else {
                datepicker.date.month++;
            }

            datepicker.renderCalendar();
        },

        renderCalendar: function() {
            var datepicker = this;
            datepicker.$el.monthyearval.html(monthNames[datepicker.date.month] + " " + datepicker.date.year);
            datepicker.fillDays(daysInMonth(datepicker.date.month, datepicker.date.year), firstDay(datepicker.date.month, datepicker.date.year));
//
//            datepicker..on('click', function() {
//                console.log("picked date");
//                day = this.innerHTML;
//
//                $('.daycontainer').find('.selected').removeClass('selected');
//                $(this).addClass('selected');
//
//                $el.day.val(day < 10 ? "0" + day : day);
//                inDay = day;
//                $el.month.val((month + 1) < 10 ? "0" + (month + 1) : (month + 1));
//                inMonth = month;
//                $el.year.val(year);
//                inYear = year;
//
//                $('.calendar').hide();
//            });
//
//            $(document).click(function(e) {
//
//                if (e.target.class != 'datepicker' && !$('.datepicker').find(e.target).length) {
//                    $(".calendar").hide();
//                }
//
//            });
        },
        addCalenderHTML: function() {
            this.$el.datepicker.find('.datepicker-container').append('<div class="calendar" aria-hidden="true">' +
                '<div class="monthyear"><span class="monthleft"><i class="skycon-arrow-left"></i></span><span class="monthyearval"></span><span class="monthright"><i class="skycon-arrow-right"></i></span></div>' +
                '<div class="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>' +
                '<div class="daycontainer"></div></div>');
        },

        fillDays: function(noOfDaysInMonth, firstDay) {
            var datepicker = this;
            var daysText = "";

            for (var i = 1; i < firstDay; i++) {
                daysText += "<span></span>";
            }

            for (var j = 1; j <= noOfDaysInMonth; j++) {
                if (j == datepicker.inDate.day && datepicker.date.month == datepicker.inDate.month && datepicker.date.year == datepicker.inDate.year) {
                    if ((datepicker.date.month < datepicker.toDate.month && datepicker.date.year <= datepicker.date.toYear) || (j < datepicker.toDate.day && datepicker.date.month <= datepicker.toDate.month && datepicker.date.year <= datepicker.date.toYear)) {
                        daysText += "<span class='past selected day' data-day='"+ j +"'>" + j + "</span>";
                    } else {
                        daysText += "<span class='selected day' data-day='"+ j +"'>" + j + "</span>";
                    }
                } else if (datepicker.date.month < datepicker.toDate.month && datepicker.date.year <= datepicker.date.toYear) { //in the past
                    daysText += "<span class='past day' data-day='"+ j +"'>" + j + "</span>";
                } else if (j < datepicker.toDate.day && datepicker.date.month <= datepicker.toDate.month && datepicker.date.year <= datepicker.date.toYear) {
                    daysText += "<span class='past day' data-day='"+ j +"'>" + j + "</span>";
                } else {
                    daysText += "<span class='day' data-day='"+ j +"'>" + j + "</span>";
                }
            }
            datepicker.$el.datepicker.find('.daycontainer').html(daysText);
        }




    };







    function daysInMonth(month, year) {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    function firstDay(month, year) {
        var day = new Date(year, month, 1).getDay();
        if (day === 0) {
            return 7;
        } else {
            return day;
        }
    }

    function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    $.fn.datePicker = function() {
        return this.each(function() {
            var datePicker = new DatePicker($(this));
        });
    };

    $('.datepicker').datePicker();
}());

if (typeof window.define === "function" && window.define.amd) {
    define('modules/datepicker', [], function() {
        return toolkit.datepicker;
    });
}
