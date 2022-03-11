import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/login-form";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/iuser";
import UserService from "./services/user.service";

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            store.checkAuth();
        }
    }, []);

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) return <h3>Loading...</h3>

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
                <button onClick={getUsers}>Get Users</button>
            </div>
        )
    }

    return (
        <div>
            <h1>{store.isAuth ? `User authorized: ${store.user.email}` : "Authorize!"}</h1>
            <button onClick={() => store.logout()}>Logout</button>
            <div>
                <button onClick={getUsers}>Get Users</button>
            </div>
            {users.map((user) => <div key={user.email}>{user.email}</div>)}
        </div>
    );
}

export default observer(App);
