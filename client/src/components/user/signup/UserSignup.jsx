import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { AppBar, Toolbar, Container } from "@mui/material";
import logoImage from './whatsapp-image-20240123-at-1705-1@2x.png'; 
import BackgroundImage from '../../home/1.jpg';
import styled from 'styled-components';


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
		

const UserSignup = () => {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		confirmpassword:""
	});

	
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/product");
			console.log(res.message);
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
			  <img src='/logo.png' alt="Logo" style={{ height: '88px', borderRadius:'20px' ,marginTop: '10px'}} />
			</Toolbar>
		  </AppBar>
		  <Container maxWidth="md" style={{ paddingTop: 60, paddingBottom: 60 }}>
	
			
			<div className={styles.signup_form_container}>
			
				<div className={styles.left}>
					<h1>Already Signup !</h1>
					<Link to="/userlogin">
						<button type="button" className={styles.white_btn}>
							Log in
						</button>
					</Link>
				</div>
				<div className={styles.right}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Create Account</h1>
						<input
							type="text"
							placeholder="Client ID"
							name="id"
							onChange={handleChange}
							value={data.id}
							required
							className={styles.input}
						/>
						<input
							type="text"
							placeholder="Client Name"
							name="name"
							onChange={handleChange}
							value={data.name}
							required
							className={styles.input}
						/>
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
						<input
							type="password"
							placeholder="Confirm Password"
							name="confirmpassword"
							onChange={handleChange}
							value={data.confirmpassword}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<StartButton >signup</StartButton>
					</form>
				
			</div>
		</div>
		</Container>
		</AnimatedBackground>
   
	);
};

export default UserSignup;