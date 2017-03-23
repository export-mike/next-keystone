import React, { Component } from 'react';
import Link from 'next/link';
import list from '../list';

const getUsers = async () => list('User').model.find();

export default class Index extends Component {
	static async getInitialProps ({ req, res, query }) {
		const users = await getUsers();
		return { users };
	}

	render () {
		return (
			<ul>
				<li><Link href="/b" as="/a"><a>a</a></Link></li>
				<li><Link href="/a" as="/b"><a>b</a></Link></li>
				{this.props.users.map(user => <li>{ user.email }</li>)}
			</ul>
		);
	}
}
