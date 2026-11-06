"""Gera index.html a partir de template.html + motor.js (o motor fica embutido na página)."""
t = open('template.html', encoding='utf-8').read()
m = open('motor.js', encoding='utf-8').read()
c = open('cnae.js', encoding='utf-8').read()
k = open('construcao.js', encoding='utf-8').read()
i = open('itbi.js', encoding='utf-8').read()
open('index.html', 'w', encoding='utf-8').write(t.replace('/*MOTOR*/', m).replace('/*CNAE*/', c).replace('/*CONSTRUCAO*/', k).replace('/*ITBI*/', i))
print('index.html gerado')
