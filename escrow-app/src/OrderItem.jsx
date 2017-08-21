/**
 * Created by RobertSabiryanov on 16.08.17.
 */
import React from 'react';
import PropTypes from 'prop-types';

class OrderItem extends React.Component {



    render() {
        const {item}=this.props;
        const calcedValue=((item.usedPercentage*item.amount)/100).toFixed(2);
        return (<tr>
            <td>{item.title}</td>
            <td>{calcedValue+'/'+item.amount}&nbsp;ETH</td>
            <td>{item.paticipantsCount}</td>
            <td>{item.usedPercentage<100?<a href="#" onClick={()=>{this.props.join(item.id)}}>Join</a>:null}</td>
        </tr>)
    }
}

OrderItem.propTypes={
    join: PropTypes.func.isRequired
};

export default OrderItem