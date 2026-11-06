# Fio Modular FM-6

Página de produto de um sintetizador modular fictício. Seis módulos, nenhuma tela: você liga os cabos arrastando, gira os botões e ouve o resultado na hora, direto no navegador.

![Desktop](docs/desktop.png)

<p align="center">
  <img src="docs/tablet.png" alt="Tablet" width="48%">
  &nbsp;
  <img src="docs/mobile-full.png" alt="Celular" width="24%">
</p>

## O que dá pra fazer

- **Ligar e desligar** o som pelo botão do módulo Saída
- **Ligar cabos** arrastando de uma saída (etiqueta preta) até uma entrada; os cabos têm física e balançam
- **Tirar cabos** tocando numa entrada ocupada e soltando fora
- **Girar botões** arrastando para cima ou para baixo (ou com as setas do teclado)
- **Editar a sequência**: ligar e desligar notas e o chimbal passo a passo, trocar a forma de onda

Funciona com mouse e toque, em qualquer tamanho de tela: em telas largas o rack fica numa linha; no tablet e no celular os módulos se reorganizam em grade.

## Tecnologias

| | |
|---|---|
| [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | interface e tipagem |
| [Vite](https://vite.dev) | servidor de desenvolvimento e build |
| [Tailwind CSS 4](https://tailwindcss.com) | estilos e layout responsivo |
| [Motion](https://motion.dev) | animações de entrada, scroll e interação |
| [Tone.js](https://tonejs.github.io) | síntese de áudio (carregado só quando você aperta Ligar) |
| [Playwright](https://playwright.dev) | geração dos prints deste README |

## Como rodar

Precisa de [Node.js](https://nodejs.org) 22 ou mais recente.

```bash
npm install
npm run dev
```

Abra http://localhost:5173. Para testar no celular na mesma rede Wi-Fi, rode `npm run dev -- --host` e use o endereço "Network" que aparece no terminal.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run build` | verifica os tipos e gera a versão final em `dist/` |
| `npm run preview` | serve a versão final localmente |
| `npm run check` | testa as regras de conexão dos cabos |
| `npm run screenshots` | gera os prints em `docs/` (rode `npm run build` antes e, na primeira vez, `npx playwright install chromium`) |

## Estrutura

```
src/
├── domain/              regras do produto, sem React
│   ├── synth.ts         parâmetros, formatos de exibição e sequência
│   └── patch.ts         entradas, saídas e o que pode ligar em quê
├── services/audio/      AudioEngine: traduz o estado do painel para o Tone.js
├── hooks/useSynth.ts    estado do sintetizador e ciclo de vida do áudio
├── lib/rope.ts          física dos cabos (Verlet)
├── providers/rack.ts    contextos do rack
├── components/
│   ├── atoms/           Knob, Jack
│   └── organisms/       Header, Hero, Rack, Features, Buy, Footer
└── constants/           curvas de animação
```

---

Produto fictício, criado como peça de portfólio.
