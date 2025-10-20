# 📱 Gerenciador de Apostas Esportivas (Global Solution)

Este é um aplicativo móvel desenvolvido em React Native como parte da Global Solution de "Mobile Development and IoT". O objetivo é ajudar o usuário a gerenciar suas transações em apostas esportivas, utilizando o **Firebase** como backend para armazenamento e autenticação de dados em tempo real.

## 🧑‍💻 Integrantes do Projeto

* **Márcio Gastaldi** - RM98811
* **Arthur Bessa Pian** - RM99215
* **Davi Desenzi** - RM550849
* **João Victor** - RM551410

## ✨ Funcionalidades

O aplicativo oferece um conjunto robusto de funcionalidades com um ciclo CRUD completo:

### 🔐 Autenticação com Firebase
* **Cadastro de Novos Usuários**: Tela para criação de contas pessoais com nome, e-mail e senha.
* **Login Seguro**: Autenticação de usuários já cadastrados para acesso à plataforma.
* **Sessão Persistente**: O usuário permanece logado mesmo após fechar e reabrir o aplicativo.
* **Logout**: Função para encerrar a sessão do usuário de forma segura.

### 💸 CRUD de Transações no Firestore
* **(C)reate - Adicionar Transação**: Registro de depósitos e saques, especificando o nome da casa de aposta e o valor.
* **(R)ead - Histórico de Transações**: Visualização do extrato completo, ordenado pelas transações mais recentes.
* **(U)pdate - (Indireto)**: O resumo financeiro é atualizado em tempo real a cada nova transação.
* **(D)elete - Excluir Transação**: O usuário pode apagar transações indesejadas com um toque, mediante confirmação.

### 📊 Resumo Financeiro
* **Dashboard Intuitivo**: A tela inicial exibe um resumo com o saldo total (saques - depósitos), o total de depósitos e o total de saques.

### 👤 Perfis Personalizáveis no Firestore
* **(R)ead - Visualização de Dados**: A tela de Perfil exibe os dados do usuário logado (nome, idade, e-mail).
* **(U)pdate - Edição de Perfil**: O usuário pode editar seu nome, idade e escolher um avatar, com as alterações salvas em tempo real no Firestore.

### 💡 Conscientização sobre Riscos
* Acesse uma seção informativa com materiais que abordam os perigos e malefícios das apostas esportivas.

## 🛠️ Tecnologias Utilizadas

* **React Native** com **Expo**
* **TypeScript**
* **Firebase Authentication** para gerenciamento de usuários.
* **Firebase Firestore** como banco de dados NoSQL em tempo real.
* **React Navigation** para a navegação entre telas.

## 🚀 Como Rodar o Projeto

### Pré-requisitos
* Node.js (LTS)
* NPM ou Yarn
* Expo Go (aplicativo no seu celular Android ou iOS)

### Passo a passo
1.  Clone o repositório para sua máquina local:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_AQUI>
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd <NOME_DA_PASTA_DO_PROJETO>
    ```
3.  Instale todas as dependências:
    ```bash
    npm install
    ```
4.  Inicie o servidor de desenvolvimento do Expo:
    ```bash
    expo start
    ```
5.  Escaneie o QR Code gerado no terminal com o aplicativo Expo Go no seu celular.

### Como usar o aplicativo
Ao iniciar o app, você estará na tela de Login. Como não há mais usuários de teste, clique em **"Não tem uma conta? Cadastre-se"** para criar seu próprio usuário e começar a usar o aplicativo.
