if (typeof toolkit==='undefined') toolkit={};
toolkit.diff = (function(){

    function findFiles(opts){
        var oldRoute = opts.oldRoute,
            newRoute = opts.newRoute;
        clear();
        $('a[data-diff]').each(function(){
            var dir = $(this).attr('data-diff');
            var demos = $(this).attr('data-diff-demos');
            var arrDemos;
            if (demos){
                arrDemos = demos.split(',');
                for (var i in arrDemos){
                    getFile(oldRoute, newRoute, dir, arrDemos[i]);
                }
            }
            getFile(oldRoute, newRoute, dir);
        });
    }

    function getFile(oldVersion, newVersion, file, demo){
        var dfd_latest, dfd_old;
        var name = file.split('/')[1],
            newFile = newVersion + '/' + file + (demo?'/'+demo:'') + '.html',
            oldFile = oldVersion + '/' + file + (demo?'/'+demo:'') + '.html';

        dfd_latest = $.ajax({
            crossDomain: true,
            url:newFile,
            cache: false});

        dfd_old = $.ajax({
            crossDomain: true,
            url:oldFile,
            cache: false});

        $.when(dfd_latest,dfd_old).done(function(latest, old){
            displayComparison(latest, old, name, demo);
        }).fail(function(){
            displayNewFile(newFile, name, demo);
        });
    }

    function displayComparison(latest, old, name, demo){
        var fullName = name + (demo ? '-' + demo : '');
        var $container = $('[data-toggle="' + name +'"]');
        var $header = $('h3#' + name + '-header');
        var $tabList = $container.find('.tab-list');

        if ($container.length===0){
            $header = $('<h3 class="has-toggle wiki-h3 smaller" id="' + name + '-header"><span class="toggler" for="' + name + '"></span>' + name + '</h3>');
            $container = $('<div class="togglee" data-toggle="' + name + '"></div>');
            $tabList = $('<ul class="tab-list" ></ul>');
            $container.append($tabList);
            $('[data-diff-container]')
                .append($header)
                .append($container);
        }
        var $tabListItem = $('<li for="' + fullName + '-tab">' +  (demo || 'Supporting Docs') + '</li>');
        var $tab = $('<div class="tab hidden" id="' + fullName + '-tab"></div>');
        var $table = $('<table id="' + fullName + '-table"></table>');
        $tabList[(demo ? 'append' : 'prepend')]($tabListItem);
        $tab.append($table)
            .append( $('<textarea id="' + fullName + '" class="hidden latest"></textarea>').val(latest))
            .append($('<textarea id="old-' + fullName + '" class=hidden></textarea>').val(old));
        $container.append($tab);

        $tabList.on('click', 'li', function(){
           $(this).closest('.togglee').find('.tab-list > li').removeClass('medium');
           $(this).closest('.togglee').find('.tab').addClass('hidden');
            $('#' + $(this).attr('for')).removeClass('hidden');
            $(this).addClass('medium');
        });
        $tabList.find('li').first().click();

        diff(fullName, old[0].split('\n'), latest[0].split('\n'));
    }

    function displayNewFile(newFile, name, demo){
        $.ajax({
            crossDomain: true,
            url:newFile,
            cache: false
        }).done(function(latest){
            displayComparison([latest], [''], name, demo);
        });
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
        var tableBody = document.getElementById(name + '-table'),
            header = document.getElementById(name + '-header'),
            tr = document.createElement('tr'),
            td1 = document.createElement('td'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td'),
            txt1 = document.createTextNode(y),
            txt2 = document.createTextNode(x),
            txt3 = document.createTextNode(type + ' ' + rij);

        if(type==='+'){
            tr.className='add';
            $(header).addClass('add');
        } else if(type==='-'){
            tr.className='del';
            $(header).addClass('del');
        }

        td1.className = 'codekolom';
        td2.className = 'codekolom';
        td3.className = 'bredecode';
        td1.appendChild(txt1);
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
    }

    function clear(){
        $('.sky-form .error').text('');
        $('.togglee').remove();
        $('.has-toggle').remove();
    }

    return findFiles;

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/diff', function() {
        return toolkit.diff();
    });
} else {
    toolkit.diff = toolkit.diff();
}