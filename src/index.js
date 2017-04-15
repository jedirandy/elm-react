import React from 'react';
import { findDOMNode } from 'react-dom';

const inject = (component, {
    send = {},
    subscribe = {},
    as = 'renderElm'
}) => Container => {
    class ElmContainer extends React.Component {
        render() {
            return <div></div>;
        }

        shouldComponentUpdate() {
            return false;
        }

        componentDidMount() {
            const node = findDOMNode(this);
            const elm = component.embed(node, this.props.flags);
            this.props.onDidMount(elm, this);
        }
    }

    return class Wrapper extends React.Component {
        constructor(props) {
            super(props);
            this.subscriptions = [];
        }

        render() {
            const sendables = {};
            Object.keys(send).forEach(from => {
                const to = send[from];
                sendables[to] = (...args) => {
                    if (this.elm.ports[from] && this.elm.ports[from].send)
                        this.elm.ports[from].send.apply(null, args);
                    else
                        throw new Error(`${from} is not a valid port for sending`);
                };
            });

            return React.createElement(Container, {
                [as]: (props) => <ElmContainer onDidMount={elm => this.elm = elm} {...props}/>,
                ref: wrapped => { this.wrapped = wrapped; },
                ...sendables
            });
        }

        componentDidMount() {
            Object.keys(subscribe).forEach(from => {
                if (this.elm) {
                    const to = subscribe[from];
                    if (typeof this.elm.ports[from] === 'object' && typeof this.wrapped[to] === 'function') {
                        const handler = (...args) => this.wrapped[to](...args);
                        this.elm.ports[from].subscribe(handler);
                        this.subscriptions.push({
                            from,
                            handler
                        });
                    }
                    else
                        throw new Error(`${from} is not a valid port for subscribing`);
                }
            });
        }

        componentWillUnmount() {
            this.subscriptions.forEach(({ from, handler }) => this.elm.ports[from].unsubscribe(handler));
            this.subscriptions = [];
        }
    };
};

export { inject as default, inject };