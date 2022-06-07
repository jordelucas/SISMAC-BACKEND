# Sistema de Marcação de Consultas - SISMAC

<p align="center">
  <a target="_blank" href="https://nodejs.org/en/">
      <img alt="NextJS" src="https://img.shields.io/static/v1?color=green&label=Node&message=JS&?style=for-the-badge&logo=Node.js">
  </a>
  <a target="_blank" href="https://www.typescriptlang.org">
    <img alt="ReactJS" src="https://img.shields.io/static/v1?color=blue&label=Typescript&message=JS&?style=for-the-badge&logo=Typescript"> 
  </a>
  </a>
</p>

<p align="center">
API RESTFULL em desenvolvimento na disciplina de Desenvolvimento de Sistemas WEB II, do Bacharelado em Tecnologia da Informação - IMD/UFRN.
</p>


:man_teacher: [**@fmarquesfilho**](https://github.com/fmarquesfilho) | :man_technologist: [**@clevinacio**](https://github.com/clevinacio) | :man_technologist: [**@jordelucas**](https://github.com/jordelucas)

## :rocket: Como executar

Clone o projeto e acesse a pasta

```bash
$ git clone https://github.com/jordelucas/SISMAC-BACKEND.git && cd SISMAC-BACKEND
```

Siga os passos abaixo
```bash
# Instale as dependências
$ yarn

# Inicie o projeto
$ yarn dev

# O servidor irá iniciar na porta  8080 - vá para http://localhost:8080
```

## :book: Estórias do usuário: 

Funcionário:

* Seção de Pacientes
  * Desejo cadastrar os pacientes que atualmente utilizam o sistema de saúde municipal, bem como os novos usuários.
  * Desejo atualizar os dados dos pacientes, já que é comum ocorrerem erros ao transcrever datas e nomes, por exemplo.
  * Desejo consultar os pacientes cadastrados com o intuito de checar dados pessoais ou de solicitações anteriores.
* Seção de Consultas e Exames
  * Desejo cadastrar exames e especialidades, bem como suas respectivas vagas.
  * Desejo consultar exames e especialidades, suas informações de disponibilidade e os pacientes agendados.
  * Desejo consultar e aprovar solicitações de agendamento de exames com encaminhamento médico obrigatório.
* Seção de agendamento
  * Desejo realizar agendamento de exames e consultas.

## :ballot_box_with_check: Endpoints ##

**[POST]**    `/pacientes`

**[GET]**     `/pacientes` 

**[GET]**     `/pacientes/:id` 

**[GET]**     `/pacientes/:id/agendamentos`

**[PUT]**     `/pacientes/:id` 

**[DELETE]**  `/pacientes/:id`

**[POST]**    `/exames` 

**[GET]**     `/exames` 

**[GET]**     `/exames/:id` 

**[GET]**     `/exames/:id/vagas` 

**[PUT]**     `/exames/:id` 

**[POST]**     `/consultas` 

**[GET]**     `/consultas` 

**[GET]**     `/consultas/:id` 

**[GET]**     `/consultas/:id/vagas` 

**[PUT]**     `/consultas/:id`

**[POST]**     `/vagasExames`

**[GET]**     `/vagasExames`

**[GET]**     `/vagasExames/:id`

**[GET]**     `/vagasExames/:id/agendamentos`

**[POST]**     `/vagasConsultas` 

**[GET]**     `/vagasConsultas`

**[GET]**     `/vagasConsultas/:id`

**[GET]**     `/vagasConsultas/:id/agendamentos`

**[POST]**     `/filaConsultas` 

**[POST]**     `/filaExames`

***teste***
