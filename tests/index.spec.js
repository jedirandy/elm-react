import React from 'react';
import { mount } from 'enzyme';
import { inject } from '../src';
import { module } from './mockElm';

class _Test extends React.Component {
    render() {
        const { renderElm } = this.props;
        return (
            <div className="test">
                { renderElm() }
            </div>
        );
    }

    subA() {}
}

const Test = inject(module, { 'cmdA' : 'cmdA' }, { 'subA' : 'subA' })(_Test);

describe('inject', () => {
    it('mounts elm module', () => {
        const wrapper = mount(<Test />);
        const elmElem = wrapper.getDOMNode().querySelector('#elm-mock');
        expect(elmElem.outerHTML).to.equal('<div id="elm-mock">Elm</div>');
    });
});