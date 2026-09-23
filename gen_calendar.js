// Gera calendar.json a partir dos 30 posts (mesmo conteúdo do calendário publicado).
const fs = require('fs');

const cats = ["inst","h24","fila","dia","com","sabia"];

const posts = [
[
 {n:1,cat:"inst",c:"Chegou o Seu Zé! 🛍️ Um mercado de verdade dentro do seu condomínio, para resolver o dia a dia sem sair de casa. Precisou? Tem no Seu Zé. 🧡\n\n#SeuZé #MercadoDoCondomínio #Praticidade"},
 {n:2,cat:"h24",c:"2h da manhã e bateu aquela fome? Relaxa, o Seu Zé nunca fecha. Aberto 24 horas, todos os dias. 🌙🛒\n\n#SeuZé #Aberto24Horas"},
 {n:3,cat:"fila",c:"Pix, cartão por aproximação ou pelo app: no Seu Zé você entra, pega o que precisa e sai rapidinho. Sem fila, sem perder tempo. ⚡\n\n#SeuZé #SemFila"},
 {n:4,cat:"dia",c:"Faltou um ingrediente no meio da receita? Relaxa. O Seu Zé resolve em 2 minutos, sem sair do condomínio. 🍳\n\n#SeuZé #DiaADia"},
 {n:5,cat:"com",c:"Sem sair do prédio para resolver o essencial: o Seu Zé é parte do seu condomínio, feito pra quem mora aqui. 🏢\n\n#SeuZé #Comunidade"},
 {n:6,cat:"sabia",c:"O Seu Zé repõe as prateleiras 2 vezes por semana. Ou seja: sempre tem novidade por aqui! 📦\n\n#SeuZé #VocêSabia"},
],
[
 {n:7,cat:"inst",c:"Não é só um mercado. É o seu mercado, sempre por aqui, aberto quando você precisa. 🛒\n\n#SeuZé #SempreporAqui"},
 {n:8,cat:"h24",c:"Feriado, domingo, de madrugada... não importa o dia, o Seu Zé está sempre de portas abertas pra você. ⏰\n\n#SeuZé #Aberto24Horas"},
 {n:9,cat:"fila",c:"Chega de perder tempo em fila de supermercado. No Seu Zé, o autoatendimento resolve em segundos. ⏱️\n\n#SeuZé #Autoatendimento"},
 {n:10,cat:"dia",c:"Visita chegou sem avisar e a geladeira tá vazia? Corre até o Seu Zé, que a gente te ajuda a salvar o dia. 🙌\n\n#SeuZé #DiaADia"},
 {n:11,cat:"com",c:"Não tem mais perto que isso: o Seu Zé fica a poucos passos da sua porta, todos os dias. 🚶\n\n#SeuZé #PertoDeCasa"},
 {n:12,cat:"sabia",c:"No Seu Zé você pode pagar por Pix, cartão por aproximação ou pelo aplicativo. Você escolhe o jeito mais fácil. 📲\n\n#SeuZé #VocêSabia"},
],
[
 {n:13,cat:"inst",c:"Pensado para quem mora aqui: produtos do dia a dia, preço justo e a poucos passos da sua porta. Esse é o Seu Zé. 🏠\n\n#SeuZé #MercadoDoCondomínio"},
 {n:14,cat:"h24",c:"Café da manhã cedo demais ou lanche tarde da noite: pode contar com o Seu Zé, 24 horas por dia, todos os dias. ☕🌃\n\n#SeuZé #Aberto24h"},
 {n:15,cat:"fila",c:"Sabe aquele minuto que faz diferença? No Seu Zé, você economiza tempo em cada compra. 🕐\n\n#SeuZé #Praticidade"},
 {n:16,cat:"dia",c:"Aquele desejo de chocolate às 15h existe, sim. E o Seu Zé está logo ali para resolver. 🍫\n\n#SeuZé #DiaADia"},
 {n:17,cat:"com",c:"O Seu Zé conhece a rotina do seu condomínio e está aqui pra facilitar o seu dia. 🏠\n\n#SeuZé #Comunidade"},
 {n:18,cat:"sabia",c:"O Seu Zé funciona 24 horas por dia, 7 dias por semana. Sim, até no Natal! 🎄\n\n#SeuZé #VocêSabia"},
],
[
 {n:19,cat:"inst",c:"Pequeno no tamanho, gigante na praticidade. O Seu Zé cabe na rotina de qualquer morador. 💪\n\n#SeuZé #Conveniência"},
 {n:20,cat:"h24",c:"Seja 7h ou 23h, o Seu Zé está pronto pra te atender. Sem hora marcada, sem desculpa. ⏱️\n\n#SeuZé #Aberto24Horas"},
 {n:21,cat:"fila",c:"Pix, aproximação ou app: escolha como pagar e pronto. Simples, rápido e sem complicação. 📲\n\n#SeuZé #PagamentoFácil"},
 {n:22,cat:"dia",c:"Home office também tem fome. Sem sair do prédio, o Seu Zé garante o seu lanche da tarde. 💻🥪\n\n#SeuZé #HomeOffice"},
 {n:23,cat:"com",c:"Ter um mercado dentro de casa (quase!) é ter mais praticidade no seu dia. O Seu Zé faz parte disso. ✨\n\n#SeuZé #Condomínio"},
 {n:24,cat:"sabia",c:"O acesso ao Seu Zé é só de moradores, com cadastro facial. Segurança em primeiro lugar. 🔒\n\n#SeuZé #VocêSabia"},
],
[
 {n:25,cat:"inst",c:"De segunda a domingo, o Seu Zé já faz parte do dia a dia de quem mora aqui. E o seu, já conhece? 🛍️\n\n#SeuZé #RotinaFacilitada"},
 {n:26,cat:"h24",c:"Pense no Seu Zé como aquele plantão que nunca falha: sempre aberto, sempre por perto. 🛎️\n\n#SeuZé #Aberto24h"},
 {n:27,cat:"fila",c:"A gente sabe que ninguém gosta de esperar. Por isso o Seu Zé foi pensado pra ser rápido do início ao fim. 🚀\n\n#SeuZé #SemFila"},
 {n:28,cat:"dia",c:"Churrasco de última hora ou aquele lanche de sábado: o Seu Zé tem o que falta pra completar o fim de semana. 🍻\n\n#SeuZé #FimDeSemana"},
 {n:29,cat:"com",c:"O Seu Zé está aberto pra todo mundo do condomínio, todos os dias, o ano inteiro. 🎉\n\n#SeuZé #Comunidade"},
 {n:30,cat:"sabia",c:"O Seu Zé leva, em média, só 3 meses entre a assinatura do contrato e a inauguração no condomínio. Rapidinho! 🚀\n\n#SeuZé #VocêSabia"},
],
].flat();

