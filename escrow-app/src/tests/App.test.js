import React from 'react';
import {shallow} from 'enzyme';
import App from '../App'

jest.mock('../EscrowService');

describe('App Tests', () => {
    test('Show Metamask initing text', () => {
        const renderedComponent = shallow(<App/>);
        expect(renderedComponent.find('strong').text()).toBe('Please wait while Metamask is inited');
    });
    test('Show Metamask init error', () => {
        const renderedComponent = shallow(<App/>);
        renderedComponent.setState({metaMask: {init: false, error:true}});
        expect(renderedComponent.find('strong').text()).toBe('Can\'t init Metamask. Please install Metamask before');
    });
    test('Show Create a Request button when requests list is empty ', () => {
        const renderedComponent = shallow(<App/>);
        renderedComponent.setState({metaMask: {init: false}, loader: false, orders: {showEmpty: true}});
        expect(renderedComponent.find('.btn .btn-primary').length).toBe(1);
    });
    test('Show orders table', () => {
        const renderedComponent = shallow(<App/>);
        renderedComponent.setState({metaMask: {init: false}, loader: false, orders: {showEmpty: false, items: [1]}});
        //console.log(renderedComponent.debug());
        expect(renderedComponent.find('OrdersTable').length).toBe(1);
    });
});