# UEX - Gerenciamento de Lista de Contatos.
Desafio Técnico para Desenvolvedor ReactJS PL

> Aplicação criada a partir do Vite, versão 6.3.5

Nesta aplicação o usuário pode:
- Se cadastrar para utilizar a plataforma
- Realizar login e logout
- Gerenciar sua lista de contatos
- Realizar pesquisa de endereço como ajuda ao cadastro de contatos
- Excluir a sua própria conta

Esta é uma aplicação onde a base de dados local, se encontra no localstorage, onde armazenar-se todos os dados dos usuários e seus respectivos contatos.

Versão Node
> v20.18.2

Versão Npm
> 10.8.2

Versão React
> ^19.1.0

Instalar dependências:
```
npm install
```

- Criar API Key do Google Maps em console.cloud.google.com

- Ative a API: Geocoding API

Crie um arquivo .env (utilize o .env.example como exemplo para criar o seu arquivo) preenchendo 
 ⁠VITE_GOOGLE_API_KEY  ⁠com a chave gerada no passo anterior.
Este arquivo deve ser criado na raiz do projeto.

Executar o projeto:
```
npm run dev
```

# Dependências utilizadas para o desafio:
> react-hook-form (formulários), react-router-dom (rotas), uuid (id criptografado e randômico), yup e @hookform/resolvers (validação e formatação de formulários), dotenv (para que seu .env funcione no Vite, serve para armazenar variáveis de ambiente), cpf-cnpj-validator (validador de cpf), @react-google-maps/api (GoogleMaps), axios (chamada de APIs)

# Design System:
> Material Web 3 (https://m3.material.io/)

# Integrações:
- Via Cep
- Google Maps

