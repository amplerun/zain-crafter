import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Login.css';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleGoogleLogin = () => {
    // Google OAuth implementation would go here
    console.log('Google login clicked');
  };
  const handlePhoneLogin = () => {
    // Phone authentication would go here
    console.log('Phone login clicked');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await axios.post(url, formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };
  return (
    <div className=\"login-container\">
      <h2>{isLogin ? 'Log In' : 'Create Account'}</h2>
      <div className=\"social-login\">
        <button className=\"google-btn\" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
        <button className=\"phone-btn\" onClick={handlePhoneLogin}>
          Continue with Phone
        </button>
      </div>
      <div className=\"divider\">
        <span>OR</span>
      </div>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className=\"form-group\">
            <label>Full Name</label>
            <input
              type=\"text\"
              name=\"name\"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className=\"form-group\">
          <label>Email</label>
          <input
            type=\"email\"
            name=\"email\"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className=\"form-group\">
          <label>Password</label>
          <input
            type=\"password\"
            name=\"password\"
            value={formData.password}
            onChange={handleChange}
            required
            minLength=\"6\"
          />
        </div>
        {error && <div className=\"error-message\">{error}</div>}
        <button type=\"submit\" className=\"submit-btn\">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      <div className=\"toggle-form\">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)}>Create one</button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)}>Log in</button>
          </p>
        )}
      </div>
    </div>
  );
};
export default Login;
