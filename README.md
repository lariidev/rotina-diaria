# 📝 Projeto: Lista de Tarefas (To-Do List)

Bem-vindo(a) ao seu projeto de **Lista de Tarefas**! Este projeto foi desenvolvido especialmente para quem está começando a aprender desenvolvimento de software, utilizando as três tecnologias fundamentais da Web: **HTML5**, **CSS3** e **JavaScript (Vanilla/Puro)**.

---

## 🚀 Como executar o projeto

Você **não precisa instalar nada** para rodar este projeto:
1. Abra a pasta do projeto no seu computador: `c:\Users\Lari\Downloads\lista de tarefas`.
2. Dê um **duplo clique no arquivo [index.html](file:///c:/Users/Lari/Downloads/lista%20de%20tarefas/index.html)**.
3. O aplicativo abrirá imediatamente no seu navegador padrão (Chrome, Edge, Firefox, etc.).

---

## 📂 Estrutura de Arquivos

```text
lista de tarefas/
├── index.html   # Estrutura e marcação dos elementos na tela (O Esqueleto)
├── style.css    # Estilos visuais, cores, tipografia e layout (A Roupa/Aparência)
├── script.js    # Lógica de funcionamento, interatividade e armazenamento (O Cérebro)
└── README.md    # Este guia com explicações passo a passo
```

---

## 🧠 Como os Componentes Funcionam Juntos

### 1. [index.html](file:///c:/Users/Lari/Downloads/lista%20de%20tarefas/index.html) (HTML - Esqueleto)
- Define quais elementos aparecem na tela:
  - O cabeçalho com título e instruções
  - O formulário com campo de texto e **seletor de repetições diárias (1x, 2x, 3x, 4x, etc.)**
  - O contador de tarefas e as ações da rotina (**☀️ Reiniciar rotina do dia** e **Limpar concluídas**)
  - A lista dinâmica (`<ul id="task-list">`)
  - A mensagem informativa de lista vazia

### 2. [style.css](file:///c:/Users/Lari/Downloads/lista%20de%20tarefas/style.css) (CSS - Aparência)
- **Cores e Variáveis (`:root`)**: Usamos variáveis CSS para centralizar as cores do tema.
- **Diferenciação visual de status**:
  - **Pendentes**: Destaque lateral azul e tipografia nítida.
  - **Concluídas**: Fundo esverdeado suave (`#f0fdf4`), borda verde, texto tachado/itálico e etiqueta indicativa "CONCLUÍDA".
- **Controle de Repetição**: Botões circulares discretos (`+` e `-`) com contagem em tempo real e etiqueta com meta do dia.

### 3. [script.js](file:///c:/Users/Lari/Downloads/lista%20de%20tarefas/script.js) (JavaScript - Cérebro)
1. **Estado das Tarefas com Metas**:
   - Cada tarefa é armazenada com suporte a contagem diária:
     ```javascript
     {
       id: 1718000000000,
       text: "Beber água",
       targetCount: 4,     // Meta de vezes ao dia
       currentCount: 2,    // Quantas vezes já fez hoje
       completed: false    // Fica 'true' quando currentCount >= targetCount
     }
     ```
2. **Persistência Local (`localStorage`) — Por que não precisamos de login?**:
   - Para um aplicativo de bloco de notas/rotina pessoal, criar login com e-mail e senha exigiria um servidor backend (Node.js/Python), banco de dados em nuvem, controle de senhas criptografadas e custos de hospedagem.
   - O `localStorage` do navegador já salva tudo no próprio aparelho da pessoa com total privacidade, instantaneamente e sem depender de internet nem de cadastros!
3. **Rotina e "☀️ Reiniciar Dia"**:
   - Ao final do dia ou no início de uma nova manhã, basta clicar em *"☀️ Reiniciar rotina do dia"* para zerar as repetições e desmarcar as conclusões, mantendo toda a sua lista de hábitos intacta para o dia seguinte.

---

## 💡 Próximos passos para você praticar (Desafios)

Depois que você explorar e compreender o código, tente fazer pequenos experimentos:

1. **Mudar o esquema de cores**: No arquivo [style.css](file:///c:/Users/Lari/Downloads/lista%20de%20tarefas/style.css), altere os valores dentro de `:root` (ex: troque `--primary-color: #4f46e5;` por outra cor hexadecimal, como verde `#059669` ou laranja `#ea580c`).
2. **Adicionar data/hora da criação**: Ao criar uma nova tarefa em `script.js`, salve a data em que ela foi criada e exiba logo abaixo do texto.
3. **Filtros de visualização**: Crie 3 botões: *"Todas"*, *"Pendentes"* e *"Concluídas"*, para filtrar a exibição das tarefas.

