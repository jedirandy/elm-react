import React from 'react';
import { findDOMNode } from 'react-dom';

const inject = (component, {
    cmds = {},
    subs = {},
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
            // map cmds
            const cmdMap = {};
            Object.keys(cmds).forEach(from => {
                cmdMap[from] = (...args) => {
                    const to = cmds[from];
                    if (this.elm.ports[to] && this.elm.ports[to].send)
                        this.elm.ports[to].send.apply(null, args);
                    else
                        throw new Error(`${to} is not a cmd, mapped from ${from}`);
                };
            });

            return React.createElement(Container, {
                elm: <ElmContainer onDidMount={elm => this.elm = elm} />,
                [as]: (props) => <ElmContainer onDidMount={elm => this.elm = elm} {...props}/>,
                ref: wrapped => { this.wrapped = wrapped; },
                ...cmdMap
            });
        }

        componentDidMount() {
            Object.keys(subs).forEach(from => {
                if (this.elm) {
                    const to = subs[from];
                    if (typeof this.elm.ports[from] === 'object' && typeof this.wrapped[to] === 'function') {
                        const handler = (...args) => this.wrapped[to](...args);
                        this.elm.ports[from].subscribe(handler);
                        this.subscriptions.push({
                            from,
                            handler
                        });
                    }
                    else
                        throw new Error(`subscription mapping from ${from} to ${to} is not valid`);
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