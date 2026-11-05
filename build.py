"""Gera index.html a partir de template.html + motor.js (o motor fica embutido na página)."""
t = open('template.html', encoding='utf-8').read()
m = open('motor.js', encoding='utf-8').read()
open('index.html', 'w', encoding='utf-8').write(t.replace('/*MOTOR*/', m))
print('index.html gerado')
