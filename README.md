# UEX - Gerenciamento de Lista de Contatos.
Desafio Técnico para Desenvolvedor ReactJS PL

> Aplicação criada a partir do Vite, versão 6.3.5

Nesta aplicação o usuário pode:
- Se cadastrar para utilizar a plataforma.
- Realizar login e logout.
- Gerenciar sua lista de contatos.
- Realizar pesquisa de endereço como ajuda ao cadastro de contatos.
- Excluir a sua própria conta.

Esta é uma aplicação onde a base de dados local, se encontra no localstorage, onde armazenar-se todos os dados dos usuários e seus respectivos contatos.

*O Vite é uma ferramenta de construção que visa proporcionar uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos.*

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

Crie um arquivo .env e este deve ser criado na raiz do projeto. 
Certifique-se que o arquivo está no mesmo diretório de arquivos como package. 
Dentro do arquivo crie a seguinte variável de ambiente: VITE_GOOGLE_API_KEY, e adicione nela o resultado da sua Key pessoal cadastrada na ferramenta do Google Maps API.

Executar o projeto:
```
npm run dev
```

# Dependências utilizadas para o desafio:
> react-hook-form (formulários), react-router-dom (rotas), uuid (id criptografado e randômico), yup e @hookform/resolvers (validação e formatação de formulários), dotenv (utilizaarmazenar variáveis de ambiente), cpf-cnpj-validator (validador de cpf), @react-google-maps/api (GoogleMaps), axios (chamada de APIs).

# Design System:
> Material Web 3 (https://m3.material.io/)

# Integrações:
- Via Cep: *Webservice gratuito de alto desempenho para consulta de Código de Endereçamento Postal (CEP) do Brasil.*
- Google Maps: *Ferramenta que permite aos desenvolvedores integrar funcionalidades do Google Maps, como mapas, dados de localização e rotas.*

