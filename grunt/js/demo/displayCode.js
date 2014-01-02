if (typeof demo==='undefined') demo={};
demo.displayCode = (function(lightbox, hljs){

    function addStyledCode(name, ext, code){
        var $code = $(code.replace(/{{ site.version }}/g,$('#current-version').text()));
        if (ext.indexOf('js')>-1){
            $code = $.parseHTML($code);
        }
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
        hljs.highlightBlock(tr);
    }

    function DisplayCode(options){
        this.header = options.header;
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
        this.fileCount = 0;
        this.filesReceived = 0;
        this.getFile(this.dir, 'notes', 'html', true);
        for (var i in this.fileNames){
            this.getFile(this.dir, this.fileNames[i], 'html');
            this.getFile(this.dir, this.fileNames[i], 'notes.html', true);
            this.getFile(this.dir, this.fileNames[i], 'js');
            this.getFile(this.dir, this.fileNames[i], 'require.js');
        }
    };

    DisplayCode.prototype.getFile = function(dir, featureFile, ext, styled){
        this.fileCount++;
        var self = this;
        var dfd = $.ajax({
            crossDomain: true,
            cache: false,
            dataType: 'html',
            url: dir + '/' + featureFile + '.' + ext
        });
        dfd.always(function(data){
            self.filesReceived++;
            self[self.feature + '-' + featureFile + ext] = (typeof data === 'string') ? data : '';
            self.addToPage(featureFile, ext, styled);
        });
    };

    DisplayCode.prototype.addToPage = function(featureFile, ext, styled){
        this.$container = this.$lightboxLink.parent().parent().find('.code-container');
        this.$tabList = this.$container.find('.tabs');

        this.addContainer();
        this.addTab(featureFile,ext, styled);
        this.show(featureFile,ext, styled);
        if (this.fileCount === this.filesReceived){
            $('#code-' + this.feature).inPageNav();
            this.$lightboxLink.lightbox();
        }
    };

    DisplayCode.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$container = $('<div class="code-container clearfix tabs-container page-nav" data-function="tabs" id="code-' + this.feature + '"><h3 class="code-h3">' + this.header + '</h3><div id="' + this.feature + '-noteshtml-table" class="feature-notes"></div></div>');
        this.$tabList = $('<ul class="tabs clearfix" role="tablist" ><div class="dropdown-tab-select"><a href="#!" aria-controls="dropdown" aria-label="more tabs" class="medium">&hellip;</a><ul class="more-tabs"></ul></div></ul>');
        this.$container.append(this.$tabList);
        this.$lightboxLink.parent().parent().append(this.$container);
    };

    DisplayCode.prototype.createTable = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile + ext + '-table';
        if (this.styled || styled){
            return $('<div id="' + id + '" class="styled ' + ext + '"></div> ');
        } else {
            return $('<pre><table class=language-' + ext.replace('require.','') + '><thead><tr><th colspan="3">' + ext.toUpperCase() + '</th></tr></thead><tbody id="' + id + '"></tbody></table></pre>');
        }

    };

    DisplayCode.prototype.addTab = function(featureFile, styled){
        var tabName =  this.feature + '-' + featureFile;
        if (this.$container.find('#' + tabName + '-tab').length){ return ; }
        if(featureFile==='notes'){ return; }

        var $tabListItem = $('<li id="' + tabName + '-tab" aria-controls="' + tabName + '-tab-contents" role="tab" class="tab"><a href="#!' + tabName + '-tab-contents" class="skycom-ellipsis internal-link"><span>' + (featureFile ? featureFile : 'default') + '</span></a></li>');
        this.$tabList.prepend($tabListItem);

        var $tab = $('<div class="tabpanel" id="' + tabName + '-tab-contents" class="tabpanel selected" aria-labeledby="' + tabName + '-tab" role="tabpanel"></div>');
        var $tabContents = $('<section class="tabcontents clearfix"></section>');
        $tabContents.append(this.createTable(featureFile, 'notes.html', styled))
            .append(this.createTable(featureFile, 'html'))
            .append(this.createTable(featureFile, 'require.js'))
            .append(this.createTable(featureFile, 'js'));

        $tab.append($tabContents);
        this.$container.append($tab);

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

    return DisplayCode;

});

if (typeof window.define === "function" && window.define.amd) {
    define('demo/displayCode', ['components/lightbox',
        'demo/highlight'],function(lightbox, hljs) {
        return demo.displayCode(lightbox, hljs);
    });
} else {
    demo.displayCode = demo.displayCode(toolkit.lightbox, hljs);
}