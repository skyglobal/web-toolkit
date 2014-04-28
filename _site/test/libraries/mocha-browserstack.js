(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['mocha'], factory);
  } else {
    factory(Mocha);
  }
}(this, function (Mocha) {
  function stack(err) {
    var str = err.stack || err.toString();

    if (!~str.indexOf(err.message)) {
      str = err.message + '\n' + str;
    }

    if ('[object Error]' == str) {
      str = err.message;
    }

    if (!err.stack && err.sourceURL && err.line !== undefined) {
      str += '\n(' + err.sourceURL + ':' + err.line + ')';
    }
    return str.replace(/^/gm, '  ');
  }

  function title(test) {
    return test.fullTitle().replace(/#/g, '');
  }

    var mochaInstance = window.Mocha || window.mocha;

    BrowserStackReporter = function (runner, root) {
        if (!mochaInstance) {
            throw new Error('Mocha was not found, make sure you include Mocha in your HTML spec file.');
        }
        mochaInstance.reporters.HTML.call(this, runner, root);

        if (/browser=/i.test(window.location.search)) {
            var result = '',
                count = 1,
                failures = 0,
                passes = 0;

            runner.on('start', function () {
                result += '1..' + runner.grepTotal(runner.suite) + '\n';
            });

            runner.on('test end', function (test) {
                count += 1;
            });

            runner.on('pending', function (test) {
                result += 'ok ' + count + ' ' + title(test) + ' # SKIP -\n';
            });

            runner.on('pass', function (test) {
                passes += 1;
                result += 'ok ' + count + ' ' + title(test) + '\n';
            });

            runner.on('fail', function (test, err) {
                failures += 1;
                result += 'not ok ' + count + ' ' + title(test) + '\n';

                if (err) {
                    result += stack(err) + '\n';
                }
            });

            runner.on('end', function () {
                result += '# tests ' + (passes + failures) + '\n';
                result += '# pass ' + passes + '\n';
                result += '# fail ' + failures + '\n';

                var xhr = null;

                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                xhr.open('POST', window.location.href);
                xhr.setRequestHeader('Content-Type', 'text/plain');
                xhr.send(result);
            });
        }
    };

    BrowserStackReporter.prototype = mochaInstance.reporters.HTML.prototype;
    Mocha.BrowserStack = BrowserStackReporter;
  return BrowserStackReporter;
}));
