import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthForm } from "../components/AuthForm";
import { useState } from "react";

const registerSchema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("A confirmação de senha é obrigatória"),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async ({ email, password }) => {
    try {
      await registerUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
    }
  };

  return (
    <AuthForm
      title="Cadastro"
      schema={registerSchema}
      fields={[
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Senha", type: "password" },
        { name: "confirm", label: "Confirmar Senha", type: "password" },
      ]}
      onSubmit={handleRegister}
      error={error}
      setError={setError}
      footer={
        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      }
    />
  );
}
