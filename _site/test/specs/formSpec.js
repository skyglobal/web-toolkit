function formSpec(datePickerSpec, vlidationSpec) {

}

if (window.define) {
    define('specs/formSpec', ['specs/datePickerSpec','specs/validationSpec'], function (datePickerSpec, validationSpec) {
        return formSpec();
    });
}