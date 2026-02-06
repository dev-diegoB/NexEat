import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { signinWithGoogle, signout, user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div>
        <img src={user.picture + "?v=" + user.id} alt={user.name} width={60} />

        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>Role: {user.role}</p>
        <p>Puntos: {user.points}</p>

        <button onClick={signout}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        signinWithGoogle(credentialResponse.credential);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default Login;
