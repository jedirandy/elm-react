import React from 'react';
import { findDOMNode } from 'react-dom';
const inject = (
    src,
    cmds = {},
    subs = {}
) => Container => {
    class ElmContainer extends React.Component {
        render() {
            return <div></div>;
        }

        componentDidMount() {
            const node = findDOMNode(this);
            const elm = src.embed(node, this.props.flags);
            this.props.onDidMount(elm, this);
        }
    }

    return class Wrapper extends React.Component {
        render() {
            // map cmds
            const cmdMap = {};
            Object.keys(cmds).map(from => {
                cmdMap[from] = (...args) => {
                    const to = cmds[from];
                    if (this.elm.ports[to] && this.elm.ports[to].send)
                        this.elm.ports[to].send.apply(null, args);
                    else
                        throw new Error(`${from} is not a cmd!`);
                };
            });

            return React.createElement(Container, {
                elm: <ElmContainer onDidMount={elm => this.elm = elm} />,
                renderElm: (props) => <ElmContainer onDidMount={elm => this.elm = elm} {...props}/>,
                ref: u => { this.underlying = u; },
                ...cmdMap
            });
        }

        componentDidMount() {
            Object.keys(subs).map(from => {
                this.elm && this.elm.ports[from].subscribe((...args) => {
                    const to = subs[from];
                    this.underlying[to](...args);
                });
            });
        }
    };
};
export { inject };
export default inject;