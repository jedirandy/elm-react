# Elm React

[![Build Status](https://travis-ci.org/jedirandy/elm-react.svg?branch=master)](https://travis-ci.org/jedirandy/elm-react)
[![npm module](https://badge.fury.io/js/elm-react.svg)](https://www.npmjs.org/package/elm-react)

A library for using Elm modules in your React components

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
        const { renderElm, handleClick } = this.props;
        return (
            <div>
                <button onClick={() => handleClick()}>Click me</button>
                { renderElm({ flags: {} }) }
            </div>
        )
    }

    onScroll(args) {
        // ...
    }
}

inject(
    // Elm module to be used
    ElmModule,
    // options
    {
        send: {
          'click': 'handleClick' // Pass 'handleClick' to App's props, which is bound with the 'click' port of ElmModule for sending messages
        },
        subscribe: {
          'scroll': 'onScroll' // subscribe to the 'scroll' port, use 'onScroll' as callback
        },
        as: 'renderElm' // renderElm will be available in App's props, to render ElmModule
    }
)(App)
```

Check out [this project](/example) for a working example!

## API

`inject(module, options)(component)`

* module: the Elm module to be injected into the React component

* options *(object)*
   * send *(object)* Each key-value pair is a mapping from the Elm module's port, to the function name that will be passed to the React component's props, that function can be used to send a message to that port
    
   * subscribe *(object)* Subscribe to an Elm port, each key-value pair is a mapping from the Elm module's port name to the callback name of the React Component 
   
   * as *(string)* the name of the render method to be injected into the React component's props

* component *(React Component)*: the React component into which the Elm module is injected
