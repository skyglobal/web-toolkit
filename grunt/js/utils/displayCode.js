if (typeof toolkit==='undefined') toolkit={};
toolkit.displayCode = (function(lightbox){

    function displayCode(feature, dir, demos){
        new DisplayCode({
            feature: feature,
            fileNames: demos.split(','),
            dir: dir
        });
    }

    function addRow(name, ext, lineNumber, code){
        var tableBody = $(document.getElementById(name + ext + '-table')).find('tbody')[0],
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
        this.$lightboxLink = $('a[href*="#!lightbox/code-' + this.feature + '"]');

        if (!$('#code-' + this.feature).length){
            this.getCode();
        }
    }

    DisplayCode.prototype.getCode = function(){
        for (var i in this.fileNames){
            this.getFile(this.dir, this.fileNames[i], 'html');
            this.getFile(this.dir, this.fileNames[i], 'js');
        }
    };

    DisplayCode.prototype.getFile = function(dir, featureFile, ext){
        var self = this;
        var dfd = $.ajax({ crossDomain: true, cache: false, url: dir + '/' + featureFile + '.' + ext});
        dfd.always(function(data){
            self[self.feature + '-' + featureFile + ext] = (typeof data === 'string') ? data : '';
            self.addToPage(featureFile, ext);
        });
    };

    DisplayCode.prototype.addToPage = function(featureFile, ext){
        this.$container = this.$lightboxLink.parent().parent().find('.code-container');
        this.$tabList = this.$container.find('.tab-list');

        this.addContainer();
        this.addTab(featureFile,ext);
        this.show(featureFile,ext);
        this.bindEvents();
        this.$lightboxLink.lightbox();
    };

    DisplayCode.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$container = $('<div class="code-container" id="code-' + this.feature + '"></div>');
        this.$tabList = $('<ul class="tab-list clearfix" ></ul>');
        this.$container.append(this.$tabList);
        this.$lightboxLink.parent().parent().append(this.$container);
    };

    DisplayCode.prototype.createTable = function(featureFile, ext){
        var id = this.feature + '-' + featureFile + ext + '-table';
        return $('<table id="' + id + '"><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody></tbody></table> ');
    };

    DisplayCode.prototype.addTab = function(featureFile){
        var tabName =  this.feature + '-' + featureFile;
        if (this.$container.find('#' + tabName + '-tab').length){ return ; }

        var $tabListItem = $('<li for="' + tabName + '-tab">' + (featureFile ? featureFile : 'default') + '</li>');
        this.$tabList.append($tabListItem);

        var $tab = $('<div class="tab hidden" id="' + tabName + '-tab"></div>');

        $tab.append(this.createTable(featureFile, 'html'))
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

    DisplayCode.prototype.show = function(featureFile, ext){
        var id = this.feature + '-' + featureFile;
        var code = (this[id + ext]) ? this[id + ext].split('\n') : '' ;
        for (var i in code){
            var line = code[i];
            addRow(id, ext, parseInt(i,10) + 1, line);
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