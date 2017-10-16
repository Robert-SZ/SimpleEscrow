import React from 'react';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import OrderItem from '../OrderItem'

describe('App Tests', () => {
    test('Show request item', () => {
        let item={
            id: 1,
            title: 'Test Title',
            amount: 100,
            usedPercentage: 0,
            paticipantsCount: 0
        };
        const tree = renderer.create(<OrderItem item={item} join={jest.fn}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('Show join button', ()=>{
        let item={
            id: 1,
            title: 'Test Title',
            amount: 100,
            usedPercentage: 0,
            paticipantsCount: 1
        };
        const renderedComponent = shallow(<OrderItem item={item} join={jest.fn}/>);
        expect(renderedComponent.find('a').length).toBe(1);
    })
    test('Hide join button', ()=>{
        let item={
            id: 1,
            title: 'Test Title',
            amount: 100,
            usedPercentage: 100,
            paticipantsCount: 1
        };
        const renderedComponent = shallow(<OrderItem item={item} join={jest.fn}/>);
        expect(renderedComponent.find('a').length).toBe(0);
    })

});