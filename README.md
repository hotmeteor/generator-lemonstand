# generator-lemonstand 

Yeoman generator that scaffolds out a [LemonStand](http://lemonstand.com) theme and syncs it with [LemonSync](https://github.com/lemonstand/lemonsync).

[![NPM version](https://badge.fury.io/js/generator-lemonstand.svg)](http://badge.fury.io/js/generator-lemonstand)

## Getting Started

If you already have LemonSync installed and a LemonStand store set up...

- Install: `npm install -g generator-lemonstand`
- Run: `yo lemonstand`
- Run `grunt` for building and `grunt serve` for preview[*](#serve-note). `--allow-remote` option for remote access.
- Run `lemonsync --config=config.cfg` to sync up your theme as you work on it.

Full [installation](https://github.com/hotmeteor/generator-lemonstand/wiki/Installation) notes are available in the [wiki](https://github.com/hotmeteor/generator-lemonstand/wiki).


## License

MIT

Adam Campbell (@hotmeteor)

## TODO

- Install theme from git
- Optional force-sync theme with remote
- Update partials to refer to assets
- Create sub-generators
