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
        const { renderFn, handleClick } = this.props;
        return (
            <div>
                <button onClick={() => handleClick()}>Click me</button>
                { renderFn({ flags: {} }) }
            </div>
        )
    }

    onSub() {
        // will be called when 'sub' is triggered in the Elm module
    }
}

inject(
    // Elm module to be used
    ElmModule,
    // options
    {
        cmds: {
            'handleClick': 'cmdA' // will inject handleClick into props, when called, will trigger command 'cmdA'
        },
        subs: {
            'sub': 'onSub' // subscribe to 'sub' on the Elm side, the 'onSub' function will be called
        },
        as: 'renderFn' // renderFn will be available in props, to render the Elm module
    }
)(App)
```

To see more details, check out the [example](/example) project!

## API

`inject(module, options)(component)`

* module: the Elm module to be injected into the React component

* options *(object)*
   * cmds *(object)* A mapping of Elm commands where the keys are method names to injected into the React component's props, the values are the command names of the Elm module.
    
   * subs *(object)* A mapping of Elm subscriptions where the keys are subscription names of the Elm module, the values are the React component's method names, when subscriptions are triggered, the mapped methods will be called.
   
   * as *(string)* the name for the render method to be injected into the React component's props

* component *(React Component)*: the React component into which the Elm module is injected
