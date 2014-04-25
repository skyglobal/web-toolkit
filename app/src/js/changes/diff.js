if (typeof changes==='undefined') changes={};
changes.diff = (function(hljs){

    function findFiles(opts){
        var oldRoute = opts.oldRoute,
            newRoute = opts.newRoute;
        clear();
        $('a[data-diff]').each(function(){
            var demo, newFile, oldFile,
                dir = $(this).attr('data-diff').replace(/\s/g, '');
            var demos = $(this).attr('data-diff-demos').replace(/\s/g, '') || '';
            var arrDemos = demos.split(',');
            var componentName = dir.indexOf('/') === -1 ? dir : dir.split('/')[1];
            for (var i in arrDemos){
                demo = arrDemos[i];
                newFile = newRoute + '/' + dir + (demo ? '/' + demo : '');
                oldFile = oldRoute + '/' + dir + (demo ? '/' + demo : '');
                new CompareCodeBase({
                    name: componentName,
                    demo: demo,
                    newCodeSource: newFile,
                    oldCodeSource: oldFile
                });
            }
        });
    }


    function getDiff(name, ext, matrix, a1, a2, x, y){
        if(x>0 && y>0 && a1[y-1]===a2[x-1]){
            getDiff(name, ext, matrix, a1, a2, x-1, y-1);
            addRow(name, ext, x, y, ' ', a1[y-1]);
        } else {
            if(x>0 && (y===0 || matrix[y][x-1] >= matrix[y-1][x])){
                getDiff(name, ext, matrix, a1, a2, x-1, y);
                addRow(name, ext, x, '', '+', a2[x-1]);
            } else if(y>0 && (x===0 || matrix[y][x-1] < matrix[y-1][x])){
                getDiff(name, ext, matrix, a1, a2, x, y-1);
                addRow(name, ext, '', y, '-', a1[y-1], '');
            } else {
                return;
            }
        }
    }

    function prepareCode(name, ext, a1, a2){
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
        return {
            matrix: matrix,
            xPosition: x-1,
            yPosition: y-1
        };
    }

    function addRow(name, ext, x, y, type, rij){
        var tableBody = $(document.getElementById(ext + '-' + name + '-table')).find('tbody')[0],
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
            $(tableBody).parents('.togglee').addClass('add').prev().addClass('add');
        } else if(type==='-'){
            tr.className='del';
            $(header).addClass('del');
            $(tableBody).parents('.togglee').addClass('del').prev().addClass('del');
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
        hljs.highlightBlock(td3);
    }

    function clear(){
        $('.sky-form .error').text('');
        $('.togglee').remove();
        $('.has-toggle').remove();
    }

    function CompareCodeBase(options){
        this.name = options.name;
        this.newCodeSource = options.newCodeSource;
        this.oldCodeSource = options.oldCodeSource;
        this.demoName = options.demo;
        this.complete = {};

        this.getCode();
    }

    CompareCodeBase.prototype.getCode = function(){
        this.getFileByExtension('new','html');
        this.getFileByExtension('old','html');
//        this.getFileByExtension('new','notes.html');
//        this.getFileByExtension('old','notes.html');
        this.getFileByExtension('new','js');
        this.getFileByExtension('old','js');
    };

    CompareCodeBase.prototype.getFileByExtension = function(age, ext){
        var self = this;
        var version = age + ext;
        var dfd = $.ajax({ crossDomain: true, cache: false, url:this[age + 'CodeSource'] + '.' + ext});
        dfd.always(function(data){
            self[version] = (typeof data === 'string') ? data : '';
            self.addToPage(version);
            if (!self.complete[self.name + '.' + ext]){
                self.complete[self.name + '.' + ext] = [age];
            } else {
                self.compare(ext);
            }
        });
    };

    CompareCodeBase.prototype.addToPage = function(version){

        this.fullName = this.name + (this.demoName ? '-' + this.demoName : '');
        this.$container = $('[data-toggle="' + this.name +'"]');
        this.$header = $('h3#' + this.name + '-header');
        this.$tabList = this.$container.find('.tab-list');

        this.addContainer();
        this.addTab();
        this.saveCode(version);
        this.bindEvents();
    };

    CompareCodeBase.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$header = $('<h3 class="has-toggle demo-h3 pod-title smaller" id="' + this.name + '-header"><span class="toggler" for="' + this.name + '"></span>' + this.name + '</h3>');
        this.$container = $('<div class="togglee" data-toggle="' + this.name + '"></div>');
        this.$tabList = $('<ul class="tab-list clearfix" ></ul>');
        this.$container.append(this.$tabList);
        $('[data-diff-container]')
            .append(this.$header)
            .append(this.$container);
    };

    CompareCodeBase.prototype.createTable = function(ext){
        return $('<div class="code-container"><pre><table id="' + ext + '-' + this.fullName + '-table"><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody></tbody></table></pre></div> ');
    };

    CompareCodeBase.prototype.addTab = function(){
        if (this.$container.find('#' + this.fullName + '-tab').length){ return ; }

        var $tabListItem = $('<li for="' + this.fullName + '-tab">' + (this.demoName ? this.demoName : 'default') + '</li>');
        this.$tabList.append($tabListItem);

        var $tab = $('<div class="tab hidden" id="' + this.fullName + '-tab"></div>');

        $tab.append(this.createTable('html'))
            .append(this.createTable('js'))
            .append( $('<textarea id="newhtml-' + this.fullName + '" class="hidden latest"></textarea>'))
            .append($('<textarea id="oldhtml-' + this.fullName + '" class=hidden></textarea>'))
            .append( $('<textarea id="newjs-' + this.fullName + '" class="hidden latest"></textarea>'))
            .append($('<textarea id="oldjs-' + this.fullName + '" class=hidden></textarea>'));

        this.$container.append($tab);
    };

    CompareCodeBase.prototype.saveCode = function(version){
        $('#' + version + '-' + this.fullName).val(this[version]);
    };

    CompareCodeBase.prototype.changeTab = function(){
        var $li = $(this);
        $li.closest('.togglee').find('.tab-list > li').removeClass('medium');
        $li.closest('.togglee').find('.tab').addClass('hidden');
        $('#' + $li.attr('for')).removeClass('hidden');
        $li.addClass('medium');
    };

    CompareCodeBase.prototype.bindEvents = function(){
        this.$tabList.on('click', 'li', this.changeTab);
        this.$tabList.find('li').first().click();
    };

    CompareCodeBase.prototype.compare = function(ext){
        var oldCode = (this['old' + ext]) ? this['old' + ext].split('\n') : '' ;
        var newCode = (this['new' + ext]) ? this['new' + ext].split('\n') : '' ;
        var codeObj = prepareCode(this.fullName, ext, oldCode, newCode);
        getDiff(this.fullName, ext, codeObj.matrix, oldCode, newCode, codeObj.xPosition, codeObj.yPosition);
    };

    return findFiles;

});

if (typeof window.define === "function" && window.define.amd) {
    define(['highlight'], function(hljs) {
        return changes.diff(hljs);
    });
} else {
    changes.diff = changes.diff(hljs);
}
