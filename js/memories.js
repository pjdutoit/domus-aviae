/* =====================================================================
   DOMUS AVIAE — ALL THE WORDS IN THE GAME (Latin + Afrikaans)
   ---------------------------------------------------------------------
   Edit freely. Each memory has:
     titleLa   – short Latin title             (checked with Whitaker's Words)
     titleAf   – Afrikaans meaning of the title
     la        – one simple Latin sentence      (checked with Whitaker's Words)
     laAf      – Afrikaans translation of that sentence
     text      – the full memory, in Afrikaans (write whatever you like here)
   If you change any Latin, re-run:  python tools/verify_latin.py
   The order of this list is the order the Smarties trail follows.
   ===================================================================== */

window.MEMORIES = [
  {
    id: 'macncheese', room: 'theatrum',
    titleLa: 'Cena Parata Est', titleAf: 'Kos Is Reg',
    la: 'Avia nos ad cenam vocat.', laAf: 'Ouma roep ons vir aandete.',
    text: 'Ouma het ons uit die TV-kamer geroep, en al die neefies en niggies het tafel toe gehardloop. Dit kon net een ding beteken: Ouma se famous macorini en cheese.'
  },
  {
    id: 'millionaire', room: 'theatrum',
    titleLa: 'Ludus Quaestionum', titleAf: "'n Vraespel",
    la: 'Simul quaestionibus respondemus.', laAf: 'Saam beantwoord ons die vrae.',
    text: 'In die aande het ek met Ouma voor die TV na Who Wants to Be a Millionaire gekyk. Ons het ons antwoorde uitgeroep, oor die hulplyne gestry en saam gewag vir die finale antwoord.'
  },
  {
    id: 'christmas', room: 'theatrum',
    titleLa: 'Natalis Domini', titleAf: 'Kersfees',
    la: 'Omnes consobrini in theatro dormimus.', laAf: 'Ons almal, die neefies en niggies, slaap in die TV-kamer.',
    text: 'Met Kersfees het die TV-kamer een groot slaapkamer geword. Al die neefies en niggies het langs mekaar op die vloer geslaap en gefluister lank nadat die ligte af is.'
  },
  {
    id: 'latin', room: 'triclinium',
    titleLa: 'Lingua Latina', titleAf: 'Die Latynse Taal',
    la: 'Avia me linguam Latinam docet; ego pauca memini.', laAf: 'Ouma leer my Latyn; ek onthou min daarvan.',
    text: 'Aan die eetkamertafel het Ouma my Latyn geleer: verbuigings, vervoegings, alles. Ek gaan eerlik wees, ek onthou nie meer veel daarvan nie. Maar amo, amas, amat sit nog vas!'
  },
  {
    id: 'myths', room: 'triclinium',
    titleLa: 'Fabulae Graecae', titleAf: 'Griekse Stories',
    la: 'Dum laborat, Avia fabulas deorum narrat.', laAf: 'Terwyl sy werk, vertel Ouma stories van die gode.',
    text: 'Terwyl Ouma gewerk het, het jy my die ou Griekse mites vertel: gode en helde, monsters en lang reise huis toe. Ek het aan elke woord gehang.'
  },
  {
    id: 'chocolate', room: 'culina',
    titleLa: 'Thesaurus Dulcium', titleAf: 'Die Skatkis van Lekkers',
    la: 'In culina arca dulcium semper plena est.', laAf: 'In die kombuis is die lekkergoedblik altyd vol.',
    text: 'Ouma se beroemde chocolate blik in die kombuis. Op een of ander manier was dit altyd vol.'
  },
  {
    id: 'vase', room: 'cubiculum',
    titleLa: 'Iterum atque Iterum', titleAf: 'Weer en Weer',
    la: 'Vasculum saepe fregi; Avia saepe glutinavit.', laAf: 'Ek het die vase dikwels gebreek; Ouma het dit dikwels weer vasgeplak.',
    text: "Daardie klein vase in Ouma se slaapkamer het ek nie net een keer gebreek nie, maar 'n paar keer. En elke keer het Ouma dit geduldig weer aanmekaar geplak. (Jammer, Ouma!)"
  },
  {
    id: 'dvds', room: 'bibliotheca',
    titleLa: 'Quid Spectabimus?', titleAf: 'Waarna Gaan Ons Kyk?',
    la: 'Consobrini fabulam eligunt.', laAf: "Die neefies en niggies kies 'n storie.",
    text: "Om saam met die neefies en niggies 'n DVD te kies, was ernstige onderhandelinge. Ons het hulle een vir een van die rakke afgehaal totdat ons uiteindelik oor iets saamgestem het."
  },
  {
    id: 'forum', room: 'forum',
    titleLa: 'In Foro', titleAf: 'By die Forum',
    la: 'Quisque nostrum unam rem eligit.', laAf: 'Elkeen van ons kies een ding.',
    text: 'Ouma het ons almal mall toe gevat, en elkeen van ons kon een ding kies. Kies was die moeilikste deel, en die beste deel.'
  },
  {
    id: 'bakery', room: 'pistrinum',
    titleLa: 'Melktertjies', titleAf: 'Melktertjies',
    la: 'In pistrino Turkstra melktertjies emimus.', laAf: 'By die Turkstra-bakkery koop ons melktertjies.',
    text: "'n Draai by die Turkstra-bakkery het altyd melktertjies beteken. Niks het nog ooit so lekker gesmaak nie."
  },
  {
    id: 'aardklop', room: 'aardklop',
    titleLa: 'Pompa Aardklop', titleAf: 'Die Aardklop-optog',
    la: 'Post Aviam et iuxta eam ambulamus.', laAf: 'Ons loop agter Ouma en langs haar.',
    text: "By Aardklop het al die neefies en niggies agter Ouma en langs Ouma geloop: 'n klein optog wat Ouma deur die fees gevolg het."
  },
  {
    id: 'piano', room: 'oecus',
    titleLa: 'Litterae in Clavibus', titleAf: 'Letters op die Klawers',
    la: 'Avia litteras in clavibus scribit.', laAf: 'Ouma skryf letters op die klawers.',
    text: "Ouma het my klavier leer speel op 'n keyboard in die sitkamer. Ouma het die naam van elke noot op sy ooreenstemende noot met 'n koukie geskryf, sodat ek altyd geweet het waar my vingers moet gaan."
  }
];

