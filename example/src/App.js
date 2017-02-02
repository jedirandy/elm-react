import React from 'react';
import { inject } from '../../src';
import { Counter } from './Counter.elm';

export class App extends React.Component {
    render() {
        const { renderElm } = this.props;
        return (
            <div className="new-counter">
                <button onClick={() => this.props.inc(null)}>+</button>
                    { renderElm() }
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
        'inc': 'inc',
        'dec': 'dec'
    },
    {
        'notifyInc': 'onInc'
    }
)(App);