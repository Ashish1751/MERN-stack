import React, {Component} from 'react';
import axios from 'axios';

export default class PurchaseItem extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            email: ''
        }
    }
    
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        axios.get('/api/items/review', {
            params: {
              email: this.state.email.toString()
            } })
             .then(response => {
                //  console.log(sessionStorage.getItem('token'));
                //  console.log(sessionStorage.getItem('email'));
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
                               name = "email"
                               required
                               value={this.state.email}
                               onChange={this.onChange}
                               />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Search" className="btn btn-primary"/>
                    </div>
                    <p>Note: Please give valid exact vendor email id.</p>
                    <table id="table" className="table table-striped">
                    <thead>
                        <tr>
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.items.map((currentItem, i) => {
                            return (
                                currentItem.review.map((no,j) => {
                                    return (
                                <tr key={i,j}>
                                    <td>{no}</td>
                                </tr>
                            )})
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