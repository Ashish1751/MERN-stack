import React, {Component} from 'react';
import axios from 'axios';

export default class UsersList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {users: []}
    }

    componentDidMount() {
        axios.get('/api/users')
             .then(response => {
                 this.setState({users: response.data});
             })
             .catch(function(error) {
                 console.log(error);
             })
    }

    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Type of User</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.users.map((currentUser, i) => {
                            return (
                                <tr>
                                    <td>{currentUser.username}</td>
                                    <td>{currentUser.email}</td>
                                    <td>{currentUser.password}</td>
                                    <td>{currentUser.user_type}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}