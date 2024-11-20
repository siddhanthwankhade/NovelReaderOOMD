import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        // Save user data to local storage
        localStorage.setItem('user', JSON.stringify({ username, password }));
        navigate('/home');
    };

    return (
        <div>
            <h1>Register / Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register / Login</button>
        </div>
    );
}

export default RegistrationPage; 