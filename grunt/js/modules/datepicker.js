if (typeof toolkit==='undefined') toolkit={};
toolkit.datepicker = (function () {

    var $el = {
       datepicker: $('.datepicker input'),
       day: $('#day'),
       month: $('#month'),
       year: $('#year'),
       monthleft: $('.monthleft'),
       monthright: $('.monthright'),
       dayspan: $('.daycontainer .day'),
       monthyear: $('.monthyear')
    };

    var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

    var day = getToday();
    var month = getMonth();
    var year = getYear();

    var inDay = day;
    var inMonth = month;
    var inYear = year;

    var toDay = day;
    var toMonth = month;
    var toYear = year;

    var calLeft, calTop;

    function bindEvents() {

        $el.datepicker.keyup(function () {
            if (this.value != this.value.replace(/\D/g, '')) {
               this.value = this.value.replace(/\D/g, '');
            }
        });

        $el.datepicker.on('focus', function(){
            showCalendar($(this), "show");
        });


        $el.day.on('keyup', function() {
            if ($el.day.val() > daysInMonth(month, year)) {
                $el.day.val(daysInMonth(month, year));
            }
            if ($el.day.val() === '00' || $el.day.val() === '0') {
                $el.day.val('01');
            }

            if ($el.day.val().length === 2) {
                day = parseInt($el.day.val(), 10);
                inDay = parseInt(day, 10);
                renderCalendar();
            }

        }).on('blur', function(event) {
            if ($el.day.val().length < 2 && $el.day.val().length !== 0) {
                day = parseInt($el.day.val(), 10);
                inDay = parseInt(day, 10);
                if ($el.day.val() !== "00" && $el.day.val() !== "0") {
                    $el.day.val("0" + $el.day.val());
                } else {
                    $el.day.val("01");
                }
                renderCalendar();
            }

            if(event.shiftKey && event.keyCode == 9) {
                $('.calendar').hide();
            }
        });

        $el.month.on('keyup', function() {
            if ($el.month.val() > 12) {
                $el.month.val('12');
            }
            if ($el.month.val() === '00' || $el.month.val() === '0') {
                $el.month.val('01');
            }

            if ($el.month.val().length === 2) {

                month = parseInt($el.month.val(), 10) - 1;
                inMonth = parseInt(month, 10);
                renderCalendar();
            }

        }).on('blur', function() {
            if ($el.month.val().length < 2 && $el.month.val().length !== 0) {
                month = parseInt($el.month.val(), 10) - 1;
                inMonth = parseInt(month, 10);
                if ($el.month.val() !== "00" && $el.month.val() !== "0") {
                    $el.month.val("0" + $el.month.val());
                } else {
                    $el.month.val("01");
                }
                renderCalendar();
            }
        });

        $el.year.on('keyup', function() {
            if ($el.year.val().length === 4) {
                year = parseInt($el.year.val(), 10);
                inYear = parseInt(year, 10);
                renderCalendar();
            }
        }).on('blur', function(e) {
            if (e.which === 0) {
                $('.calendar').hide();
            }
        });

        $('.monthleft').on('click', monthLeft);
        $('.monthright').on('click', monthRight);

        $(document).on('keyup', function(e) {
            if (e.keyCode == 27) {
                $('.calendar').hide();
            }
        });

        // $('.calendar').bind('lostFocus', function() {
        //     $('.calendar').hide();
        // });
        // $('.datepicker input').blur(function() {
        //       $('.calendar').trigger('lostFocus');
        // });
    }

    function renderCalendar() {
        $('.monthyearval').html(monthNames[month] + " " + year);
        fillDays(daysInMonth(month, year), firstDay(month, year));

        $('.daycontainer .day').on('click', function() {
            console.log("picked date");
            day = this.innerHTML;

            $('.daycontainer').find('.selected').removeClass('selected');
            $(this).addClass('selected');

            $el.day.val(day < 10 ? "0" + day : day);
            inDay = day;
            $el.month.val((month + 1) < 10 ? "0" + (month + 1) : (month + 1));
            inMonth = month;
            $el.year.val(year);
            inYear = year;

            $('.calendar').hide();
            $el.day.css('border-radius', '5px');
            $el.month.css('border-radius', '5px');
            $el.year.css('border-radius', '5px');
        });

        $(document).click(function(e) {

            if (e.target.class != 'datepicker' && !$('.datepicker').find(e.target).length) {
                    $(".calendar").hide();
            }

        });

        console.log("rendering calendar");
        console.log("values: day: " + day + ". month: " + (month) + ". year: " + year);
        console.log("calender vals: days in month: " + daysInMonth(month + 1, year) + ". first day: " + firstDay(month, year));
        console.log("Input day: " + inDay + " input month: " + inMonth + " input year: " + inYear);
    }

    //TODO: add year as well
    function fillDays(noOfDaysInMonth, firstDay) {
        var daysText = "";

        for (var i = 1; i < firstDay; i++) {
            daysText += "<span></span>";
        }

        for (var j = 1; j <= noOfDaysInMonth; j++) {
            if (j == inDay && month == inMonth && year == inYear) {
                if ((month < toMonth && year <= toYear) || (j < toDay && month <= toMonth && year <= toYear)) {
                    daysText += "<span class='past selected day'>" + j + "</span>";
                } else {
                    daysText += "<span class='selected day'>" + j + "</span>";
                }
            } else if (month < toMonth && year <= toYear) { //in the past
                daysText += "<span class='past day'>" + j + "</span>";
            } else if (j < toDay && month <= toMonth && year <= toYear) {
                daysText += "<span class='past day'>" + j + "</span>";
            } else {
                daysText += "<span class='day'>" + j + "</span>";
            }
        }

        $('.daycontainer').html(daysText);
    }

    function showCalendar(e, display) {
        if(display == "show") {
            e.siblings('div.calendar').show();
        } else {
            e.siblings('div.calendar').hide();
        }
        // height = e.height();
        // calLeft = $el.day.position().left;
        // calTop = $el.day.position().top + height;

        // $('.calendar').css('left', calLeft);
        // $('.calendar').css('top', calTop);
        // $('.calendar').show();

        // $el.day.css('border-radius', '5px 5px 0 0');
        // $el.month.css('border-radius', '5px 5px 0 0');
        // $el.year.css('border-radius', '5px 5px 0 0');
    }

    function monthLeft() {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }

        renderCalendar();
    }

    function monthRight() {
        if (month === 11) {
            month = 0;
            year++;
        } else {
            month++;
        }

        renderCalendar();
    }

    function datePicked() {
        alert(this.val);
        alert(month + " " + year);
    }


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
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    }

    function getToday() {
        return new Date().getDate();
    }

    function getMonth() {
        return new Date().getMonth();
    }

    function getYear() {
        return new Date().getFullYear();
    }

    function addCalenderHTML() {
        $('.datepicker .datepicker-container').append('<div class="calendar">' +
            '<div class="monthyear"><span class="monthleft">&larr;</span><span class="monthyearval"></span><span class="monthright">&rarr;</span></div>' +
            '<div class="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>' +
            '<div class="daycontainer"></div></div>');
    }


    function init() {
        addCalenderHTML();
        renderCalendar();
        bindEvents();
    }

    return {
        init: init
    };
}());

if (typeof window.define === "function" && window.define.amd) {
    define('modules/datepicker', [], function() {
        return toolkit.datepicker;
    });
}
