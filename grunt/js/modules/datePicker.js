if (typeof toolkit==='undefined') toolkit={};
toolkit.datePicker = (function () {

    var monthNames=["", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ],
        currentDate = {
            day: new Date().getDate(),
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear()
        };

    function daysInMonth(month, year) {
        return [null, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
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

    function normaliseDate(date){
        return date.length < 2 ? "0" + date : date;
    }

    function DatePicker($container) {
        this.calendarDate = $.extend(currentDate);

        this.$container = $container;
        this.addCalendarHTML();

        this.$el = {
            calendar: $container.find('.calendar'),
            day:  $container.find('.day'),
            month:  $container.find('.month'),
            year:  $container.find('.year'),
            prev:  $container.find('.prev'),
            next:  $container.find('.next'),
            monthyear:  $container.find('*[data-date]')
        };

        this.renderCalendar();
        this.bindEvents();

    }

    DatePicker.prototype = {

        bindEvents: function() {
            var datePicker = this;

            datePicker.$container
                .on('click','.daycontainer .date', datePicker.selectDate.bind(datePicker))
                .on('click', '.prev', datePicker.displayPreviousMonth.bind(datePicker))
                .on('click', '.next', datePicker.displayNextMonth.bind(datePicker))
                .on('focus', 'input', function(){ datePicker.$el.calendar.show();})
                .on('keyup blur', 'input', datePicker.updateCalendarView.bind(datePicker))
                .on('keydown', 'input', function(e) {
                    if(e.shiftKey && e.keyCode == 9) {
                        datePicker.$el.calendar.hide();
                    }
                });

            $(document)
                .on('keydown', function(e) {
                    if (e.keyCode == 27) {
                        datePicker.$el.calendar.hide();
                    }
                })
                .on('click', function(e) {
                    if (e.target.class != 'date-picker' && !datePicker.$container.find(e.target).length) {
                        datePicker.$el.calendar.hide();
                    }
                });
        },

        selectDate: function(e) {
            var datePicker = this;

            datePicker.$container.find('.selected').removeClass('selected');
            $(e.currentTarget).addClass('selected');

            datePicker.calendarDate.day = parseInt(e.currentTarget.innerText,10);

            datePicker.$el.day.val(normaliseDate(datePicker.calendarDate.day));
            datePicker.$el.month.val(normaliseDate(datePicker.calendarDate.month));
            datePicker.$el.year.val(normaliseDate(datePicker.calendarDate.year));

            datePicker.$el.calendar.hide();
        },

        displayPreviousMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 1) {
                datePicker.calendarDate.month = 12;
                datePicker.calendarDate.year--;
            } else {
                datePicker.calendarDate.month--;
            }

            datePicker.renderCalendar();
        },

        displayNextMonth: function() {
            var datePicker = this;
            if (datePicker.calendarDate.month === 12) {
                datePicker.calendarDate.month = 1;
                datePicker.calendarDate.year++;
            } else {
                datePicker.calendarDate.month++;
            }

            datePicker.renderCalendar();
        },

        updateCalendarView: function() {
            var datePicker = this;

            datePicker.calendarDate.day = parseInt(datePicker.$el.day.val(), 10) || currentDate.day;
            datePicker.calendarDate.month = parseInt(datePicker.$el.month.val(), 10) || currentDate.month;
            datePicker.calendarDate.year = parseInt(datePicker.$el.year.val(), 10) || currentDate.year;

            datePicker.renderCalendar();

        },
        renderCalendar: function() {
            var datePicker = this;
            datePicker.$el.monthyear.html(monthNames[datePicker.calendarDate.month] + " " + datePicker.calendarDate.year);
            datePicker.fillDays(daysInMonth(datePicker.calendarDate.month, datePicker.calendarDate.year), firstDay(datePicker.calendarDate.month, datePicker.calendarDate.year));
        },

        addCalendarHTML: function() {
            this.$container.append('<div class="calendar" aria-hidden="true">' +
                '<div class="header"><span class="prev"><i class="skycon-arrow-left"></i></span><span data-date></span><span class="next"><i class="skycon-arrow-right"></i></span></div>' +
                '<div class="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>' +
                '<div class="daycontainer"></div></div>');
        },

        fillDays: function(noOfDaysInMonth, firstDay) {
            var i= 1,
                date = 1,
                datePicker = this,
                calendarDate = datePicker.calendarDate,
                daysText = "",
                className = "",
                isToday = false,
                isInputDate = false,
                isPastDate = false;

            for (i; i < firstDay; i++) {
                daysText += "<span></span>";
            }

            for (date; date <= noOfDaysInMonth; date++) {
                isInputDate = (date ==  datePicker.$el.day.val() && calendarDate.month ==  datePicker.$el.month.val() && calendarDate.year ==  datePicker.$el.year.val());
                isPastDate = (date < currentDate.day && calendarDate.month <= currentDate.month && calendarDate.year <= currentDate.year) ||
                            (calendarDate.month < currentDate.month && calendarDate.year <= currentDate.year) ||
                            (calendarDate.year < currentDate.year);
                isToday = (date == currentDate.day && calendarDate.month == currentDate.month && calendarDate.year == currentDate.year);

                className = (isInputDate) ? ' selected ' : '';
                if (isPastDate) className += ' past ';
                if (isToday) className += ' today ';

                daysText += "<span class='date " + className  + "' >" + date + "</span>";
            }
            datePicker.$container.find('.daycontainer').html(daysText);
        }

    };

    $.fn.datePicker = function() {
        return this.each(function() {
            var datePicker = new DatePicker($(this));
        });
    };

    $('.date-picker').datePicker();
}());

if (typeof window.define === "function" && window.define.amd) {
    define('modules/datePicker', [], function() {
        return toolkit.datePicker;
    });
}