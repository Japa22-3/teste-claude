# VanFácil — gestão de van escolar

Protótipo funcional (React 19 + Vite + TypeScript + Tailwind v4) com módulo
financeiro completo, controle de gastos da van e apps separados para
motorista e aluno.

## Rodar

```bash
npm install
npm run dev      # http://localhost:8443
npm run build    # build de produção em dist/
```

A barra escura no topo é do **protótipo**, não do produto: serve para você
navegar entre as 12 telas sem precisar de login. Ela sai quando o app tiver
rotas e autenticação de verdade.

## Estrutura

```
src/
  types.ts              Schema de dados (espelha as tabelas do Supabase)
  data/mockData.ts      Dados fictícios — 8 alunos, 3 meses, 38 despesas
  lib/
    dates.ts            Datas ISO sem bug de fuso horário
    currency.ts         Formatação BRL
    finance.ts          Todos os cálculos (resumo, previsão, km/l, rateio)
    pix.ts              Gerador de BR Code (Pix copia-e-cola) com CRC16
  components/           UI reutilizável (botões, cards, inputs, Pix, mapa)
  screens/              12 telas
supabase/schema.sql     SQL pronto para criar o banco real
```

## As 12 telas

**Público:** Landing

**Motorista:** Painel · Rotas · Alunos · Financeiro (Visão geral /
Mensalidades / Despesas) · Avisos & Van

**Aluno:** Mapa · Pagamentos · Perfil · Embarque

## Estado dos dados

Tudo vive em memória (`useState` no `App.tsx`) e **volta ao original quando
você recarrega a página**. As telas compartilham o mesmo estado, então
marcar uma mensalidade como paga no Financeiro atualiza o app do aluno e o
alerta do painel na mesma hora. Ver `supabase/schema.sql` para persistir.

## Data de referência

O protótipo congela "hoje" em **20/08/2026** (`DEMO_TODAY` em
`src/lib/dates.ts`) para que agosto apareça como mês em andamento, com
pagamentos pagos, pendentes e atrasados ao mesmo tempo. Trocar por
`new Date()` quando conectar ao banco.
