import React from 'react';
import { mount } from 'enzyme';
import 'sinon';
import { inject } from '../src';
import { createModule } from './mockElm';

describe('elm react tests', () => {
    function handleA() {}

    class _Test extends React.Component {
        render() {
            const { renderFn, handleClick } = this.props;
            return (
                <div className="test" onClick={ () => handleClick() }>
                    { renderFn() }
                </div>
            );
        }

        handleA = handleA;
    }

    const ports = {
        sendable: { send: () => {} },
        subscribable: { subscribe: () => {}, unsubscribe: () => {} }
    };

    const module = createModule('elm-mock', ports);

    const Test = inject(module, {
        send: { 'sendable' : 'handleClick' },
        subscribe: { 'subscribable': 'handleA' },
        as: 'renderFn'
    })(_Test);


    it('mounts elm module', () => {
        const wrapper = mount(<Test />);
        const elmElem = wrapper.getDOMNode().querySelector('#elm-mock');
        expect(elmElem.outerHTML).to.equal('<div id="elm-mock">Elm</div>');
    });

    it('throws an error when triggering a send that does not exist', () => {
        const Broken = inject(module, {
            send: { 'wrongSendable': 'handleClick' },
            as: 'renderFn'
        })(_Test);
        const wrapper = mount(<Broken />);
        expect(() => wrapper.find('.test').simulate('click')).to.throw('wrongSendable is not a valid port for sending');
    });

    it('triggers commands', () => {
        const spied = sinon.spy(ports.sendable, 'send');
        const wrapper = mount(<Test />);
        wrapper.find('.test').simulate('click');
        expect(spied.calledOnce).to.equal(true);
        spied.restore();
    });

    it('throws an error when subscription mapping is not valid', () => {
        const Broken = inject(module, {
            subscribe: { 'nonExistent': 'nonExistentHandler' },
            as: 'renderFn'
        })(_Test);
        expect(() => mount(<Broken />)).to.throw('nonExistent is not a valid port for subscribing');
    });

    it('add subscriptions when mounted', () => {
        const spied = sinon.spy(ports.subscribable, 'subscribe');
        mount(<Test />);
        expect(spied.calledOnce).to.equal(true);
    });

    it('unsubscribe when unmounted', () => {
        const spied = sinon.spy(ports.subscribable, 'unsubscribe');
        const wrapper = mount(<Test />);
        const instance = wrapper.instance();
        expect(instance.subscriptions).to.have.length(1);
        wrapper.unmount();
        expect(spied.calledOnce).to.equal(true);
        expect(instance.subscriptions).to.have.length(0);
    });
});