// 30 datas úteis (seg–sáb, sem domingo) a partir da próxima segunda-feira, publicando 14:00 UTC (11h em Fortaleza)
function weekdays(startISO, n) {
  const out = [];
  let d = new Date(startISO + "T00:00:00Z");
  while (out.length < n) {
    if (d.getUTCDay() !== 0) out.push(new Date(d)); // pula domingo
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}
const dates = weekdays("2026-09-24", 30);

const CAROUSEL_CAPTION = `Chegou o Seu Zé! 🛍️

Um mini mercado 100% autônomo, dentro do seu condomínio, funcionando 24 horas por dia — sem fila, com autoatendimento e pagamento por Pix, cartão ou app.

Já estamos em Fortaleza e seguimos expandindo para toda a Região Metropolitana. 📍

Arrasta pro lado e conhece a ideia completa 👉

Precisou? Tem no Seu Zé.

#SeuZé #Fortaleza #RegiãoMetropolitana #MercadoDoCondomínio #Autoatendimento`;

const calendar = posts.map((p, i) => {
  const d = dates[i];
  d.setUTCHours(14, 0, 0, 0); // 11h Fortaleza (UTC-3)
  const id = `post-${String(p.n).padStart(2, "0")}`;

  // Post 1 vira o carrossel de apresentação do Seu Zé (ideia do negócio + área de atuação).
  if (p.n === 1) {
    return {
      id,
      date: d.toISOString(),
      category: "carrossel-institucional",
      feed_images: [
        "images/feed/carousel_intro/slide_01.png",
        "images/feed/carousel_intro/slide_02.png",
        "images/feed/carousel_intro/slide_03.png",
        "images/feed/carousel_intro/slide_04.png",
        "images/feed/carousel_intro/slide_05.png",
        "images/feed/carousel_intro/slide_06.png",
      ],
      feed_caption: CAROUSEL_CAPTION,
      story_image: `images/story/${p.cat}.png`,
    };
  }

  return {
    id,
    date: d.toISOString(),
    category: p.cat,
    feed_image: `images/feed/${p.cat}.png`,
    feed_caption: p.c,
    story_image: `images/story/${p.cat}.png`,
  };
});

fs.writeFileSync("calendar.json", JSON.stringify(calendar, null, 2), "utf-8");
console.log(`Gerado calendar.json com ${calendar.length} posts.`);
console.log("Primeiro:", calendar[0].date, "Último:", calendar[calendar.length - 1].date);
