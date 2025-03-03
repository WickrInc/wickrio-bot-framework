# WickrIO Bot Framework
[![npm version](https://badge.fury.io/js/wickrbot.svg)](https://badge.fury.io/js/wickrbot) ![Node.js CI](https://github.com/WickrInc/wickrio-bot-framework/workflows/Node.js%20CI/badge.svg)

Node.js library for interacting with the WickrIO addon. This was created as an alternative to https://github.com/WickrInc/wickrio-bot-api.

## Quickstart

### JavaScript

```javascript
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

### TypeScript

```typescript
import { WickrBot, WickrMessage } from 'wickrbot';
// You'll need to import the wickrio_addon separately
import * as wickr from 'wickrio_addon';

class MilkBot extends WickrBot {
  constructor(wickr: any, username?: string) {
    super(wickr, username);
    // This will create a new command for /order
    this.listen('order', (msg: WickrMessage, args?: string[]) => {
      // args is an array of all values passed to the command
      let quantity = args?.[1];
      this.orderMilk(quantity);
      this.send(msg.vgroupid, "Okay... I ordered some milk!");
    });
  }

  private orderMilk(quantity?: string): void {
    // Implementation details
    console.log(`Ordering ${quantity || 'some'} milk`);
  }
}

const milkbot = new MilkBot(wickr);
milkbot.start();
```

Or try the [Wickr Bot Cookiecutter template](https://github.com/WickrInc/cookiecutter-wickr-bot):

```bash
cookiecutter gh:WickrInc/cookiecutter-wickr-bot
```

## Development

### Publishing new packages

Use `npm version [patch|minor|major]` to update the version in package.json and create a new commit and tag with the version. If you create a git tag *without* updating the version in package.json, the `npm publish` will fail because of duplicate versions.

# License

This software is distributed under the [Apache License, version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html)

```
   Copyright 2025 Wickr, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
