import LoginForm from "../components/Loginform/Loginform";

function Login({ setIsLoggedIn }) {
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
}

export default Login;
