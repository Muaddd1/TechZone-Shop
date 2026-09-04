import {useState,useEffect} from 'react';

function Users() {
    const[users, setUsers] =useState([]);
    const[loading, setLoading] =useState(true);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch ('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        }
        fetchUsers();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Users;