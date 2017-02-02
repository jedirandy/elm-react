const module = {
    embed: (node, flags) => {
        const elem = document.createElement('div');
        elem.setAttribute('id', 'elm-mock');
        elem.innerHTML = 'Elm';
        node.appendChild(elem);
        return {
            flags,
            ports: {
                cmdA: {
                    send: () => {}
                },
                subA: {
                    subscribe: () => {},
                    unsubscribe: () => {}
                }
            }
        };
    }
};

export { module };