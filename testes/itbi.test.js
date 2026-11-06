const I = require('../itbi.js'); const assert = require('assert');
// Guarulhos 3%, sem SFH
assert.strictEqual(I.compra({municipio: 'guarulhos', valorDeclarado: 500000, financiadoSfh: 300000}).devido.total, 15000);
// São Paulo: imóvel 600 mil, financiado 400 mil → 0,5% × 120.968 + 3% × (600.000 − 120.968)
const sp = I.compra({municipio: 'saopaulo', valorDeclarado: 600000, financiadoSfh: 400000}).devido.total;
assert.strictEqual(Math.round(sp * 100) / 100, Math.round((120968 * .005 + (600000 - 120968) * .03) * 100) / 100);
// SP acima de 725.808 → 3% em tudo
assert.strictEqual(I.compra({municipio: 'saopaulo', valorDeclarado: 800000, financiadoSfh: 400000}).devido.total, 24000);
// SJC: 0,5% no financiado e 2% no restante
assert.strictEqual(I.compra({municipio: 'sjc', valorDeclarado: 500000, financiadoSfh: 300000}).devido.total, 300000 * .005 + 200000 * .02);
// Outro município
assert.strictEqual(I.compra({municipio: 'outro', aliquota: .025, valorDeclarado: 400000}).devido.total, 10000);
// Valor de referência maior gera cenário
assert.ok(I.compra({municipio: 'guarulhos', valorDeclarado: 500000, valorReferencia: 650000}).cenarioPrefeitura.total === 19500);
// Integralização: capital 300 mil, transferido 300 mil, mercado 900 mil
const r = I.integralizacao({municipio: 'guarulhos', imoveis: [{descricao: 'Apto', valorCapital: 300000, valorTransferido: 300000, valorMercado: 900000}]});
assert.strictEqual(r.totais.itbiContrib, 0); assert.strictEqual(r.totais.itbiFisco, 18000);
// Reserva de capital: transferido 500 mil, capital 300 mil → excesso 200 mil
assert.strictEqual(I.integralizacao({municipio: 'guarulhos', imoveis: [{valorCapital: 300000, valorTransferido: 500000}]}).totais.itbiContrib, 6000);
console.log('ITBI OK');
