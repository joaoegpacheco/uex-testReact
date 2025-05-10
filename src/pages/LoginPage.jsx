import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthForm } from "../components/AuthForm";
import { useState } from "react";

const loginSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    }
  };

  return (
    <AuthForm
      title="Login"
      schema={loginSchema}
      fields={[
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Senha", type: "password" },
      ]}
      onSubmit={handleLogin}
      error={error}
      setError={setError}
      footer={
        <p>
          Não tem conta? <Link to="/register">Cadastrar-se</Link>
        </p>
      }
    />
  );
}
