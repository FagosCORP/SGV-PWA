# CRUD de Gestão de Viagens

## Demonstração
Veja uma demonstração da aplicação [aqui](https://bucolic-cocada-8dffa0.netlify.app/src/).



Este projeto é um sistema de gerenciamento de viagens que permite aos usuários criar, ler, atualizar e excluir informações sobre suas viagens de forma eficiente.

## Funcionalidades

### Create (Criar)
- Adicione novos itens com detalhes como:
  - Descrição
  - Quantidade
  - Moeda inicial (conversão)
  - Moeda final  (conversão)
   
### Read (Ler)
- Visualize uma lista de  itens com conversão direta da moeda.

### Update (Atualizar)
- Edite itens
    - Descrição
    - Quantidade
    - Moeda inicial (conversão)
    - Moeda final  (conversão)
  

### Delete (Excluir)
- Remova itens que não são mais necessárias.

## Tecnologias Utilizadas
- **Frontend**: HTML, CSS, JavaScript e Node.

## Como Usar
1. Clone este repositório.

## Conclusão
O CRUD de gestão de viagens oferece uma solução prática e organizada para o planejamento e acompanhamento de viagens, melhorando a experiência do usuário.



# Sistema de Cache para API de Câmbio

Este projeto implementa um sistema de cache para otimizar requisições a uma API de câmbio, reduzindo significativamente o número de chamadas realizadas.

## Descrição

O sistema faz **duas requisições a cada 24 horas** para a API de câmbio, armazenando as respostas em dois locais:

1. **Local Storage** do navegador
2. **Cache do Service Worker** do PWA

Essa abordagem permite economizar **400%** nas requisições, garantindo que o limite da API não seja excedido.

## Vantagens

- **Redução de Requisições**: Minimiza o número de chamadas à API, evitando custos excessivos e limitações.
- **Melhor Desempenho**: Carregamento mais rápido, uma vez que os dados são obtidos do cache em vez de fazer uma nova requisição.
- **Experiência do Usuário**: Usuários experimentam menos latência ao acessar dados já armazenados.

## Funcionamento

1. O sistema verifica se já existem dados válidos armazenados.
2. Se os dados não estiverem disponíveis ou expirados (mais de 24 horas), realiza duas requisições à API de câmbio.
3. Os dados recebidos são armazenados no Local Storage e no cache do Service Worker.
4. Para requisições subsequentes, os dados são carregados diretamente do cache, melhorando a eficiência.

## Como Usar

1. Integre o sistema de cache ao seu aplicativo.
2. Configure as chaves do Local Storage e as regras de caching do Service Worker conforme necessário.
3. Monitore as requisições para garantir que a lógica de cache esteja funcionando corretamente.

## Conclusão

Este sistema de cache é uma solução eficaz para gerenciar o consumo de requisições da API de câmbio, otimizando a utilização de recursos e melhorando a experiência do usuário.


# Padrão VIP (View, Interactor, Presenter)

O padrão VIP é uma arquitetura de software projetada para facilitar a separação de responsabilidades em aplicativos, especialmente aqueles com interfaces gráficas, como aplicativos móveis. Ele divide o código em três componentes principais:

## Componentes

### 1. View
- **Responsabilidade**: Gerenciar a interface do usuário.
- **Funções**:
  - Exibir dados recebidos do Presenter.
  - Coletar entradas do usuário.
  - Notificar o Presenter sobre ações do usuário.

### 2. Interactor
- **Responsabilidade**: Contém a lógica de negócios da aplicação.
- **Funções**:
  - Processar as requisições da View.
  - Executar operações de negócios, como acessar serviços ou bancos de dados.
  - Retornar os resultados para o Presenter.

### 3. Presenter
- **Responsabilidade**: Atuar como intermediário entre a View e o Interactor.
- **Funções**:
  - Receber dados do Interactor.
  - Formatar dados para apresentação na View.
  - Definir a lógica de apresentação e orquestrar a interação entre a View e o Interactor.

## Vantagens do Padrão VIP
- **Separação de responsabilidades**: Cada componente tem uma função clara, facilitando a manutenção.
- **Testabilidade**: Os componentes podem ser testados de forma independente.
- **Modularidade**: O código fica mais organizado, facilitando a adição de novas funcionalidades.


