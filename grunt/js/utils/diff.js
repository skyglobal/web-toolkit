define('utils/diff', ['lib/code-mirror'], function(CodeMirror) {

    function bindEvents(){
        $('#check').on('click', findFiles);
    }

    function getFile(){
        var dfd_latest, dfd_old;
        var name = $(this).attr('href').replace('#',''),
            file = '_includes/' + $(this).attr('data-file') + '.html',
            oldFile = 'http://web-toolkit.global.sky.com/' + $('#version').val() + '/_site/' + file;

        dfd_latest = $.ajax({
            crossDomain: true,
            url:file,
            cache: false});

        dfd_old = $.ajax({
            crossDomain: true,
            url:oldFile,
            cache: false});

        $.when(dfd_latest,dfd_old).done(function(latest, old){
            var $container = $('<div class="togglee" data-toggle="' + name + '">' + name + '</div>');

            $container.append( $('<textarea id="' + name + '" class="hidden latest"></textarea>').val(latest))
                .append($('<textarea id="old-' + name + '" class=hidden></textarea>').val(old));

            $('.sky-form')
                .append('<h3 class="has-toggle wiki-h3"><span class="toggler" for="' + name + '"></span>' + name + '</h3>')
                .append($container);

            highlight(name,latest[0], old[0]);
        });
    }

    function findFiles(e){
        if (document.location.host !== "web-toolkit.global.sky.com" && document.location.host.indexOf('localhost')<0){
            document.location = "http://web-toolkit.global.sky.com/" + $('.wiki-header small').text().replace('v','') + '/_site/changes.html';
            return;
        }
        e.preventDefault();
        $('a[data-file]').each(getFile);
        return false;
    }

    function highlight(name,latest, old){

        var myCodeMirror = CodeMirror.fromTextArea($('#' + name).get(0),
            {value: latest,lineWrapping: true,lineNumbers: true});
        var myCodeMirror2 = CodeMirror.fromTextArea($('#old-' + name).get(0),
            {value: old,lineWrapping: true,lineNumbers: true});
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