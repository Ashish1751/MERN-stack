import React, {Component} from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            email: this.state.email,
            password: this.state.password
        }

        axios.post('/api/auth', newUser)
             .then(res => {
                 console.log(res.data.user.type);
                sessionStorage.setItem('token', res.data.token);
                sessionStorage.setItem('email',res.data.user.email);
                sessionStorage.setItem('type',res.data.user.type);
                console.log(sessionStorage.getItem('type'));
                // this.changeState(sessionStorage.getItem('token'),true,false);
                 {sessionStorage.getItem('type')==="Vendor" ? window.open('http://localhost:3000/items', "_self") : window.open('http://localhost:3000/citems', "_self")}
                });

        this.setState({
            email: '',
            password: ''
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
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
                        <input type="submit" value="Login" className="btn btn-primary"/>
                    </div>
                </form>
            </div>
        )
    }
}

//PropTypes
// Login.propTypes = {
//     state: React.PropTypes.object
// }