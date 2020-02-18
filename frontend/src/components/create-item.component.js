import React, {Component} from 'react';
import axios from 'axios';

export default class CreateItem extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            quantity: '',
            price: ''
        }
    }
    
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            email: sessionStorage.getItem('email')
        }

        console.log(newItem);
        axios.post(' http://localhost:4000/api/items/add', newItem)
             .then(res => console.log(res.data))
             .catch(err => console.log(err));

        this.setState({
            name: '',
            quantity: '',
            price: ''
        });
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
                               value={this.state.username}
                               onChange={this.onChange}
                               />
                    </div>
                    <div className="form-group">
                        <label>Quantity: </label>
                        <input type="Number" 
                               className="form-control" 
                               name = "quantity"
                               required
                               min="1"
                               value={this.state.quantity}
                               onChange={this.onChange}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Price: </label>
                        <input type="Number" 
                               className="form-control" 
                               name="price"
                               required
                               min="1"
                               value={this.state.price}
                               onChange={this.onChange}
                               />  
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Item" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}