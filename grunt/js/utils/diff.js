define('utils/diff', ['lib/code-mirror'], function(CodeMirror) {

    function bindEvents(){
        $('#check').on('click', findFiles);
    }

    function getFile(){
        var name = $(this).attr('href').replace('#',''),
            file = '_includes/' + $(this).attr('data-file') + '.html',
            oldFile = 'http://web-toolkit.global.sky.com/' + $('#check').val() + '/' + file;

        $.ajax({
            crossDomain: true,
            url:file,
            cache: false})
        .done(function(html){
                var textarea = $('<textarea id="' + name + '" class="hidden latest"></textarea>').val(html);
                $('.sky-form').append(textarea);
            });

        $.ajax({
            crossDomain: true,
            url:oldFile,
            cache: false})
        .done(function(html){
                var textarea = $('<textarea id="old-' + name + '" class=hidden></textarea>').val(html);
                $('.sky-form').append(textarea);
            });
    }

    function findFiles(e){
        if (document.location.host !== "web-toolkit.global.sky.com" && document.location.host !== 'localhost'){
            document.location = "http://web-toolkit.global.sky.com/" + $('.wiki-header small').text().replace('v','') + '_site/changes.html';
            return;
        }
        e.preventDefault();
        $('a[data-file]').each(getFile);
        return false;
    }

    function highlight(){

        var myCodeMirror = CodeMirror.fromTextArea(document.getElementById('latest'),
            {value: document.getElementById('latest').value,lineWrapping: true,lineNumbers: true});
        var myCodeMirror2 = CodeMirror.fromTextArea(document.getElementById('file2'),
            {value: document.getElementById('file2').value,lineWrapping: true,lineNumbers: true});
        function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }
        setCookie("width", document.width, 1000000);

    }

    bindEvents();

});