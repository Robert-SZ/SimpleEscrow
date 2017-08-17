/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import OrderItem from './OrderItem'

import {Table} from 'react-bootstrap'

class OrdersTable extends React.Component {
    render() {
        const items = this.props.items.map(item =>
            <OrderItem item={item} join={this.props.join}/>
        );
        return (<Table striped bordered condensed hover>
            <thead>
            <tr>
                <th>Title</th>
                <th>Escrowed current/required</th>
                <th>Participants</th>
                <th>Join</th>
            </tr>
            </thead>
            <tbody>
                {items}
            </tbody>
        </Table>)
    }
}

OrdersTable.propTypes={
    join: PropTypes.func.isRequired
};

export default OrdersTable;