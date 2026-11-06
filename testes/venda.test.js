// Venda de imóveis — casos conferidos com calculadora imobiliária de mercado (05/11/2026)
const V = require('../venda.js');
const I = require('../ipca.js');
const ok = (c, m) => { if (!c) throw new Error(m); };
const perto = (a, b, tol, m) => ok(Math.abs(a - b) <= (tol || 0.01), m + ': esperado ' + b + ', veio ' + a);

// IPCA: convenção mês inicial e final inclusos
perto(I.fator('2015-06', '2026-09'), 1.799515, 1e-6, 'fator IPCA 06/2015–09/2026');
perto(I.redutorSocial(100000, '2026-09'), 108211.06, 0.01, 'redutor social 09/2026');

const base = {venda: '2027-06', cbsRef: .113, ibsRef: .187, classificacao: 'estoque', trimestral: true, socios: 1, distribuir: true,
  imoveis: [{descricao: 'Apto', valor: 1000000, custo: 400000, aquisicao: '2015-06', tipo: 'novo'}]};
const r = V.calcular(base);
perto(r.cenarios.pf.total, 54417.71, 0.01, 'IR ganho de capital PF (FR2, 144 meses)');
const p = r.cenarios.presumido, it = n => p.itens.find(i => i.nome === n).valor;
perto(it('IRPJ'), 12000, .01, 'IRPJ presumido'); perto(it('Adicional de IRPJ'), 2000, .01, 'adicional trimestral');
perto(it('CSLL'), 10800, .01, 'CSLL'); perto(it('IBS'), 85.99, .01, 'IBS 2027');
perto(r.porImovel[0].baseCbsIbs, 171982.94, .02, 'base CBS/IBS');
// ano todo: adicional só acima de R$ 240 mil
perto(V.calcular(Object.assign({}, base, {trimestral: false})).cenarios.presumido.itens.find(i => i.nome === 'Adicional de IRPJ').valor, 0, .01, 'adicional anual');
// ativo não circulante em 2026: sem PIS/COFINS, IRPJ/CSLL sobre o ganho
const a = V.calcular(Object.assign({}, base, {classificacao: 'ativo', venda: '2026-11'})).cenarios.presumido;
ok(!a.itens.some(i => i.nome === 'PIS/COFINS'), 'ativo sem PIS/COFINS');
perto(a.itens.find(i => i.nome === 'IRPJ').valor, 90000, .01, 'IRPJ sobre ganho de 600 mil');
// estoque em 2026 tem PIS/COFINS 3,65%
perto(V.calcular(Object.assign({}, base, {venda: '2026-11'})).cenarios.presumido.itens.find(i => i.nome === 'PIS/COFINS').valor, 36500, .01, 'PIS/COFINS cumulativo');
// isenção do único imóvel até 440 mil e reinvestimento
ok(V.calcular(Object.assign({}, base, {unico440: true, imoveis: [{valor: 400000, custo: 100000, aquisicao: '2010-01', tipo: 'usado'}]})).cenarios.pf.total === 0, 'isenção 440 mil');
perto(V.calcular(Object.assign({}, base, {imoveis: [Object.assign({}, base.imoveis[0], {reinvest: 1})]})).cenarios.pf.total, 0, .01, 'reinvestimento 100%');
// aquisição até 1969: isento pela Lei 7.713
ok(V.calcular(Object.assign({}, base, {imoveis: [{valor: 1e6, custo: 1000, aquisicao: '1965-01', tipo: 'usado'}]})).cenarios.pf.total === 0, 'aquisição até 1969');
// art. 488: só a partir de 2029 e só no IBS
const s = Object.assign({}, base, {imoveis: [Object.assign({}, base.imoveis[0], {ded488: 50000})]});
const c28 = V.calcular(Object.assign({}, s, {venda: '2028-06'})), c29 = V.calcular(Object.assign({}, s, {venda: '2029-06'})), c29s = V.calcular(Object.assign({}, base, {venda: '2029-06'}));
const ibs = x => x.cenarios.presumido.itens.find(i => i.nome === 'IBS').valor, cbs = x => x.cenarios.presumido.itens.find(i => i.nome === 'CBS').valor;
ok(Math.abs(ibs(c28) - ibs(V.calcular(Object.assign({}, base, {venda: '2028-06'})))) < .01, 'art. 488 não vale em 2028');
ok(ibs(c29) < ibs(c29s) && Math.abs(cbs(c29) - cbs(c29s)) < .01, 'art. 488 reduz só o IBS em 2029');
// IRRF: até R$ 50 mil por sócio não retém
ok(V.calcular(Object.assign({}, base, {socios: 20})).cenarios.presumido.irrf === 0, 'IRRF abaixo de 50 mil por sócio');
console.log('VENDA OK');
