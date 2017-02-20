import React from 'react';
import { mount } from 'enzyme';
import 'sinon';
import { inject } from '../src';
import { createModule } from './mockElm';

describe('elm react tests', () => {
    function handlerA() {}

    class _Test extends React.Component {
        render() {
            const { renderFn, handleClick } = this.props;
            return (
                <div className="test" onClick={ () => handleClick() }>
                    { renderFn() }
                </div>
            );
        }

        handlerA = handlerA;
    }

    const ports = {
        cmdA: { send: () => {} },
        subA: { subscribe: () => {}, unsubscribe: () => {} }
    }

    const module = createModule('elm-mock', ports);

    const Test = inject(module, {
        cmds: { 'handleClick' : 'cmdA' },
        subs: { 'subA' : 'handlerA' },
        as: 'renderFn'
    })(_Test);


    it('mounts elm module', () => {
        const wrapper = mount(<Test />);
        const elmElem = wrapper.getDOMNode().querySelector('#elm-mock');
        expect(elmElem.outerHTML).to.equal('<div id="elm-mock">Elm</div>');
    });

    it('throws an error when triggering a cmd that does not exist', () => {
        const Broken = inject(module, {
            cmds: { 'handleClick': 'cmdNonExistent' },
            as: 'renderFn'
        })(_Test);
        const wrapper = mount(<Broken />);
        expect(() => wrapper.find('.test').simulate('click')).to.throw('cmdNonExistent is not a cmd, mapped from handleClick');
    });

    it('triggers commands', () => {
        const spied = sinon.spy(ports.cmdA, 'send');
        const wrapper = mount(<Test />);
        wrapper.find('.test').simulate('click');
        expect(spied.calledOnce).to.equal(true);
        spied.restore();
    });

    it('throws an error when subscription mapping is not valid', () => {
        const Broken = inject(module, {
            subs: { 'nonExistentSub': 'nonExistentHandler' },
            as: 'renderFn'
        })(_Test);
        expect(() => mount(<Broken />)).to.throw('subscription mapping from nonExistentSub to nonExistentHandler is not valid');
    });

    it('add subscriptions when mounted', () => {
        const spied = sinon.spy(ports.subA, 'subscribe');
        const wrapper = mount(<Test />);
        expect(spied.calledOnce).to.equal(true);
    });

    it('unsubscribe when unmounted', () => {
        const spied = sinon.spy(ports.subA, 'unsubscribe');
        const wrapper = mount(<Test />);
        const instance = wrapper.instance();
        expect(instance.subscriptions).to.have.length(1);
        wrapper.unmount();
        expect(spied.calledOnce).to.equal(true);
        expect(instance.subscriptions).to.have.length(0);
    });
});