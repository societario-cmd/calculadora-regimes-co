# Calculadora de Regimes Tributários 2026–2033 — Controller & Oraculu's

Ferramenta do Departamento Societário e de Legalização da Controller & Oraculu's (Guarulhos/SP) para estimar e comparar a carga tributária de uma empresa em quatro regimes, ano a ano, durante a transição da reforma tributária:

- Simples Nacional (CBS/IBS dentro do DAS)
- Simples Híbrido (CBS/IBS fora do DAS, a partir de 2027)
- Lucro Presumido (com o acréscimo de presunção da LC 224/2025)
- Lucro Real

Também mostra a retenção de 10% sobre dividendos da Lei 15.270/2025 e o crédito de CBS/IBS que cada regime gera para o cliente do contribuinte.

## Aba Construção e Incorporação

- Incorporação / venda de unidades: RET 4% (ou 1% no interesse social) e o RET de transição a partir de 2027 (IRPJ 1,26% + CSLL 0,66% + CBS/IBS 2,08%; LC 214/2025, art. 485, redação da LC 227/2026), comparado com Presumido (presunção 8%/12%) e Real, com CBS/IBS reduzidos em 50% (art. 261), redutor de ajuste (art. 258), redutor social (art. 259) e crédito dos insumos da obra.
- INSS da obra por aferição no Sero (IN RFB 2.021/2021): RMT = área × equivalência × VAU × 20%/15%/12%, menos a remuneração comprovada, × 36,8% (ajustável). Redutor de ajuste corrigido pelo IPCA informado.
- Construtora (empreitada): retenções na fonte (INSS 11% ou 3,5% com CPRB; ISS) como antecipação de caixa; CPP × CPRB na transição da Lei 14.973/2024 (2026: 2,7% da receita + 10% da folha; 2027: 1,8% + 15%; 2028: CPP cheia), CBS/IBS com redução de 50% e crédito dos materiais, ISS com dedução de materiais, presunção 8%/12% ou 32%, e Simples Anexo IV.

## Aba ITBI

- Compra e venda: base no valor declarado (STJ, Tema 1.113; CTN, art. 38 com a LC 227/2026), alíquota reduzida do SFH quando o município prevê, e o cenário de risco se a prefeitura exigir o valor de referência.
- Integralização de capital: imunidade (CF, art. 156, parágrafo 2º, I) mesmo com atividade imobiliária preponderante (STF, Tema 1.348, 19/10/2026), limitada ao valor destinado ao capital (Tema 796); dois cenários (tese do contribuinte × prática de prefeituras), imóvel a imóvel.
- Municípios conferidos: Guarulhos (3%, Lei 8.425/2025), São Paulo (3%; 0,5% SFH até R$ 120.968 para imóvel até R$ 725.808) e São José dos Campos (2%; 0,5% SFH). Qualquer outro município: alíquotas informadas na tela.

## Consulta por CNPJ

Informe o CNPJ e clique em Buscar: a página consulta a base pública da Receita Federal (BrasilAPI, com a publica.cnpj.ws como reserva), traz razão social, situação, regime atual, CNAE principal e secundários, e já preenche a atividade, o anexo do Simples, o Fator R e a redução de CBS/IBS sugerida. Sem internet, ou num ambiente que bloqueie a consulta, basta digitar o CNAE principal.

O enquadramento por CNAE (`cnae.js`) é uma tabela própria montada a partir da LC 123/2006 (art. 17 e art. 18, parágrafos 5º-B a 5º-I) e da LC 214/2025 (reduções). É uma sugestão: confira o caso concreto, principalmente atividades mistas.

Roda inteira no navegador: um único `index.html`, sem servidor e sem dependências.

## Estrutura

```
index.html          página pronta (gerada; é o arquivo publicado)
template.html       tela, estilos e interação
motor.js            motor de cálculo e parâmetros legais (sem DOM)
cnae.js             enquadramento por CNAE e consulta de CNPJ
construcao.js       módulo de construção e incorporação (RET, CPRB, redutores)
itbi.js             módulo de ITBI (compra e integralização)
build.py            embute motor.js, cnae.js, construcao.js e itbi.js em template.html e gera index.html
testes/             um teste por módulo (node testes/<nome>.test.js)
```

