/* Módulo ITBI — Controller & Oraculu's. Regras conferidas em 05/11/2026.
 * Regras nacionais: CF, art. 156, II e parágrafo 2º, I; CTN, arts. 35 a 38 (art. 38 com redação da LC 227/2026);
 * STJ, Tema 1.113 (base = valor da transação declarado; valor de referência unilateral não pode ser imposto previamente);
 * STF, Tema 796 (imunidade limitada ao valor destinado ao capital) e Tema 1.348 (julgado em 19/10/2026: imunidade
 * na integralização vale ainda que a atividade preponderante seja imobiliária).
 * Municípios: só os conferidos em fonte oficial. Para os demais, o usuário informa as alíquotas.
 * Sem DOM: roda no navegador e no Node. */
(function (raiz) {
  'use strict';

  const MUNICIPIOS = {
    guarulhos: {nome: 'Guarulhos/SP', aliquota: .03, sfh: null, fonte: 'Lei Municipal 8.425/2025, art. 10 (alíquota única de 3%)',
      nota: 'Lei 8.425/2025 trata a integralização como não incidência limitada ao valor do aumento de capital (art. 3º, III) e ainda prevê a regra de atividade preponderante (art. 4º), superada pelo Tema 1.348 do STF.'},
    saopaulo: {nome: 'São Paulo/SP', aliquota: .03, sfh: {aliquota: .005, limiteFinanciado: 120968, limiteImovel: 725808}, fonte: 'Lei 11.154/1991 e Decreto 55.196/2014; limites de 2026 da SF/SP',
      nota: 'SFH, PAR, HIS e consórcio: 0,5% sobre o financiado até R$ 120.968, para imóvel de até R$ 725.808; acima disso, 3%. SFI e carteira hipotecária: 3%. Isenção de primeira aquisição: valor de referência de R$ 245.527,77 em 2026 (conferir requisitos).'},
    sjc: {nome: 'São José dos Campos/SP', aliquota: .02, sfh: {aliquota: .005, limiteFinanciado: Infinity, limiteImovel: Infinity}, fonte: 'LC Municipal 696/2025 e Prefeitura de São José dos Campos (serviço ITBI)',
      nota: 'SFH: 0,5% sobre a parte financiada e 2% sobre o restante.'},
    outro: {nome: 'Outro município (informar alíquotas)', aliquota: .02, sfh: null, fonte: 'Lei municipal informada pelo usuário', nota: 'Confira a lei municipal: alíquota geral, redução para SFH/HIS, isenções e limites do ano.'}
  };

  const brl = v => (v || 0).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL', maximumFractionDigits: 2});

  function municipio(e) {
    const base = MUNICIPIOS[e.municipio] || MUNICIPIOS.outro;
    if (e.municipio !== 'outro') return base;
    const sfh = (+e.aliqSfh > 0) ? {aliquota: +e.aliqSfh, limiteFinanciado: +e.limFinSfh || Infinity, limiteImovel: +e.limImovelSfh || Infinity} : null;
    return Object.assign({}, base, {nome: e.nomeMunicipio ? e.nomeMunicipio : base.nome, aliquota: +e.aliquota || 0, sfh});
  }

  // Compra e venda, dação, arrematação e demais transmissões onerosas
  function compra(e) {
    const m = municipio(e);
    const declarado = Math.max(0, +e.valorDeclarado || 0);
    const referencia = Math.max(0, +e.valorReferencia || 0);
    const financiado = Math.max(0, +e.financiadoSfh || 0);
    function calc(base) {
      let reduzida = 0, faixaReduzida = 0;
      if (m.sfh && financiado > 0 && base <= m.sfh.limiteImovel) {
        faixaReduzida = Math.min(financiado, m.sfh.limiteFinanciado, base);
        reduzida = faixaReduzida * m.sfh.aliquota;
      }
      const restante = base - faixaReduzida;
      return {base, faixaReduzida, reduzida, restante, normal: restante * m.aliquota, total: reduzida + restante * m.aliquota};
    }
    const a = calc(declarado);
    const memoria = [
      'Base de cálculo: valor da transação declarado, ' + brl(declarado) + ' (STJ, Tema 1.113; CTN, art. 38, com a redação da LC 227/2026).',
      a.faixaReduzida ? 'Parte financiada pelo SFH: ' + brl(a.faixaReduzida) + ' × ' + (m.sfh.aliquota * 100).toFixed(2).replace('.', ',') + '% = ' + brl(a.reduzida) + '.' : null,
      'Restante: ' + brl(a.restante) + ' × ' + (m.aliquota * 100).toFixed(2).replace('.', ',') + '% = ' + brl(a.normal) + '.',
      'ITBI: ' + brl(a.total) + '. Município: ' + m.nome + ' (' + m.fonte + ').'
    ].filter(Boolean);
    const out = {tipo: 'compra', municipio: m, devido: a, memoria, avisos: []};
    if (referencia > declarado) {
      const b = calc(referencia);
      out.cenarioPrefeitura = b;
      out.avisos.push('Se a prefeitura exigir o valor de referência (' + brl(referencia) + '), o ITBI sobe para ' + brl(b.total) + ' (+' + brl(b.total - a.total) + '). Pelo Tema 1.113 do STJ o valor declarado prevalece, e o TJSP tem decidido que a LC 227/2026 não autoriza adotar o valor de referência sem processo administrativo próprio. Contestar judicialmente é ato privativo de advogado.');
    }
    if (m.nota) out.avisos.push(m.nota);
    return out;
  }

  // Integralização de capital com imóveis (holding, conferência de bens)
  // e.imoveis: [{descricao, valorCapital (valor atribuído ao capital), valorTransferido (valor pelo qual entra no patrimônio da PJ), valorMercado}]
  function integralizacao(e) {
    const m = municipio(e);
    const linhas = (e.imoveis || []).filter(i => (+i.valorCapital || 0) || (+i.valorTransferido || 0) || (+i.valorMercado || 0)).map(i => {
      const cap = Math.max(0, +i.valorCapital || 0);
      const transf = Math.max(cap, +i.valorTransferido || cap);
      const merc = Math.max(0, +i.valorMercado || 0);
      const excContrib = Math.max(0, transf - cap);           // Tema 796: excesso sobre o capital (ex.: reserva de capital)
      const excFisco = Math.max(0, Math.max(merc, transf) - cap); // posição de prefeituras: diferença para o valor de mercado
      return {descricao: i.descricao || 'Imóvel', cap, transf, merc, excContrib, excFisco, itbiContrib: excContrib * m.aliquota, itbiFisco: excFisco * m.aliquota};
    });
    const soma = k => linhas.reduce((s, l) => s + l[k], 0);
    const out = {tipo: 'integralizacao', municipio: m, linhas,
      totais: {cap: soma('cap'), transf: soma('transf'), merc: soma('merc'), itbiContrib: soma('itbiContrib'), itbiFisco: soma('itbiFisco')},
      avisos: [], memoria: []};
    out.memoria.push('Imunidade da integralização: CF, art. 156, parágrafo 2º, I. Tema 1.348 do STF (19/10/2026): vale mesmo se a atividade preponderante for compra, venda ou locação de imóveis.');
    out.memoria.push('Limite (Tema 796 do STF): o valor que exceder o destinado ao capital social é tributável. Cenário 1 (tese do contribuinte): só o que entra no patrimônio acima do capital subscrito, como reserva de capital. Cenário 2 (prática de prefeituras): diferença entre o valor de mercado ou de referência e o valor integralizado.');
    out.memoria.push('Alíquota de ' + m.nome + ': ' + (m.aliquota * 100).toFixed(2).replace('.', ',') + '% (' + m.fonte + ').');
    if (out.totais.itbiFisco > out.totais.itbiContrib) out.avisos.push('Diferença entre os cenários: ' + brl(out.totais.itbiFisco - out.totais.itbiContrib) + '. Integralizar pelo valor de mercado (capital igual ao valor transferido) elimina o excesso, mas pode gerar ganho de capital para o sócio pessoa física (Lei 9.249/1995, art. 23). Avaliar em conjunto com o estudo de holding.');
    out.avisos.push('O Tema 1.348 não teve modulação de efeitos até o julgamento. Quem pagou ITBI nos últimos 5 anos pode avaliar a restituição; o pedido judicial é ato privativo de advogado.');
    if (e.municipio === 'guarulhos') out.avisos.push(m.nota);
    return out;
  }

  const api = {MUNICIPIOS, compra, integralizacao};
  if (typeof module === 'object' && module.exports) module.exports = api; else raiz.ITBI = api;
})(typeof self !== 'undefined' ? self : this);
