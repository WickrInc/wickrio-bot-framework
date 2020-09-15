# WickrIO Bot Framework
[![npm version](https://badge.fury.io/js/wickrbot.svg)](https://badge.fury.io/js/wickrbot) ![Node.js CI](https://github.com/WickrInc/wickrio-bot-framework/workflows/Node.js%20CI/badge.svg)

Node.js library for interacting with the WickrIO addon. This was created as an alternative to https://github.com/WickrInc/wickrio-bot-api.

## Quickstart

``` javascript
const WickrBot = require('wickrbot')
const wickr = require('wickrio_addon')

class MilkBot extends WickrBot {
  constructor(wickr, username) {
    super(wickr, username)
    // This will create a new command for /order
    this.listen('order', (msg, args) => {
      // args is an array of all values passed to the command
      let quantity = args[1]
      this.orderMilk(quantity)
      this.send(msg.vgroupid, "Okay... I ordered some milk!")
    })
  }
}

const milkbot = new MilkBot(wickr)
milkbot.start()
```

Or try the [Wickr Bot Cookiecutter template](https://github.com/WickrInc/cookiecutter-wickr-bot):

```
cookiecutter gh:WickrInc/cookiecutter-wickr-bot
```

## Development

### Publishing new packages

Use `npm version [patch|minor|major]` to update the version in package.json and create a new commit and tag with the version. If you create a git tag *without* updating the version in package.json, the `npm publish` will fail because of duplicate versions.
