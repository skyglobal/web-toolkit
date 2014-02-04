function formSpec(datePickerSpec, validationSpec) {

}

if (window.define) {
    define('specs/form-spec', ['specs/date-picker-spec','specs/validation-spec'], function (datePickerSpec, validationSpec) {
        return formSpec();
    });
}