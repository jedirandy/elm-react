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
}

export default inject(
    Counter,
    {
        cmds: {
            'inc': 'inc',
            'dec': 'dec'
        },
        subs: {
            'notifyInc': 'onInc'
        },
        as: 'renderCounter'
    }
)(App);