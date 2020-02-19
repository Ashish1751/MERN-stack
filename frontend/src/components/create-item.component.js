import React, {Component} from 'react';
import axios from 'axios';

export default class CreateItem extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            quantity: '',
            price: '',
            file: ''
        }
    }
    
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onChangef = (e) => {
        this.setState({ file: e.target.files[0] })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newItem = {
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            email: sessionStorage.getItem('email')
            // file: this.state.file
        }
        if(this.state.file){
            const formData = new FormData()
            formData.append('productImage',this.state.file)
            formData.append('document',JSON.stringify(newItem))

            console.log(formData);
            axios.post(' http://localhost:4000/api/items/upload',formData)
                 .then(res => {console.log(res.data); window.location.reload();})
                 .catch(err => console.log(err));
        } else {
            axios.post('http://localhost:4000/api/items/add', newItem)
                .then(res => {console.log(res.data); window.location.reload();})
                .catch(err => console.log(err));
        }

        this.setState({
            name: '',
            quantity: '',
            price: '',
            file:''
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
                        <label>Price: </label>
                        <input type="file" 
                               className="form-control" 
                               name="productImage"
                               onChange={this.onChangef}
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