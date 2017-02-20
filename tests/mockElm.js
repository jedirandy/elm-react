const createModule = (nodeId, ports) => {
    const embed = (node, flags) => {
        const elem = document.createElement('div');
        elem.setAttribute('id', nodeId);
        elem.innerHTML = 'Elm';
        node.appendChild(elem);
        return {
            flags,
            ports
        };
    }
    return { embed };
}


export { module, createModule };