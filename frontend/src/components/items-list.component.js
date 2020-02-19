import React, {Component, Fragment} from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class ItemsList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            show: "0"
        }
    }

    componentDidMount() {
        axios.get('/api/items', {
            params: {
              email: sessionStorage.getItem('email'),
              show: this.state.show
            } })
             .then(response => {
                //  console.log(sessionStorage.getItem('token'));
                //  console.log(sessionStorage.getItem('email'));
                //  console.log(sessionStorage.getItem('type'));
                //  console.log(response.data);
                 this.setState({items: response.data});
             })
             .catch(function(error) {
                 console.log(error);
             })
        $('tbody').on('click', '#cancel', function() {
           var tableData = $(this).siblings("td").map(function(){
               if($(this).text()) return $(this).text();
           }).get();
           const newItem = {
                name: tableData[0],
                quantity: tableData[1],
                available: tableData[2],
                price: tableData[3],
                status: tableData[4],
                email: sessionStorage.getItem('email')
           }
           console.log(newItem);
           axios.post(' http://localhost:4000/api/items/cancel', newItem)
                    .then(res => {console.log(res.data); window.location.reload();})
                    .catch(err => console.log(err));
        //    alert(tableData);
        });

        $('tbody').on('click', '#dispatch', function() {
            var tableData = $(this).siblings("td").map(function(){
                if($(this).text()) return $(this).text();
            }).get();
            const newItem = {
                 name: tableData[0],
                 quantity: tableData[1],
                 available: tableData[2],
                 price: tableData[3],
                 status: tableData[4],
                 email: sessionStorage.getItem('email')
            }
            console.log(newItem);
            axios.post(' http://localhost:4000/api/items/dispatch', newItem)
                     .then(res => {console.log(res.data); window.location.reload();})
                     .catch(err => console.log(err));
            // alert(tableData);
         });
    }

    componentDidUpdate(prevProps,prevState){
        if(this.state.show!== prevState.show){
            axios.get('/api/items', {
                params: {
                  email: sessionStorage.getItem('email'),
                  show: this.state.show
                } })
                 .then(response => {
                     console.log(sessionStorage.getItem('token'));
                     console.log(sessionStorage.getItem('email'));
                     console.log(response.data);
                     this.setState({items: response.data});
                 })
                 .catch(function(error) {
                     console.log(error);
                 })
        }
    }
    
    change = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    // onDisp = () => {
    //     alert('hi');
    // }

    // onCancel = () => {
    //     alert('hello');
    // }

    render() {
        return (
            <div>
                <div onClick={this.change}>
                  <button name="show" value="0" defaultChecked className="btn btn-primary">Show Orders</button>&nbsp;&nbsp;
                  <button name="show" value="1" className="btn btn-primary">Show ready to Dispatch</button>&nbsp;&nbsp;
                  <button name="show" value="2" className="btn btn-primary">Show Dispatched</button>
                </div>
                <br />
                <br />
                {this.state.show==="0"?
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Available</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>0</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.items.map((currentItem, i) => {
                            return (
                                <tr key={i}>
                                    <td>{currentItem.name}</td>
                                    <td>{currentItem.quantity}</td>
                                    <td>{currentItem.available}</td>
                                    <td>{currentItem.price}</td>
                                    <td>{currentItem.status}</td>
                                    {currentItem.status!=="Cancelled" ?
                                    <td id="cancel"><button className="btn btn-primary">Cancel</button></td> : <td></td>}
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>: this.state.show==="1" ?
                <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.state.items.map((currentItem, i) => {
                        return (
                            <tr key={i}>
                                <td>{currentItem.name}</td>
                                <td>{currentItem.quantity}</td>
                                <td>{currentItem.available}</td>
                                <td>{currentItem.price}</td>
                                <td>{currentItem.status}</td>
                                {(currentItem.status==="Cancelled" || currentItem.status==="Dispatched") ? <Fragment> <td></td><td></td></Fragment> : <Fragment>
                                <td id="dispatch"><button className="btn btn-primary">Dispatch</button></td>
                                <td id="cancel"><button className="btn btn-primary">Cancel</button></td></Fragment>}
                            </tr>
                        )
                    })
                }
                </tbody>
            </table> :
            <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
            { 
                this.state.items.map((currentItem, i) => {
                    return (
                        <tr key={i}>
                            <td>{currentItem.name}</td>
                            <td>{currentItem.quantity}</td>
                            <td>{currentItem.price}</td>
                            <td>{currentItem.status}</td>
                            <td>{currentItem.ratingno===0 ? "0" : currentItem.rating/currentItem.ratingno}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table> }
            </div>
        )
    }
}