/* ---------------------------------------------------------------------
   Other words used in the game
   --------------------------------------------------------------------- */
window.TEXTS = {
  title: 'DOMVS · AVIAE',
  subtitle: 'Ouma se Huis',
  enter: 'Intra',                    // "Enter!"
  enterAf: 'Kom binne',

  intro: [
    'Elke Paasfees het Ouma Smarties regdeur die huis weggesteek, en ons neefies en niggies het kamer vir kamer daarna gesoek.',
    'Hierdie keer is dit Ouma se beurt om te soek.',
    'Volg die Smarties. Die skat, hierdie keer, is ons herinneringe.'
  ],
  introHint: "Tik enige plek om te loop. Tik op 'n blink plek om 'n herinnering oop te maak.",
  begin: 'Perge',                    // "Go on!"
  beginAf: 'Begin',

  helpTitle: 'Auxilium',             // "Help"
  helpTitleAf: 'Hoe om te speel',
  help: [
    'Tik enige plek op die kaart, en Ouma loop soontoe. (Op \'n rekenaar werk die pyltjies ook.)',
    'Volg die Smarties: hulle wys die pad na die volgende herinnering.',
    '\'n Goue sterretjie wys waar \'n herinnering wag. Tik daarop om dit oop te maak.',
    'Tik op MEMORIAE bo-aan om die herinneringe wat reeds gevind is weer te lees.',
    'Op elke kaartjie kan jy tussen Latine en Afrikaans wissel.',
    'Wanneer al twaalf gevind is, gaan die studeerkamer oop.'
  ],

  counter: 'Memoriae',               // "Memories"
  newMemoryLa: 'Memoria inventa',    // "A memory found"
  newMemoryAf: 'Herinnering gevind',
  galleryTitle: 'Memoriae Inventae', // "Memories found"
  galleryEmpty: 'Volg die Smarties na die eerste herinnering.',
  close: 'Perge',                    // "Go on!"
  restart: 'Denuo incipe',           // "Begin again"
  restartAf: 'Begin weer',
  restartConfirm: 'Begin die soektog weer van voor af?',

  lockedLa: 'Ianua clausa est.',     // "The door is closed."
  lockedAf: 'Die studeerkamer is gesluit. Vind eers al twaalf herinneringe.',
  unlockedLa: 'Ianua aperta est!',   // "The door is open!"
  unlockedAf: 'Die studeerkamer is oop. Volg die Smarties nog een laaste keer.',

  finaleTitleLa: 'Tablinum, Hodie',  // "The study, today"
  finaleTitleAf: 'Ouma se Studeerkamer, Vandag',
  finaleLa: 'Dominicis noctibus hic clavibus cano, quia tu me olim incitavisti.',
  finaleLaAf: 'Op Sondagaande speel ek hier klavier, want Ouma het my daai tyd inspireer.',
  finaleText: "Ouma se studeerkamer, vandag. Op Sondagaande sit ek hier en speel klavier, alles danksy 'n klein keyboard in die sitkamer en die letters wat Ouma op elke noot geskryf het.",

  inscription: ['FELICEM · DIEM', 'NATALEM', 'AVIA'],   // one entry per carved line
  inscriptionSub: 'TE · SEMPER · AMABO',              // "I will always love you"
  inscriptionSubAf: 'Ek sal Ouma altyd liefhê',
  dedication: 'Gelukkige verjaarsdag, Ouma! Dankie vir elke Paasfees-soektog, elke storie, elke les en elke bord macaroni-en-kaas. Ouma is vir my die grootste skat.',
  signature: 'Met al my liefde',
  revisit: 'Memoriae',
  revisitAf: 'Kyk weer na die herinneringe',

  credit: 'Vloerteëls deur Thalia Took'
};

/* Room names shown when you walk into a room. */
window.ROOM_NAMES = {
  atrium:      { la: 'Atrium',       af: 'Voorportaal' },
  theatrum:    { la: 'Theatrum',     af: 'TV-kamer' },
  triclinium:  { la: 'Triclinium',   af: 'Eetkamer' },
  oecus:       { la: 'Oecus',        af: 'Sitkamer' },
  bibliotheca: { la: 'Bibliotheca',  af: 'DVD-kamer' },
  cubiculum:   { la: 'Cubiculum',    af: 'Slaapkamer' },
  culina:      { la: 'Culina',       af: 'Kombuis' },
  tablinum:    { la: 'Tablinum',     af: 'Studeerkamer' },
  oppidum:     { la: 'Forum Oppidi', af: 'Die dorpsplein' },
  forum:       { la: 'Forum',        af: 'Die mall' },
  pistrinum:   { la: 'Pistrinum',    af: 'Turkstra-bakkery' },
  aardklop:    { la: 'Aardklop',     af: 'Aardklop-fees' }
};
