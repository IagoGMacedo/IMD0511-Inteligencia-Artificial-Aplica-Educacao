# IMD0511 - Inteligência Artificial Aplicada à Educação

Este repositório reúne um protótipo de sistema tutor inteligente voltado para ensino de educação financeira e investimentos. A aplicação foi desenvolvida com React, TypeScript e Vite e oferece uma trilha de aprendizagem interativa com perguntas, recomendações adaptativas e acompanhamento de progresso.

## Objetivo do projeto

O projeto simula um ambiente de aprendizagem guiada, em que o usuário:

- explora módulos sobre finanças e investimentos;
- responde questões sobre cada tema;
- recebe feedback sobre acertos e erros;
- tem seu progresso registrado e usado para sugerir o próximo conteúdo.

A ideia é demonstrar como princípios de IA e sistemas tutores inteligentes podem apoiar a educação de forma mais personalizada.

## O que a aplicação faz

A interface apresenta:

- uma trilha de tópicos organizados por módulos;
- uma recomendação do próximo conteúdo a estudar;
- questões com alternativas;
- atualização do domínio do aluno ao longo das respostas;
- persistência do progresso no navegador.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- CSS para a interface

O código principal está localizado na pasta [financial-ITS](financial-ITS).

## Como executar localmente

Pré-requisitos:

- Node.js 20 ou superior
- npm

### Passos

1. Entre na pasta do projeto:

```bash
cd financial-ITS
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o endereço exibido no terminal, normalmente:

```text
http://localhost:5173/
```

## Scripts disponíveis

No diretório [financial-ITS](financial-ITS), você pode usar:

- `npm run dev` — inicia a aplicação localmente
- `npm run build` — gera a versão de produção
- `npm run lint` — verifica o código com ESLint
- `npm run validate:questions` — valida os dados das questões

## Estrutura principal

- [financial-ITS/src](financial-ITS/src) — interface e lógica da aplicação
- [financial-ITS/src/components](financial-ITS/src/components) — componentes visuais
- [financial-ITS/src/hooks](financial-ITS/src/hooks) — lógica de estado e fluxo da trilha
- [financial-ITS/src/lib](financial-ITS/src/lib) — modelo do aluno, recomendações e armazenamento
- [financial-ITS/src/data](financial-ITS/src/data) — módulos, tópicos e questões

## Observações

- O progresso é salvo localmente no navegador.
- O projeto funciona como um protótipo educacional e não substitui uma plataforma de ensino completa.

## Contribuição

Se você quiser contribuir, pode abrir issues, sugerir melhorias ou enviar pull requests com novas funcionalidades, conteúdos ou ajustes de usabilidade.
