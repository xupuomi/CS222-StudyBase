import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './signUp.css';

interface FormData {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
}

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Handling submit...');
        console.log(formData);
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', formData);
            console.log('Sign Up success', response);
            window.location.href = '/signin';
        } catch (error) {
            console.error('Error signing up:', error);
            setErrorMessage('Error signing up. Please try again.');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form id="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                /><br />
                <button type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;
