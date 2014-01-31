if (typeof toolkit === 'undefined') toolkit = {};
toolkit.form = (function (datePicker, validation) {


});

if (typeof window.define === "function" && window.define.amd) {
    define('components/form', ['components/datePicker','utils/validation'], function (datePicker, validation) {
        return toolkit.form(datePicker, validation);
    });
} else {
    toolkit.form = toolkit.form(toolkit.datePicker, toolkit.validation);
}
