# ANDAVIRA — Header v4

Versão em HTML + CSS + JavaScript + GSAP.

## Alteração desta versão

O logo continua a ser o desenho SVG original, mas foi separado nos 8 paths/letras reais.
Cada letra tem duas cópias do mesmo path:

- normal a 100%
- o mesmo path invertido verticalmente a 20%

No scroll, as letras viram **uma de cada vez**, da esquerda para a direita. Cada letra roda para trás no eixo X, e durante essa mesma viragem o desenho invertido passa de 20% para 100%.

Não há React, Vite ou TypeScript.

## Testar

Na pasta do projeto:

```bash
python3 -m http.server 8000
```

Abrir:

http://localhost:8000

A velocidade/separação entre letras pode ser afinada em `script.js` mudando `index * 0.115`.
