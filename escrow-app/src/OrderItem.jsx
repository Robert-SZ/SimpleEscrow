/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';

class OrderItem extends React.Component {



    render() {
        const {item}=this.props;
        return (<tr>
            <td>{item.title}</td>
            <td>{item.usedPercentage+'/'+item.amount}</td>
            <td>{item.paticipantsCount}</td>
            <td>{item.usedPercentage<100?<a href="#" onClick={this.props.join}>Join</a>:null}</td>
        </tr>)
    }
}

OrderItem.propTypes={
    join: PropTypes.func.isRequired
};

export default OrderItem