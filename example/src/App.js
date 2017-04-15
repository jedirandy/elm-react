import React from 'react';
import { inject } from '../../src';
import { Counter } from './Counter.elm';

export class App extends React.Component {
    render() {
        const { renderCounter } = this.props;
        return (
            <div className="new-counter">
                <button onClick={() => this.props.inc(null)}>+</button>
                    { renderCounter() }
                <button onClick={() => this.props.dec(null)}>-</button>
            </div>
        );
    }

    onInc(v) {
        console.log('incrementing', v);
    }

    onDec(v) {
        console.log('decrementing', v);
    }
}

export default inject(
    Counter,
    {
        send: {
            'inc': 'inc',
            'dec': 'dec'
        },
        subscribe: {
            'notifyInc': 'onInc',
            'notifyDec': 'onDec'
        },
        as: 'renderCounter'
    }
)(App);