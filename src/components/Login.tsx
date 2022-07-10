import { LOGIN_FACEBOOK } from "../Api";
import "./Login.css";

interface LoginProps {
  onReceive: Function;
}

const Login = ({ onReceive }: LoginProps) => {
  const handleFacebookLogin = async () => {
    try {
      let result = await LOGIN_FACEBOOK();
      if (!result) throw new Error("DEU RUIM, IRMAO");
      onReceive(result.user);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div className="login">
      <button onClick={handleFacebookLogin}>Logar com Facebook</button>
    </div>
  );
};

export default Login;
