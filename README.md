# Central Financeira Evolução — v2.0

Nova versão **independente** da Central Financeira IA Raffani. Repositório sugerido: `central-financeira-evolucao`.

## Novidades

1. Retirados os botões de importar planilha e ler e-mail da tela Lançamentos.
2. Removido status do formulário; recorrência mensal opcional, com 2 a 240 meses **incluindo o lançamento inicial**.
3. Exclui um lançamento ou, se recorrente, o selecionado e todos os futuros da mesma série.
4. Formulários e botões responsivos, com rolagem própria e margem segura para Safari do iPhone.
5. Tela Contas, com tipos Conta bancária e Cartão de crédito.
6. Categorias cadastráveis em Cadastros e backup.
7. Relatórios por mês, ano inteiro ou todos, com exportação CSV do período.
8. Visão geral sem card de pendências, com filtros de mês, ano ou todos.
9. Sem funcionalidades ou botões de e-mail na visão geral.
10. Cadastro de entidades (PF/PJ/etc.), vinculáveis aos lançamentos.
11. Nome e estrutura diferentes, pronto para novo repositório GitHub Pages.

## Publicar no GitHub Pages

1. Crie um repositório público novo chamado `central-financeira-evolucao` (sem substituir o original).
2. Envie os arquivos `index.html`, `manifest.webmanifest`, `sw.js` para a raiz do repositório.
3. Abra **Settings > Pages**, selecione **Deploy from a branch**, branch **main**, pasta **/(root)** e salve.
4. Acesse `https://endantas-spec.github.io/central-financeira-evolucao/` quando o GitHub informar a publicação.

## Dados e segurança

- Tudo é salvo no `localStorage` do navegador e **não sincroniza** entre iPhone, Mac e outros aparelhos.
- A versão usa chave própria e **não lê automaticamente os dados da versão antiga**. Faça backup na versão antiga e mantenha o arquivo antes de usar esta. Backups antigos podem ter esquema incompatível com a restauração aqui.
- O cartão de crédito é identificado como tipo de conta; **não há** geração automática de fatura, parcelamento de compras ou cálculo de limite disponível.
- Os lançamentos são considerados movimentações para fins de relatório (não existe status de pendência).
- Recorrências criadas são registros independentes, identificados por `seriesId`. Editar uma ocorrência altera somente ela. Excluir futuros remove a partir da data da ocorrência selecionada.
- Não use o GitHub para armazenar arquivos de backup contendo dados financeiros: mantenha apenas o código no repositório.

## Uso local

Abra `index.html` em navegador moderno para testar. Para instalação no iPhone via **Adicionar à Tela de Início**, publique sob HTTPS.
