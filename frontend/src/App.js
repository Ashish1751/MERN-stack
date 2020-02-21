import React, { Component,Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/users-list.component'
import CreateUser from './components/create-user.component'
import ItemsList from './components/items-list.component'
import CitemsList from './components/citems-list.component'
import Login from './components/login.component'
import CreateItem from './components/create-item.component'
import PurchaseItem from './components/purchase-item.component'
import Review from './components/review.component'

class App extends Component {
  state = {
    token: sessionStorage.getItem('token'),
    isAuthenicated: 'false',
    isLoading: false
  };

  changeState = (e) => {
    this.setState({
      // token: d,
      isAuthenicated: e,
      // isLoading: f
    });
  };

  logoutfunc = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('type');
    console.log(sessionStorage.getItem('token'));
    window.open('http://localhost:3000/login', "_self");
  }
  
  render(){
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Build Purchase App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Users</Link>
                </li>
                {!sessionStorage.getItem('token') ?
                <Fragment>
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li> 
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create User</Link>
                </li> </Fragment> : sessionStorage.getItem('type')==="Vendor" ?  <Fragment>
                <li className="navbar-item">
                  <Link to="/items" className="nav-link">Items List</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/add" className="nav-link">Add Item</Link>
                </li> 
                <li className="navbar-item"><Link onClick={this.logoutfunc} to="#" className="nav-link">Logout</Link></li>
                </Fragment> : <Fragment>
                <li className="navbar-item">
                  <Link to="/citems" className="nav-link">Items List</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/purchase" className="nav-link">Purchase Item</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/review" className="nav-link">Vendor Review</Link>
                </li>
                <li className="navbar-item"><Link onClick={this.logoutfunc} to="#" className="nav-link">Logout</Link></li>
                </Fragment>} 
              </ul>
            </div>
          </nav>

          <br/>
          <Route path="/" exact component={UsersList}/>
          <Route path="/create" component={CreateUser}/>
          <Route path="/items" authi={this.state.isAuthenicated} component={ItemsList}/>
          <Route path="/citems" authi={this.state.isAuthenicated} component={CitemsList}/>
          <Route path="/login" state={this.state} changeState={this.changeState} component={Login}/>
          <Route path="/add" component={CreateItem}/>
          <Route path="/purchase" component={PurchaseItem}/>
          <Route path="/review" component={Review}/>
        </div>
      </Router>
    );
  }
}

export default App;
