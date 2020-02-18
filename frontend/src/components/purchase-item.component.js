import React, {Component} from 'react';
import axios from 'axios';
import $ from 'jquery';

export default class PurchaseItem extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            name: ''
        }
    }

    componentDidMount() {
        $('tbody').on('click', 'tr', function() {
            var tableData = $(this).children("td").map(function(){
                return $(this).text();
            }).get();
            var quan = prompt("Please Enter Quantity: ");
            while(quan === ""){
                alert("Quantity field is required");
                quan = prompt("Please Enter Quantity: ");
            }
            while(Number(quan)>Number(tableData[2])){
                alert("Please give valid input");
                quan = prompt("Please Enter Quantity: ");
            }
            if(quan){
                const newItem = {
                    name: tableData[0],
                    quantity: tableData[1],
                    available: tableData[2],
                    price: tableData[3],
                    email: tableData[4],
                    quant: quan,
                    cemail: sessionStorage.getItem('email')
                }

                axios.post(' http://localhost:4000/api/items/purchase', newItem)
                    .then(res => {console.log(res.data); window.location.reload();})
                    .catch(err => console.log(err));
            }
            // alert(tableData);
        });
    }
    
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSort = (n) => {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("table");
        switching = true;
        dir = "asc";
        while (switching) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
              }
            } else if (dir == "desc") {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
              }
            }
          }
          if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
          } else {
            if (switchcount == 0 && dir == "asc") {
              dir = "desc";
              switching = true;
            }
          }
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        axios.get('/api/items/cust', {
            params: {
              name: this.state.name.toString()
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

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Name of the Product: </label>
                        <input type="text" 
                               className="form-control" 
                               name = "name"
                               required
                               value={this.state.name}
                               onChange={this.onChange}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                    <table id="table" className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th onClick={this.onSort.bind(this,2)}>Available</th>
                            <th onClick={this.onSort.bind(this,3)}>Price</th>
                            <th>Email</th>
                            <th onClick={this.onSort.bind(this,4)}>Rating</th>
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
                                    <td>{currentItem.email}</td>
                                    <td>{currentItem.ratingno===0 ? "0" : currentItem.rating/currentItem.ratingno}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                </form>
            </div>
        )
    }
}