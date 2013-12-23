if (typeof toolkit==='undefined') toolkit={};
toolkit.displayCode = (function(lightbox){

    function displayCode(options){
        var feature = options.feature;
        var fileNames = options.fileNames;
        var dir = options.dir;
        var styled = options.styled;
        new DisplayCode({
            feature: feature,
            fileNames: fileNames.split(','),
            dir: dir,
            styled: styled
        });
    }

    function addStyledCode(name, ext, code){
        var $code = $(code.replace(/{{ site.version }}/g,$('h1.wiki-header small').text().replace('v','').trim()));
        $(document.getElementById(name + ext + '-table')).append($code);
    }
    function addRow(name, ext, lineNumber, code){
        var tableBody = document.getElementById(name + ext + '-table'),
            tr = document.createElement('tr'),
            td2 = document.createElement('td'),
            td3 = document.createElement('td'),
            txt2 = document.createTextNode(lineNumber),
            txt3 = document.createTextNode(code);

        td2.className = 'codekolom';
        td3.className = 'bredecode';
        td2.appendChild(txt2);
        td3.appendChild(txt3);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tableBody.appendChild(tr);
    }

    function DisplayCode(options){
        this.feature = options.feature;
        this.dir = options.dir;
        this.fileNames = options.fileNames;
        this.styled = options.styled;
        this.$lightboxLink = $('a[href*="#!lightbox/code-' + this.feature + '"]');

        if (!$('#code-' + this.feature).length){
            this.getCode();
        }
    }

    DisplayCode.prototype.getCode = function(){
        this.getFile(this.dir, 'notes', 'html', true);
        for (var i in this.fileNames){
            this.getFile(this.dir, this.fileNames[i], 'html');
            this.getFile(this.dir, this.fileNames[i], 'notes.html', true);
            this.getFile(this.dir, this.fileNames[i], 'js');
            this.getFile(this.dir, this.fileNames[i], 'require.js');
        }
    };

    DisplayCode.prototype.getFile = function(dir, featureFile, ext, styled){
        var self = this;
        var dfd = $.ajax({ crossDomain: true, cache: false, url: dir + '/' + featureFile + '.' + ext});
        dfd.always(function(data){
            self[self.feature + '-' + featureFile + ext] = (typeof data === 'string') ? data : '';
            self.addToPage(featureFile, ext, styled);
        });
    };

    DisplayCode.prototype.addToPage = function(featureFile, ext, styled){
        this.$container = this.$lightboxLink.parent().parent().find('.code-container');
        this.$tabList = this.$container.find('.tab-list');

        this.addContainer();
        this.addTab(featureFile,ext, styled);
        this.show(featureFile,ext, styled);
        this.bindEvents();
        this.$lightboxLink.lightbox();
    };

    DisplayCode.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$container = $('<div class="code-container" id="code-' + this.feature + '"><h3 class="code-h3">' + this.feature + '</h3><div id="' + this.feature + '-noteshtml-table" class="feature-notes"></div></div>');
        this.$tabList = $('<ul class="tab-list clearfix" ></ul>');
        this.$container.append(this.$tabList);
        this.$lightboxLink.parent().parent().append(this.$container);
    };

    DisplayCode.prototype.createTable = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile + ext + '-table';
        if (this.styled || styled){
            return $('<div id="' + id + '" class="styled ' + ext + '"></div> ');
        } else {
            return $('<table class=' + ext + '><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody id="' + id + '"></tbody></table> ');
        }

    };

    DisplayCode.prototype.addTab = function(featureFile, styled){
        var tabName =  this.feature + '-' + featureFile;
        if (this.$container.find('#' + tabName + '-tab').length){ return ; }
        if(featureFile==='notes'){ return; }

        var $tabListItem = $('<li for="' + tabName + '-tab">' + (featureFile ? featureFile : 'default') + '</li>');
        this.$tabList.append($tabListItem);

        var $tab = $('<div class="tab hidden" id="' + tabName + '-tab"></div>');
        $tab.append(this.createTable(featureFile, 'notes.html', styled))
            .append(this.createTable(featureFile, 'html'))
            .append(this.createTable(featureFile, 'require.js'))
            .append(this.createTable(featureFile, 'js'));

        this.$container.append($tab);

    };

    DisplayCode.prototype.changeTab = function(){
        var $li = $(this);
        $li.closest('.code-container').find('.tab-list > li').removeClass('medium');
        $li.closest('.code-container').find('.tab').addClass('hidden');
        $('#' + $li.attr('for')).removeClass('hidden');
        $li.addClass('medium');
    };

    DisplayCode.prototype.bindEvents = function(){
        this.$tabList.on('click', 'li', this.changeTab);
        this.$tabList.find('li').first().click();
    };

    DisplayCode.prototype.show = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile;
        if (this.styled || styled){
            addStyledCode(id, ext, this[id + ext]);
        } else {
            var code = (this[id + ext]) ? this[id + ext].split('\n') : '' ;
            for (var i in code){
                var line = code[i];
                addRow(id, ext, parseInt(i,10) + 1, line);
            }
        }
    };

    return displayCode;

});

if (typeof window.define === "function" && window.define.amd) {
    define('utils/displayCode', ['components/lightbox'],function(lightbox) {
        return toolkit.displayCode(lightbox);
    });
} else {
    toolkit.displayCode = toolkit.displayCode(toolkit.lightbox);
}