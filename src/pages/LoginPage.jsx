import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    }
  };

  return (
    <form
      className="main-layout"
      onSubmit={handleSubmit(onSubmit)}
      style={{
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h2>Login</h2>

      <div
        style={{
          width: 400,
          gap: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <md-outlined-text-field
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          supporting-text={errors.email?.message}
        />

        <md-outlined-text-field
          label="Senha"
          type="password"
          {...register("password")}
          error={!!errors.password}
          supporting-text={errors.password?.message}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}

        <md-filled-button type="submit">Entrar</md-filled-button>
        <p>
          Não tem conta? <Link to="/register">Cadastrar-se</Link>
        </p>
      </div>
    </form>
  );
}
