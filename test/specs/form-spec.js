function formSpec(datePickerSpec, vlidationSpec) {

}

if (window.define) {
    define('specs/form-spec', ['specs/date-pickerSpec','specs/validation-spec'], function (datePickerSpec, validationSpec) {
        return formSpec();
    });
}