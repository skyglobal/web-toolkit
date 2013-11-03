define('utils/diff', function() {

    function bindEvents(){
        $('#check').on('click', findFiles);
    }

    function getFile(){
        var dfd_latest, dfd_old;
        var name = $(this).attr('href').replace('index.html#',''),
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

        clear(name);

        $.when(dfd_latest,dfd_old).done(function(latest, old){
            var $container = $('<div class="togglee" data-toggle="' + name + '"><table id="' + name + '-table"></table></div>');

            $container.append( $('<textarea id="' + name + '" class="hidden latest"></textarea>').val(latest))
                .append($('<textarea id="old-' + name + '" class=hidden></textarea>').val(old));

            $('.sky-form')
                .append('<h3 class="has-toggle wiki-h3 smaller" id="' + name + '-header"><span class="toggler" for="' + name + '"></span>' + name + '</h3>')
                .append($container);

            diff(name, old[0].split('\n'), latest[0].split('\n'));
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


    function getDiff(name, matrix, a1, a2, x, y){
        if(x>0 && y>0 && a1[y-1]===a2[x-1]){
            getDiff(name, matrix, a1, a2, x-1, y-1);
            addRow(name, x, y, ' ', a1[y-1]);
        } else {
            if(x>0 && (y===0 || matrix[y][x-1] >= matrix[y-1][x])){
                getDiff(name, matrix, a1, a2, x-1, y);
                addRow(name, x, '', '+', a2[x-1]);
            } else if(y>0 && (x===0 || matrix[y][x-1] < matrix[y-1][x])){
                getDiff(name, matrix, a1, a2, x, y-1);
                addRow(name, '', y, '-', a1[y-1], '');
            } else {
                return;
            }
        }

    }


    function diff(name, a1, a2){
        var matrix = new Array(a1.length+1);
        var x,y;

        for( y=0; y<matrix.length; y++){
            matrix[y] = new Array(a2.length+1);

            for( x=0; x<matrix[y].length; x++){
                matrix[y][x] = 0;
            }
        }

        for( y=1; y<matrix.length; y++){
            for( x=1; x<matrix[y].length; x++){
                if(a1[y-1]===a2[x-1]){
                    matrix[y][x] = 1 + matrix[y-1][x-1];
                } else {
                    matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
                }
            }
        }

        try {
            getDiff(name, matrix, a1, a2, x-1, y-1);
        } catch(e){
            alert(e);
        }
    }

    function addRow(name, x, y, type, rij){
        var tableBody = document.getElementById(name + '-table');
        var header = document.getElementById(name + '-header');
        var tr = document.createElement('tr');
        if(type==='+'){
            tr.className='add';
            $(header).addClass('add');
        } else if(type==='-'){
            tr.className='del';
            $(header).addClass('del');
        }

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');

        td1.className = 'codekolom';
        td2.className = 'codekolom';
        td3.className = 'bredecode';

        var txt1 = document.createTextNode(y);
        var txt2 = document.createTextNode(x);
        var txt3 = document.createTextNode(type + ' ' + rij);

        td1.appendChild(txt1);
        td2.appendChild(txt2);
        td3.appendChild(txt3);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tableBody.appendChild(tr);
    }

    function clear(name){
        var tableBody = document.getElementById(name + '-table');
        if (!tableBody){ return; }
        while(tableBody.hasChildNodes()){
            tableBody.removeChild(tableBody.lastChild);
        }
    }

    bindEvents();

});