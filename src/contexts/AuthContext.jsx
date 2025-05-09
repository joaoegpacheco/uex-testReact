import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se já existe um usuário logado ao iniciar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Buscar usuários cadastrados
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Verificar se o usuário existe e a senha está correta
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        reject(new Error("Credenciais inválidas"));
        return;
      }

      // Salvar usuário logado no localStorage e no estado
      const userInfo = { id: user.id, email: user.email };
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      resolve(userInfo);

      //Redireciona para a home
      navigate("/");
    });
  };

  const register = (email, password) => {
    return new Promise((resolve, reject) => {
      // Buscar usuários cadastrados
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Verificar se o e-mail já está em uso
      const emailExists = users.some((u) => u.email === email);
      if (emailExists) {
        reject(new Error("E-mail já cadastrado"));
        return;
      }

      // Criar novo usuário
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        contacts: [],
      };

      // Adicionar à lista de usuários
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Login automático após registro
      const userInfo = { id: newUser.id, email: newUser.email };
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      setCurrentUser(userInfo);

      resolve(userInfo);

      //Redireciona para o login
      navigate("/login");
    });
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);

    //Redireciona para o login
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