## Como alterar

1. Edite `motor.js` (parâmetros e regras) ou `template.html` (tela).
2. Rode todos os testes em `testes/`.
3. Rode `python3 build.py` para gerar o `index.html`.

## Parâmetros (conferidos em 05/11/2026)

- CBS de referência padrão 11,3% (cálculo do TCU de 28/10/2026; o Senado fixa por resolução até 15/12/2026). IBS de referência 18,7% (Res. CGIBS 14/2026), usado a partir de 2029. Os dois são editáveis na tela.
- 2026: CBS 0,9% e IBS 0,1% de teste, compensados. 2027–2028: CBS = referência − 0,1 p.p. e IBS 0,1%. 2029–2032: ICMS/ISS a 90/80/70/60% e IBS a 10/20/30/40% da referência. 2033: alíquotas plenas (EC 132/2023; LC 214/2025).
- Simples: faixas e partilha da LC 123/2006; 6ª faixa com −0,1 p.p. em 2027–2028 (LC 214/2025, art. 519); Fator R 28%.
- Presumido: presunção da Lei 9.249/1995, com acréscimo de 10% sobre a receita acima de R$ 5 milhões por ano (LC 224/2025).
- Dividendos: retenção de 10% acima de R$ 50 mil por mês por sócio (Lei 9.250/1995, art. 6º-A).

As premissas completas estão na própria página, na seção "Premissas".

## Aviso

Estimativa para apoio ao estudo tributário. Não substitui o parecer nem a análise do caso concreto. Teses que dependem de medida judicial exigem advogado habilitado.

### Atualização 05/11/2026 — conferência com calculadora imobiliária de mercado
- Loteamento com registro pedido até 31/12/2028: comparação com a opção de IBS+CBS de 3,65% da receita bruta, sem créditos e sem redutores (LC 214/2025, art. 486; Res. CGIBS 6/2026, art. 462).
- Redutor social editável com o valor do mês, atualizado pelo IPCA (LC 214/2025, art. 259, § 3º).
- Opção de preço sem CBS/IBS embutido (tributo por fora, LC 214/2025, art. 12, § 2º).

### Aba "Venda de imóveis" (05/11/2026)
- Um ou mais imóveis vendidos, comparando pessoa física, PJ no Lucro Presumido e PJ no Lucro Real, com o IRRF de 10% na distribuição (Lei 15.270/2025).
- PF: ganho de capital com redução da Lei 7.713/1988, FR1/FR2 (Lei 11.196/2005, art. 40), isenção do único imóvel até R$ 440 mil e do reinvestimento em 180 dias, alíquotas de 15% a 22,5%; CBS/IBS se a PF for contribuinte (LC 214, art. 251).
- PJ: imóvel no estoque (presunção 8%/12%) ou no ativo não circulante (ganho de capital, sem PIS/COFINS até 2026 — Lei 9.718/1998, art. 3º, § 2º, IV); adicional de IRPJ trimestral ou anual.
- CBS/IBS a partir de 2027 com redutor de ajuste pelo IPCA mensal ou valor de referência, redutor social corrigido e art. 488 (dedução no IBS a partir de 2029, também na aba de incorporação).
- `ipca.js`: IPCA mensal oficial (BCB/SGS 433) até 09/2026; acrescentar cada novo mês divulgado pelo IBGE.

### Documentos do imóvel na aba ITBI (06/11/2026)
- Upload da matrícula e da certidão de valor venal (`docs.js`). PDF com texto é lido no navegador com pdf.js (cdnjs), sem envio do arquivo; na versão publicada no Claude, PDF digitalizado ou foto é lido pelo Claude (capacidade `sample`).
- Extrai matrícula, cartório, endereço, inscrição, áreas, valor da transmissão mais recente, ônus/restrições (com indicação de cancelamento), valor venal, valor de referência, terreno, construção e exercício; botões para usar o valor como referência da prefeitura ou incluir o imóvel na integralização. Sempre conferir com o documento.
