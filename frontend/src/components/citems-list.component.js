import React, {Component} from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class ItemsList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            show: "0",
            rating:0,
            prating:0,
            review:0
        }
    }

    componentDidMount() {
        console.log(sessionStorage.getItem('type'));
        axios.get('/api/items/citems', {
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
        
        $('tbody').on('click', '#edit', function() {
            var tableData = $(this).siblings("td").map(function(){
                return $(this).text();
            }).get();
            var quan = prompt("Please Enter Quantity: ");
            while(quan === ""){
                alert("Quantity field is required");
                quan = prompt("Please Enter Quantity: ");
            }
            while(Number(quan)>(Number(tableData[2])+Number(tableData[3]))){
                alert("Please give valid input");
                quan = prompt("Please Enter Quantity: ");
            }
            if(quan){
                const newItem = {
                    name: tableData[0],
                    quantity: tableData[1],
                    oquantity: tableData[2],
                    available: tableData[3],
                    price: tableData[4],
                    status: tableData[5],
                    email: tableData[6],
                    quant: quan,
                    cemail: sessionStorage.getItem('email')
                }
                axios.post(' http://localhost:4000/api/items/edit', newItem)
                    .then(res => { window.location.reload();console.log(res.data);})
                    .catch(err => console.log(err));
            }
         });

         $('tbody').on('click', '#prating', function() {
            var tableData = $(this).siblings("td").map(function(){
                return $(this).text();
            }).get();
            var quan = prompt("Please Enter Rating: ");
            while(quan === ""){
                alert("Rating field is required");
                quan = prompt("Please Enter Rating: ");
            }
            if(quan){
                const newItem = {
                    name: tableData[0],
                    quan: quan
                }
                axios.post(' http://localhost:4000/api/items/prating', newItem)
                    .then(res => { window.location.reload();console.log(res.data);})
                    .catch(err => console.log(err));
            }
         });

         $('tbody').on('click', '#rating', function() {
            var tableData = $(this).siblings("td").map(function(){
                return $(this).text();
            }).get();
            var quan = prompt("Please Enter Rating: ");
            while(quan === ""){
                alert("Rating field is required");
                quan = prompt("Please Enter Rating: ");
            }
            if(quan){
                const newItem = {
                    email: tableData[6],
                    rating: tableData[8],
                    quan: quan
                }
            console.log(newItem);
                
                axios.post(' http://localhost:4000/api/items/rating', newItem)
                    .then(res => { window.location.reload();console.log(res.data);this.setState({rating:1})})
                    .catch(err => console.log(err));
            }
         });
         $('tbody').on('click', '#review', function() {
            var tableData = $(this).siblings("td").map(function(){
                return $(this).text();
            }).get();
            var quan = prompt("Please Give your Review: ");
            while(quan === ""){
                alert("Field is required");
                quan = prompt("Please Give your Review: ");
            }
            if(quan){
                const newItem = {
                    name: tableData[0],
                    quantity: tableData[1],
                    oquantity: tableData[2],
                    available: tableData[3],
                    price: tableData[4],
                    status: tableData[5],
                    email: tableData[6],
                    quant: quan,
                    cemail: sessionStorage.getItem('email')
                }
            console.log(newItem);
                
                axios.post(' http://localhost:4000/api/items/reviews', newItem)
                    .then(res => { window.location.reload();console.log(res.data);this.setState({rating:1})})
                    .catch(err => console.log(err));
            }
         });
    }

    componentDidUpdate(prevProps,prevState){
        if(this.state.show!== prevState.show){
            axios.get('/api/items/citems', {
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

    render() {
        return (
            <div>
                <div onClick={this.change}>
                  <button name="show" value="0" defaultChecked className="btn btn-primary">Show Orders</button>&nbsp;&nbsp;
                  <button name="show" value="1" className="btn btn-primary">Show ready to Dispatch</button>&nbsp;&nbsp;
                  <button name="show" value="2" className="btn btn-primary">Show Dispatched</button>&nbsp;&nbsp;
                  <button name="show" value="3" className="btn btn-primary">Show Cancelled</button>
                </div>
                <br />
                <br />
                {this.state.show==="0"?
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Ordered Quantity</th>
                            <th>Available</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Email</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.items.map((currentItem, i) => {
                            console.log(i);
                            console.log(currentItem.bought);
                            console.log(currentItem.bought[i]);
                            return (                                   
                                currentItem.bought.map((no,j) => {
                                    console.log(no)
                                    return (
                                        <tr key={i,j}>
                                            <td>{currentItem.name}</td>
                                            <td>{currentItem.quantity}</td>
                                            <td key={j}>{no.quantity}</td>
                                            <td>{currentItem.available}</td>
                                            <td>{currentItem.price}</td>
                                            <td>{currentItem.status}</td>
                                            <td>{currentItem.email}</td>
                                            <td id="edit"><button style={{"width": "9vw", "border-radius":"5%"}}>Edit Order</button></td>
                                            {this.state.rating===0 ? <td id="rating"><button style={{"width": "9vw", "border-radius":"5%"}}>Give Vendor Rating</button></td> : <td></td>}
                                        </tr>
                                    )
                                })
                            )
                        })
                    }
                    </tbody>
                </table>: this.state.show==="2" ?
                <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Ordered Quantity</th>
                        <th>Available</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.state.items.map((currentItem, i) => {
                        return (
                            currentItem.bought.map((no,j) => {
                                return (
                                    <tr key={i,j}>
                                        <td>{currentItem.name}</td>
                                        <td>{currentItem.quantity}</td>
                                        <td key={j}>{no.quantity}</td>
                                        <td>{currentItem.available}</td>
                                        <td>{currentItem.price}</td>
                                        <td>{currentItem.status}</td>
                                        <td>{currentItem.email}</td>
                                        <td id="rating"><button style={{"width": "9vw", "border-radius":"5%"}}>Give Vendor Rating</button></td>
                                        <td id="prating"><button style={{"width": "9vw", "border-radius":"5%"}}>Give Product Rating</button></td>
                                        <td id="review"><button style={{"width": "9vw", "border-radius":"5%"}}>Give Product Review</button></td>
                                    </tr>
                                )
                            })
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
                        <th>Ordered Quantity</th>
                        <th>Available</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                { 
                    this.state.items.map((currentItem, i) => {
                        return (
                            currentItem.bought.map((no,j) => {
                                return (
                                    <tr key={i,j}>
                                        <td>{currentItem.name}</td>
                                        <td>{currentItem.quantity}</td>
                                        <td key={j}>{no.quantity}</td>
                                        <td>{currentItem.available}</td>
                                        <td>{currentItem.price}</td>
                                        <td>{currentItem.status}</td>
                                        <td>{currentItem.email}</td>
                                        <td id="rating"><button style={{"width": "9vw", "border-radius":"5%"}}>Give Vendor Rating</button></td>
                                    </tr>
                                )
                            })
                        )
                    })
                }
                </tbody>
            </table> }
            </div>
        )
    }
}