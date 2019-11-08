import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    users: [],
    name: '',
    bio: '',
    error: ''
  };

  fetchUsers = () => {
    axios
      .get('http://localhost:5000/api/users')
      .then(res => {
        this.setState({ users: [...res.data] });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  componentDidMount() {
    this.fetchUsers();
  }

  deleteUser = id => {
    axios
      .delete(`http://localhost:5000/api/users/${id}`, id)
      .then(res => {
        this.fetchUsers();
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    let user = { name: this.state.name, bio: this.state.bio };
    axios
      .post('http://localhost:5000/api/users', user)
      .then(res => {
        this.fetchUsers();
        this.setState({ error: '' });
      })
      .catch(err => {
        this.setState({ error: err.response.data.errorMessage });
      });
    this.setState({ name: '', bio: '' });
  };

  render() {
    const { users } = this.state;
    return (
      <div className="App">
        <div>
          <form className="form" onSubmit={this.handleSubmit}>
            <h1>Add user</h1>
            <input
              type="text"
              placeholder="name"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <input
              type="text"
              placeholder="bio"
              name="bio"
              value={this.state.bio}
              onChange={this.handleChange}
            />
            <button>Add user</button>
          </form>
        </div>
        {users.map(user => (
          <div className="card" key={user.id}>
            <p>Name: {user.name}</p>
            <p>Bio: {user.bio}</p>
            <p>Created: {user.created_at}</p>
            <p>Modified: {user.updated_at}</p>
            <button onClick={() => this.deleteUser(user.id)}>Delete</button>
          </div>
        ))}

        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default App;
