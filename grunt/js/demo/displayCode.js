if (typeof demo==='undefined') demo={};
demo.displayCode = (function(lightbox, hljs){

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
        this.addTab(featureFile, ext, styled);
        this.addCode(featureFile, ext, styled);
        if (this.fileCount === this.filesReceived){
            $('#code-' + this.feature).inPageNav();
            this.$lightboxLink.lightbox();
        }
    };

    DisplayCode.prototype.addContainer = function(){
        if (this.$container.length){ return ; }

        this.$container = $('<div class="code-container clearfix tabs-container page-nav" data-function="tabs" id="code-' + this.feature + '"><h3 class="code-h3">' + this.header + '</h3><div id="' + this.feature + '-noteshtml-container" class="feature-notes"></div></div>');
        this.$tabList = $('<ul class="tabs clearfix" role="tablist" ><div class="dropdown-tab-select"><a href="#!" aria-controls="dropdown" aria-label="more tabs" class="medium">&hellip;</a><ul class="more-tabs"></ul></div></ul>');
        this.$container.append(this.$tabList);
        this.$lightboxLink.parent().parent().append(this.$container);
    };

    DisplayCode.prototype.createContainer = function(featureFile, ext, styled){
        var id = this.feature + '-' + featureFile + ext + '-container';
        if (this.styled || styled){
            return $('<div id="' + id + '" class="styled ' + ext + '"></div> ');
        } else {
            return $('<h4 class="intro smaller">' + ext.toUpperCase() + '</h4> <pre><code class="language-' + ext.replace('require.','') + ' hljs vhdl"  id="' + id + '"></code></pre>');
        }

    };

    DisplayCode.prototype.addTab = function(featureFile, styled){
        var tabName =  this.feature + '-' + featureFile;
        if (this.$container.find('#' + tabName + '-tab').length){ return ; }
        if(featureFile==='notes'){ return; }

        var featureFileLabel = featureFile || 'default';
        featureFileLabel = featureFileLabel.replace(/([A-Z][a-z])/g, ' $1').replace(/([a-z])([AI])/g, '$1 $2'); // the last one for single-letter words 'A' and 'I'
        featureFileLabel = featureFileLabel.charAt(0).toUpperCase() + featureFileLabel.slice(1); // capitalise the first letter

        var $tabListItem = $('<li id="' + tabName + '-tab" aria-controls="' + tabName + '-tab-contents" role="tab" class="tab"><a href="#!' + tabName + '-tab-contents" class="skycom-ellipsis internal-link"><span>' + featureFileLabel + '</span></a></li>');
        this.$tabList.prepend($tabListItem);

        var $tab = $('<div class="tabpanel" id="' + tabName + '-tab-contents" class="tabpanel selected" aria-labeledby="' + tabName + '-tab" role="tabpanel"></div>');
        var $tabContents = $('<section class="tabcontents clearfix"></section>');
        $tabContents.append(this.createContainer(featureFile, 'notes.html', styled))
            .append(this.createContainer(featureFile, 'html'))
            .append(this.createContainer(featureFile, 'require.js'))
            .append(this.createContainer(featureFile, 'js'));

        $tab.append($tabContents);
        this.$container.append($tab);

    };

    DisplayCode.prototype.addCode = function(featureFile, ext, styled){
        var fnName = (this.styled || styled) ? 'Styled' : 'Highlighted';
        this['add' + fnName + 'Code'](featureFile, ext);
    };

    DisplayCode.prototype.addStyledCode = function(featureFile, ext){
        var id = this.feature + '-' + featureFile;
        var codeDom = document.getElementById(id + ext + '-container'),
            code = this[id + ext];

        var $code = $(code.replace(/{{ site.version }}/g,$('#current-version').text()));
        if (ext.indexOf('js')>-1){
            $code = $.parseHTML($code);
        }
        $(codeDom).append($code);
    };

    DisplayCode.prototype.addHighlightedCode = function(featureFile, ext){
        var id = this.feature + '-' + featureFile;
        var languageShortHand = ext.replace('require.','');
        var language = (languageShortHand=='js') ? 'javascript' : 'xml';
        var codeDom = document.getElementById(id + ext + '-container'),
            code = this[id + ext] || 'none',
            codeNode;

        var highlighted = hljs.highlight(language, code, true);
//        codeNode = document.createTextNode(highlighted.value);
        $(codeDom).append(highlighted.value);
//        codeDom.appendChild(highlighted.value);

    };

    return DisplayCode;

});

if (typeof window.define === "function" && window.define.amd) {
    define('demo/displayCode', ['components/lightbox', 'lib/highlight'],function(lightbox, hljs) {
        return demo.displayCode(lightbox, hljs);
    });
} else {
    demo.displayCode = demo.displayCode(toolkit.lightbox, hljs);
}