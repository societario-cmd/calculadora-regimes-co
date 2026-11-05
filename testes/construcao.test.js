const K = require('../construcao.js'); const assert = require('assert');
const inc = {receita: 10000000, terreno: 1500000, obra: 5000000, obraAte2026: .3, obraCredito: .7, despesas: 800000, unidades: 20, social: false, cbsRef: .113, ibsRef: .187};
const r26 = K.incorporacao(inc, 2026), r27 = K.incorporacao(inc, 2027);
const tot = r => Object.fromEntries(Object.entries(r.regimes).map(([k, g]) => [k, g.elegivel ? Math.round(g.total) : 'n/e']));
console.log('incorp 2026', tot(r26)); console.log('incorp 2027', tot(r27)); console.log('incorp 2033', tot(K.incorporacao(inc, 2033)));
assert.strictEqual(Math.round(r26.regimes.ret.total), 400000);       // 4%
assert.strictEqual(Math.round(r27.regimes.ret.total), 400000);       // 1,92% + 2,08%
assert.strictEqual(Math.round(K.incorporacao(Object.assign({}, inc, {social: true}), 2027).regimes.ret.total), 100000); // 0,31+0,16+0,53
const c = {receita: 6000000, folha: 1800000, margem: .15, material: .35, comMaterial: true, iss: .03, dedMaterialIss: true, cprb: true, ratTerceiros: .088, cbsRef: .113, ibsRef: .187};
for (const a of [2026, 2027, 2028]) { const r = K.construtora(c, a); console.log('construtora', a, tot(r)); }
// CPRB 2026: 6M × 4,5% × 60% + 1,8M × (10% + 8,8%)
const prev26 = K.construtora(c, 2026).regimes.presumido.itens.find(i => /CPRB/.test(i.nome)).valor;
assert.strictEqual(Math.round(prev26), Math.round(6000000 * .045 * .6 + 1800000 * (.10 + .088)));
console.log('CONSTRUCAO OK');
