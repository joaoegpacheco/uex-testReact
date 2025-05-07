import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se já existe um usuário logado ao iniciar a aplicação
  useEffect(() => {
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
      setCurrentUser(JSON.parse(loggedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Buscar usuários cadastrados
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar se o usuário existe e a senha está correta
      const user = users.find(user => user.email === email && user.password === password);
      
      if (user) {
        // Salvar usuário logado no localStorage e no estado
        const userInfo = { id: user.id, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        setCurrentUser(userInfo);
        resolve(userInfo);
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    });
  };

  const register = (email, password) => {
    return new Promise((resolve, reject) => {
      // Buscar usuários cadastrados
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar se o e-mail já está em uso
      if (users.some(user => user.email === email)) {
        reject(new Error('E-mail já cadastrado'));
        return;
      }
      
      // Criar novo usuário
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        contacts: []
      };
      
      // Adicionar à lista de usuários
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Login automático após registro
      const userInfo = { id: newUser.id, email: newUser.email };
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      
      resolve(userInfo);
    });
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}