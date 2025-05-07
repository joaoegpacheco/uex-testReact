import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '@material/web/textfield/outlined-text-field';
import '@material/web/button/filled-button';

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('O email é obrigatório'),
  password: yup.string().required('A senha é obrigatória')
});

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '16px', margin: '50px auto' }}>
      <h2>Login</h2>

      <md-outlined-text-field
        label="Email"
        type="email"
        {...register('email')}
        error={!!errors.email}
        supporting-text={errors.email?.message}
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Senha"
        type="password"
        {...register('password')}
        error={!!errors.password}
        supporting-text={errors.password?.message}
      ></md-outlined-text-field>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <md-filled-button type="submit">Entrar</md-filled-button>
      <p>
        Não tem conta? <Link to="/register">Cadastrar-se</Link>
      </p>
    </form>
  );
}
