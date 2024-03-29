import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import Lyrics from '../Lyrics';

class Admin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			users: [],
		};
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.users().on('value', snapshot => {
			const usersObject = snapshot.val();

			const usersList = Object.keys(usersObject).map(key => ({
				...usersObject[key],
				uid: key,
			}));

			this.setState({
				users: usersList,
				loading: false,
			});
		});
	}

	componentWillUnmount() {
		this.props.firebase.users().off();
	}

	render() {
		const { users, loading } = this.state;
	
		return (
			<div className="container-fluid mt-5">
				<h1>Admin Page</h1>
				<p>
					The admin page is accessible by everyone who is signed in as an Admin user.
				</p>
				{loading && <div>Loading ...</div>}

				<UserList users={users} />
				
				<Lyrics />
			</div>
		);
	}
}

const UserList = ({ users }) => (
	<ul>
		{users.map(user => (
			<li key={user.uid}>
				<span>
					<strong>ID:</strong> {user.uid}
				</span>
				<span>
					<strong>&nbsp;Email:</strong> {user.email}
				</span>
				<span>
					<strong>&nbsp;Username:</strong> {user.username}
				</span>
			</li>
		))}
	</ul>
);

const condition = authUser =>
	authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
	withAuthorization(condition),
	withFirebase,
)(Admin);