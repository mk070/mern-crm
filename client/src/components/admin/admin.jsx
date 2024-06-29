import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from './styles.module.css';
import { AppBar, Toolbar, Container } from "@mui/material";
import styled from 'styled-components';
import BackgroundImage from '../home/1.jpg'
// import logoImage from '/logo.png'; 

const AnimatedBackground = styled.div`
		min-height: 100vh;background: linear-gradient(to bottom, rgba(78, 101, 255, 0.8), rgba(146, 239, 253, 0.8)), url(${BackgroundImage}) no-repeat center center fixed;background-size: cover;`;

		const StartButton = styled.button`
  font-size: 1.0rem;
  padding: 1rem 2.8rem;
  color: white;
 margin-top: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const AdminLogin = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/admin_auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/dashboard";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
		<AnimatedBackground>
		<AppBar position="static" color="transparent" elevation={0}>
		  <Toolbar>
			<img src="/logo.png" alt="Logo" style={{ height: '88px', borderRadius: '20px' ,marginTop: '10px'}} />
		  </Toolbar>
		</AppBar>
		 <Container maxWidth="md" style={{ paddingTop: 60, paddingBottom: 60 }}>

		
			
			<div className={styles.login_form_container}>
			
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Admin login</h1>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<StartButton>Login</StartButton>
					</form>
				</div>
				
			</div>
		
		
		</Container>
		</AnimatedBackground>
	);
};

export default AdminLogin;
