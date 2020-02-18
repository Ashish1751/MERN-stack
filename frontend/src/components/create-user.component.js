import React, {Component} from 'react';
import axios from 'axios';

export default class CreateUser extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            user_type: '',
            password: ''
        }
    }
    
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            user_type: this.state.user_type,
            password: this.state.password
        }

        console.log(newUser);
        axios.post('/api/users/add', newUser)
             .then(res => console.log(res.data));

        this.setState({
            username: '',
            email: '',
            user_type: '',
            password: ''
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text" 
                               className="form-control" 
                               name = "username"
                               required
                               value={this.state.username}
                               onChange={this.onChange}
                               />
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <input type="email" 
                               className="form-control" 
                               name = "email"
                               required
                               value={this.state.email}
                               onChange={this.onChange}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="password" 
                               className="form-control" 
                               name="password"
                               required
                               value={this.state.password}
                               onChange={this.onChange}
                               />  
                    </div>
                    <div className="form-group">
                        <label>Type of User: </label>
                        <select 
                               className="form-control" 
                               name="user_type"
                               required
                               value={this.state.user_type}
                               onChange={this.onChange}>
                                   <option value="">Select</option>
                                   <option value="Vendor">Vendor</option>
                                   <option value="Customer">Customer</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}