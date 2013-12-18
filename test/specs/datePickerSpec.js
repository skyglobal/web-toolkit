function datePickerSpec(){

    function setDate(day, month, year){
        $('.date-picker .day').val(day).trigger('keyup').trigger('blur');
        $('.date-picker .month').val(month).trigger('keyup').trigger('blur');
        $('.date-picker .year').val(year).trigger('keyup');
    }

    function clickCalendarDay(day){
        $('.date-picker .date').each(function(){
            if ($(this).text() === day.toString()){
                $(this).click();
            }
        });
    }

        describe('Datepicker module', function() {

            beforeEach(function(){
                setDate('', '', '');
                $('.date-picker .calendar').remove();
                $('.date-picker').datePicker();
            });

            it('Renders the calendar', function() {
                expect($('.date-picker .calendar').length).to.equal(1);
            });

            it('Shows the calendar when the input field gets focus', function(){
                expect($(".calendar:visible").length).to.equal(0);

                $('.date-picker .day').focus();

                expect($(".calendar:visible").length).to.equal(1);
            });

            it('Hides the calendar on tab out', function() {
                expect($(".calendar:visible").length).to.equal(0);

                $('.date-picker .year').focus();
                expect($(".calendar:visible").length).to.equal(1);

                $('.date-picker .day').trigger(jQuery.Event( 'keydown', { keyCode: 9}));
                expect($(".calendar:visible").length).to.equal(0);
            });

            it('Hides the calendar on click off', function() {
                $('.date-picker input').focus();
                expect($('.date-picker .calendar').css('display')).to.equal('block');

                $('body').click();
                expect($('.date-picker .calendar').css('display')).to.equal('none');
            });

            it('Correctly selects a date', function() {
                setDate(1, 1, 2035);
                $('.date-picker .day').focus();

                expect(parseInt($('.date-picker .day').val())).to.equal(1);
                expect(parseInt($('.date-picker .month').val())).to.equal(1);
                expect(parseInt($('.date-picker .year').val())).to.equal(2035);
            });

            it('Correctly sets a date after clicking on day input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .day').focus();
                clickCalendarDay(2);
                expect(parseInt($('.date-picker .day').val())).to.equal(2);
                expect(parseInt($('.date-picker .month').val())).to.equal(1);
                expect(parseInt($('.date-picker .year').val())).to.equal(2035);
            });

            it('Correctly sets a date after clicking on month input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .month').focus();
                clickCalendarDay(2);
                expect(parseInt($('.date-picker .day').val())).to.equal(2);
                expect(parseInt($('.date-picker .month').val())).to.equal(1);
                expect(parseInt($('.date-picker .year').val())).to.equal(2035);
            });

            it('Correctly sets a date after clicking on year input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .year').focus();
                clickCalendarDay(2);

                expect(parseInt($('.date-picker .day').val())).to.equal(2);
                expect(parseInt($('.date-picker .month').val())).to.equal(1);
                expect(parseInt($('.date-picker .year').val())).to.equal(2035);
            });

            it('Shows the right number of days in each month', function() {
                // January
                setDate(1, 1, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // February
                setDate(1, 2, 2035);
                expect($('.day-container').find('.date').length).to.equal(28);
                // March
                setDate(1, 3, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // April
                setDate(1, 4, 2035);
                expect($('.day-container').find('.date').length).to.equal(30);
                // May
                setDate(1, 5, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // June
                setDate(1, 6, 2035);
                expect($('.day-container').find('.date').length).to.equal(30);
                // July
                setDate(1, 7, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // August
                setDate(1, 8, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // September
                setDate(1, 9, 2035);
                expect($('.day-container').find('.date').length).to.equal(30);
                // October
                setDate(1, 10, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
                // November
                setDate(1, 11, 2035);
                expect($('.day-container').find('.date').length).to.equal(30);
                // December
                setDate(1, 12, 2035);
                expect($('.day-container').find('.date').length).to.equal(31);
            });

            it('Shows the correct month and year in the calendar title', function() {
                setDate(1, 1, 2035);
                $('.date-picker .year').focus();
                expect($('.header [data-date]').text()).to.equal('January 2035');
            });

            it('Goes to the next month', function() {
                setDate(1, 1, 2035);
                $('.date-picker .year').focus();
                $('.next').click();
                expect($('.header [data-date]').text()).to.equal('February 2035');
            });

            it('Goes to the previous month in the same year', function() {
                setDate(1, 2, 2035);
                $('.date-picker .year').focus();
                $('.prev').click();
                expect($('.header [data-date]').text()).to.equal('January 2035');
            });

            it('Goes to the previous month in the previous year', function() {
                setDate(1, 1, 2035);
                $('.date-picker .year').focus();
                $('.prev').click();
                expect($('.header [data-date]').text()).to.equal('December 2034');
            });

            it('Changes the selected day of the calendar from the input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .day').focus();
                $('.date-picker .day').val(12).trigger('keyup').trigger('blur');
                expect($('.date-picker .selected').text()).to.equal('12');
            });

            it('Changes the month of the calendar from user input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .day').focus();
                $('.date-picker .month').val(5).trigger('keyup').trigger('blur');
                expect($('.header [data-date]').text()).to.include('May');
            });

            it('Changes the year of the calendar from user input', function() {
                setDate(1, 1, 2035);
                $('.date-picker .day').focus();
                $('.date-picker .year').val(2030).trigger('keyup').trigger('blur');
                expect($('.header [data-date]').text()).to.include('2030');
            });

            it('Greys out past days', function() {
                setDate(1, 1, 1900);
                expect($('.date-picker .date').hasClass('past')).to.equal(true);
            });

            it('Correctly shows leap years', function() {
                setDate(1, 2, 2012);
                expect($('.date-picker').find('.date:contains("29")').text()).to.equal('29');
            });

        });
        mocha.run();
}

if (window.define) {
    define('specs/datePickerSpec', ['components/datePicker'], function () {
        return datePickerSpec();
    })
}
