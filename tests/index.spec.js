import React from 'react';
import { mount } from 'enzyme';
import { inject } from '../src';
import { module } from './mockElm';

class _Test extends React.Component {
    render() {
        const { renderFn } = this.props;
        return (
            <div className="test">
                { renderFn() }
            </div>
        );
    }

    subA() {}
}

const Test = inject(module, {
    cmds: { 'cmdA' : 'cmdA' },
    subs: { 'subA' : 'subA' },
    as: 'renderFn'
})(_Test);

describe('inject', () => {
    it('mounts elm module', () => {
        const wrapper = mount(<Test />);
        const elmElem = wrapper.getDOMNode().querySelector('#elm-mock');
        expect(elmElem.outerHTML).to.equal('<div id="elm-mock">Elm</div>');
    });
});