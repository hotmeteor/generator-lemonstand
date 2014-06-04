'use strict';
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var Config = require('../util/config');

var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.testFramework = options['test-framework'] || 'mocha';
    this.coffee = options.coffee;

    // for hooks to resolve on mocha by default
    options['test-framework'] = this.testFramework;

    // // resolved to mocha by default (could be switched to jasmine for instance)
    // this.hookFor('test-framework', {
    //   as: 'app',
    //   options: {
    //     options: {
    //       'skip-message': options['skip-install-message'],
    //       'skip-install': options['skip-install']
    //     }
    //   }
    // });

    this.options = options;

    this.pkg = require('../package.json');

    this.configFile = 'lemonsync.cfg';

    // Load the config files
    this.conf = new Config();
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function() {

    var done = this.async();
    var that = this;

    // welcome message
    if (!this.options['skip-welcome-message']) {
        this.log(yosay());
        this.log('\n' + chalk.magenta(
            'Hello! Ready to setup your Lemonstand theme? Good, here we go!'
        ) + '\n');
    }

    // Prompt for answers.

    this.prompt(require('./prompts')(that.conf.get()), function(answers) {

        var features = answers.features;

        function hasFeature(feat) {
            return features.indexOf(feat) !== -1;
        }

        that.prompt([{
            message: 'Does this all look correct?',
            name: 'confirm',
            type: 'confirm'
        }], function(i) {

            if (i.confirm) {

                that.includeSass = hasFeature('includeSass');
                that.includeBootstrap = hasFeature('includeBootstrap');
                that.includeModernizr = hasFeature('includeModernizr');

                that.includeLibSass = answers.libsass;
                that.includeRubySass = !answers.libsass;

                // set theme path
                answers.themeFolder = path.join(process.cwd(), '/theme');

                that.conf.set(answers);

                // console.log('User Input: ' + JSON.stringify(that.conf.get(), null, '  '));

                done();

            } else {
                console.log();
            }
        });

    }.bind(this));
};

Generator.prototype.saveSettings = function saveSettings() {
    console.log('Writing .lemonstand file');
    fs.writeFileSync('.lemonstand', JSON.stringify(this.conf.get(), null, '\t'));
};

Generator.prototype.makeMeAConfig = function makeMeAConfig() {

    var done = this.async();
    var that = this;

    that.template(that.configFile);

    // https://github.com/yeoman/generator/issues/233#issuecomment-17872311
    this.conflicter.resolve(function(err) {
        if (err) return console.log(err);
        that.mkdir(that.conf.get('themeFolder'));
        console.log('Created LemonSync lemonsync.cfg and theme folder');
        done();
    });
};

// Create the folder and sync down the theme
Generator.prototype.lemonSync = function lemonSync() {

    var done = this.async();
    var that = this;

    console.log('\n\n' +
        chalk.black.bgYellow('Installing your lemony theme!') +
        '\n');

    var lemonsync = spawn('lemonsync', ['--config=' + path.join(that.conf.get('themeFolder'), '../' + that.configFile), '--reset=local']);
    lemonsync.stdin.setEncoding = 'utf-8';
    lemonsync.stdout.on('data', function(data) {
        var str = data.toString();
        var lines = str.split(/(\r?\n)/g);
        console.log(str);

        for (var i = 0; i < lines.length; i++) {
            if (lines[i].match(/(LemonSync is listening to changes)/m)) {
                lemonsync.kill();
            }
        }
    });

    lemonsync.stdout.on('end', function() {
        console.log('\n' +
            chalk.black.bgYellow('Sync complete.') +
            '\n\n');
        done();
    });

    lemonsync.on('exit', function(code) {
        // console.log('lemonsync exit');
    });

    lemonsync.on('error', function(err) {
        console.log('error: ' + err);
    });

    // Say [Y]es!
    lemonsync.stdin.write("Y\n");
};


Generator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

Generator.prototype.git = function git() {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
    this.template('_bower.json', 'bower.json');
};

Generator.prototype.jshint = function jshint() {
    this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
    this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.h5bp = function h5bp() {
    this.copy('favicon.ico', 'app/favicon.ico');
    this.copy('404.html', 'app/404.html');
    this.copy('robots.txt', 'app/robots.txt');
    this.copy('htaccess', 'app/.htaccess');
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
    var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
    this.copy(css, 'app/styles/' + css);
};

Generator.prototype.writeIndex = function writeIndex() {

    this.indexFile = this.readFileAsString(
        path.join(this.sourceRoot(), 'index.html')
    );
    this.indexFile = this.engine(this.indexFile, this);

    // wire Bootstrap plugins
    if (this.includeBootstrap) {
        var bs = '../bower_components/bootstrap';
        bs += this.includeSass ?
            '-sass-official/vendor/assets/javascripts/bootstrap/' : '/js/';
        this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
            bs + 'affix.js',
            bs + 'alert.js',
            bs + 'dropdown.js',
            bs + 'tooltip.js',
            bs + 'modal.js',
            bs + 'transition.js',
            bs + 'button.js',
            bs + 'popover.js',
            bs + 'carousel.js',
            bs + 'scrollspy.js',
            bs + 'collapse.js',
            bs + 'tab.js'
        ]);
    }

    this.indexFile = this.appendFiles({
        html: this.indexFile,
        fileType: 'js',
        optimizedPath: 'scripts/main.js',
        sourceFileList: ['scripts/main.js'],
        searchPath: '{app,.tmp}'
    });
};

Generator.prototype.app = function app() {
    this.mkdir('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    if (this.coffee) {
        this.write(
            'app/scripts/main.coffee',
            'console.log "\'Allo from CoffeeScript!"'
        );
    } else {
        this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
    }
};

Generator.prototype.install = function() {
    if (this.options['skip-install']) {
        return;
    }

    var done = this.async();
    this.installDependencies({
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install'],
        callback: done
    });
};