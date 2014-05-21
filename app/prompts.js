var chalk = require('chalk');

module.exports = function(defaults) {

	// Validate required
	var requiredValidate = function(value) {
		if (value == '') {
			return 'This field is required.';
		}
		return true;
	};
	// When advanced
	var advancedWhen = function() {
		return advanced;
	};

	return [{
			message: 'Lemonstand theme name',
			name: 'themeName',
			default: defaults.themeName || null,
			validate: requiredValidate
		}, {
			message: 'Lemonstand store host',
			name: 'storeHost',
			default: defaults.storeHost || null,
			validate: requiredValidate
		}, {
			message: 'Lemonstand API key',
			name: 'apiKey',
			default: defaults.apiKey || null,
			validate: requiredValidate
		}, {
			message: 'Lemonstand access token',
			name: 'accessToken',
			default: defaults.accessToken || null,
			validate: requiredValidate
		},

		{
			type: 'checkbox',
			name: 'features',
			message: 'What would you like to use for your app?',
			choices: [{
				name: 'Bootstrap',
				value: 'includeBootstrap',
				checked: true
			}, {
				name: 'Sass',
				value: 'includeSass',
				checked: false
			}, {
				name: 'Modernizr',
				value: 'includeModernizr',
				checked: false
			}]
		},

		{
			when: function(answers) {
				return answers.features.indexOf('includeSass') !== -1;
			},
			type: 'confirm',
			name: 'libsass',
			value: 'includeLibSass',
			message: 'Would you like to use libsass? Read up more at \n' + chalk.green('https://github.com/andrew/node-sass#node-sass'),
			default: false
		}

		/*
	{
		message: 'Use Git?',
		name: 'git',
		default: defaults.git || 'N',
		type: 'confirm'
	}, 

	
	{
		message: 'Add config.cfg to .gitignore?',
		name: 'ignoreConfig',
		type: 'confirm',
		default: defaults.ignoreConfig || false,
		validate: requiredValidate,
		when: function(res) {
			return (!! res.git);
		}
	}, 

	{
		message: 'Add app files to .gitignore?',
		name: 'ignoreApp',
		type: 'confirm',
		default: defaults.ignoreApp || false,
		validate: requiredValidate,
		when: function(res) {
			return (!! res.git);
		}
	}, 

	{
		message: 'GitHub username',
		name: 'themeUser',
		default: defaults.themeUser || 'wesleytodd',
		validate: requiredValidate,
		when: function(res) {
			return !!res.installTheme && res.themeType == 'git';
		}
	}, {
		message: 'GitHub repository name',
		name: 'themeRepo',
		default: defaults.themeRepo || 'YeoPress',
		validate: requiredValidate,
		when: function(res) {
			return !!res.installTheme && res.themeType == 'git';
		}
	}, {
		message: 'Repository branch',
		name: 'themeBranch',
		default: defaults.themeBranch || 'template',
		validate: requiredValidate,
		when: function(res) {
			return !!res.installTheme && res.themeType == 'git';
		}
	}, {
		message: 'Remote tarball url',
		name: 'themeTarballUrl',
		default: defaults.themeTarballUrl || 'https://github.com/wesleytodd/YeoPress/archive/template.tar.gz',
		validate: requiredValidate,
		when: function(res) {
			return !!res.installTheme && res.themeType == 'tar';
		}
	}
	*/
	];
};