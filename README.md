# Elm React

[![Build Status](https://travis-ci.org/jedirandy/elm-react.svg?branch=master)](https://travis-ci.org/jedirandy/elm-react)
[![npm module](https://badge.fury.io/js/elm-react.svg)](https://www.npmjs.org/package/elm-react)

Connect Elm modules with React apps, Elm commands and subscriptions are injected as React component's properties.

## Install
```sh
npm install elm-react
```

## Usage
```javascript
import React from 'react'
import { inject } from 'elm-react'
import { ElmModule } from './ElmModule.elm'

class App extends React.Component {
    render() {
        return (
            <div>
                { renderFn({ flags: {} }) }
            </div>
        )
    }

    onSub() {
        // ...
    }
}

inject(
    // Elm module to be used
    ElmModule,
    // options
    {
        cmds: {
            'cmd': 'fn' // will inject Elm module's command to React component's props as a function
        },
        subs: {
            'sub': 'onSub' // subscribe to 'sub' on the Elm side, the 'onSub' function will be called
        },
        as: 'renderFn'
    }
)
```

To see more details, check out the [example](/example) project!