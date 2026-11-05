# Calculadora de Regimes Tributários 2026–2033 — Controller & Oraculu's

Ferramenta do Departamento Societário e de Legalização da Controller & Oraculu's (Guarulhos/SP) para estimar e comparar a carga tributária de uma empresa em quatro regimes, ano a ano, durante a transição da reforma tributária:

- Simples Nacional (CBS/IBS dentro do DAS)
- Simples Híbrido (CBS/IBS fora do DAS, a partir de 2027)
- Lucro Presumido (com o acréscimo de presunção da LC 224/2025)
- Lucro Real

Também mostra a retenção de 10% sobre dividendos da Lei 15.270/2025 e o crédito de CBS/IBS que cada regime gera para o cliente do contribuinte.

Roda inteira no navegador: um único `index.html`, sem servidor e sem dependências.

## Estrutura

```
index.html          página pronta (gerada; é o arquivo publicado)
template.html       tela, estilos e interação
motor.js            motor de cálculo e parâmetros legais (sem DOM)
build.py            embute motor.js em template.html e gera index.html
testes/             teste do motor (node testes/motor.test.js)
```

## Como alterar

1. Edite `motor.js` (parâmetros e regras) ou `template.html` (tela).
2. Rode `node testes/motor.test.js`.
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
