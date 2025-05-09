import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import * as yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";

const schema = yup.object().shape({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await registerUser(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Erro ao cadastrar");
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
      <h2>Cadastro</h2>

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

        <md-outlined-text-field
          label="Confirmar Senha"
          type="password"
          {...register("confirm")}
          error={!!errors.confirm}
          supporting-text={errors.confirm?.message}
        />

        {error && <div style={{ color: "red" }}>{error}</div>}

        <md-filled-button type="submit">Cadastrar</md-filled-button>
        <p>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </form>
  );
}
