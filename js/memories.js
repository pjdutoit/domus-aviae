/* =====================================================================
   DOMUS AVIAE — ALL THE WORDS IN THE GAME
   ---------------------------------------------------------------------
   Edit freely. Each memory has:
     titleLa   – short Latin title           (checked with Whitaker's Words)
     titleEn   – English meaning of the title
     la        – one simple Latin sentence    (checked with Whitaker's Words)
     laEn      – literal English of that sentence
     text      – the full memory, in English (write whatever you like here)
   If you change any Latin, re-run:  python tools/verify_latin.py
   The order of this list is the order the Smarties trail follows.
   ===================================================================== */

window.MEMORIES = [
  {
    id: 'macncheese', room: 'theatrum',
    titleLa: 'Cena Parata Est', titleEn: 'Dinner Is Ready',
    la: 'Avia nos ad cenam vocat.', laEn: 'Grandma calls us to dinner.',
    text: 'You would call us from the TV room, and all of us cousins came running to the table. It could only mean one thing: your famous mac & cheese.'
  },
  {
    id: 'millionaire', room: 'theatrum',
    titleLa: 'Ludus Quaestionum', titleEn: 'A Game of Questions',
    la: 'Simul quaestionibus respondemus.', laEn: 'Together we answer the questions.',
    text: 'Evenings in front of the TV watching Who Wants to Be a Millionaire together. We called out our answers, argued about the lifelines, and waited for the final answer with you.'
  },
  {
    id: 'christmas', room: 'theatrum',
    titleLa: 'Natalis Domini', titleEn: 'Christmas',
    la: 'Omnes consobrini in theatro dormimus.', laEn: 'All of us cousins sleep in the TV room.',
    text: 'At Christmas the TV room turned into one big bedroom. All of us cousins slept side by side on the floor, whispering long after the lights went out.'
  },
  {
    id: 'latin', room: 'triclinium',
    titleLa: 'Lingua Latina', titleEn: 'The Latin Language',
    la: 'Avia me linguam Latinam docet.', laEn: 'Grandma teaches me the Latin language.',
    text: 'At the dining-room table you taught me Latin: the declensions, the verbs, and the joy of finally understanding a sentence. Every Latin word in this little game is here because of you.'
  },
  {
    id: 'myths', room: 'triclinium',
    titleLa: 'Fabulae Graecae', titleEn: 'Greek Stories',
    la: 'Dum laborat, Avia fabulas deorum narrat.', laEn: 'While she works, Grandma tells stories of the gods.',
    text: 'While you worked, you told me the old Greek myths: gods and heroes, monsters and long journeys home. I hung on every word.'
  },
  {
    id: 'chocolate', room: 'culina',
    titleLa: 'Thesaurus Dulcium', titleEn: 'The Treasury of Sweets',
    la: 'In culina arca dulcium semper plena est.', laEn: 'In the kitchen the box of sweets is always full.',
    text: 'Your famous chocolate bin in the kitchen. Somehow it was always full, and somehow we always knew exactly where it was.'
  },
  {
    id: 'vase', room: 'cubiculum',
    titleLa: 'Confessio', titleEn: 'A Confession',
    la: 'Vasculum fregi. Ignosce mihi, Avia!', laEn: 'I broke the little vase. Forgive me, Grandma!',
    text: 'I have something to confess. One of the small vases in your bedroom did not fall over by itself. It was me. I am very sorry, Grandma!'
  },
  {
    id: 'dvds', room: 'bibliotheca',
    titleLa: 'Quid Spectabimus?', titleEn: 'What Shall We Watch?',
    la: 'Consobrini fabulam eligunt.', laEn: 'The cousins choose a story.',
    text: 'Choosing a DVD with the cousins was a serious negotiation. We pulled them off the shelves one by one until we finally agreed on something to watch together.'
  },
  {
    id: 'forum', room: 'forum',
    titleLa: 'In Foro', titleEn: 'At the Forum',
    la: 'Quisque nostrum unam rem eligit.', laEn: 'Each of us chooses one thing.',
    text: 'You took all of us to the mall, and each of us could pick one thing. Choosing was the hardest part, and the best part.'
  },
  {
    id: 'bakery', room: 'pistrinum',
    titleLa: 'Melktertjies', titleEn: 'Melktertjies',
    la: 'In pistrino Turkstra melktertjies emimus.', laEn: 'At the Turkstra bakery we buy melktertjies.',
    text: 'A trip to the Turkstra bakery always meant melktertjies. Nothing has ever tasted quite as good.'
  },
  {
    id: 'aardklop', room: 'aardklop',
    titleLa: 'Pompa Aardklop', titleEn: 'The Aardklop Procession',
    la: 'Post Aviam et iuxta eam ambulamus.', laEn: 'We walk behind Grandma and beside her.',
    text: 'At Aardklop all of us cousins walked behind you and beside you, a little procession following you through the festival.'
  },
  {
    id: 'piano', room: 'oecus',
    titleLa: 'Litterae in Clavibus', titleEn: 'Letters on the Keys',
    la: 'Avia litteras in clavibus scribit.', laEn: 'Grandma writes letters on the keys.',
    text: 'You taught me piano on a keyboard in the living room. You wrote the name of every note on its key, so I always knew where my fingers should go.'
  }
];

/* ---------------------------------------------------------------------
   Other words used in the game
   --------------------------------------------------------------------- */
window.TEXTS = {
  title: 'DOMVS · AVIAE',
  subtitle: "Grandma's House",
  enter: 'Intra',                    // "Enter!"
  enterEn: 'Enter',

  intro: [
    'Every Easter you hid Smarties all through the house, and all of us cousins hunted for them, room by room.',
    'This time the hunt is yours.',
    'Follow the Smarties. The treasure, this time, is our memories.'
  ],
  introHint: 'Tap anywhere to walk. Tap a glowing spot to open a memory.',
  begin: 'Perge',                    // "Go on!"
  beginEn: 'Begin',

  counter: 'Memoriae',               // "Memories"
  newMemoryLa: 'Memoria inventa',    // "A memory found"
  newMemoryEn: 'A memory found',
  galleryTitle: 'Memoriae Inventae', // "Memories found"
  galleryEmpty: 'Follow the Smarties to find your first memory.',
  close: 'Perge',                    // "Go on!"
  restart: 'Denuo incipe',           // "Begin again"
  restartEn: 'Start again',
  restartConfirm: 'Start the hunt again from the beginning?',

  lockedLa: 'Ianua clausa est.',     // "The door is closed."
  lockedEn: 'The study door is locked. Find all twelve memories first.',
  unlockedLa: 'Ianua aperta est!',   // "The door is open!"
  unlockedEn: 'The study door is open. Follow the Smarties one last time.',

  finaleTitleLa: 'Tablinum, Hodie',  // "The study, today"
  finaleTitleEn: 'Your Study, Today',
  finaleLa: 'Dominicis noctibus hic clavibus cano, quia tu me docuisti.',
  finaleLaEn: 'On Sunday nights I play the keys here, because you taught me.',
  finaleText: 'Your study, today. On Sunday nights I sit here and play the piano, all because of a little keyboard in the living room and the letters you wrote on every key.',

  inscription: ['FELICEM · DIEM', 'NATALEM', 'AVIA'],   // one entry per carved line
  inscriptionSub: 'NEPOTES · TVI · TE · AMANT',   // "Your grandchildren love you"
  inscriptionSubEn: 'Your grandchildren love you',
  dedication: 'Happy birthday, Grandma. Thank you for every Easter hunt, every story, every lesson and every bowl of mac & cheese. You are our greatest treasure.',
  signature: 'With all our love, your grandchildren',
  revisit: 'Memoriae',
  revisitEn: 'Revisit the memories',

  credit: 'Floor tiles by Thalia Took'
};

/* Room names shown when you walk into a room. */
window.ROOM_NAMES = {
  atrium:      { la: 'Atrium',      en: 'Entrance hall' },
  theatrum:    { la: 'Theatrum',    en: 'TV room' },
  triclinium:  { la: 'Triclinium',  en: 'Dining room' },
  oecus:       { la: 'Oecus',       en: 'Living room' },
  bibliotheca: { la: 'Bibliotheca', en: 'DVD room' },
  cubiculum:   { la: 'Cubiculum',   en: 'Bedroom' },
  culina:      { la: 'Culina',      en: 'Kitchen' },
  tablinum:    { la: 'Tablinum',    en: 'Study' },
  oppidum:     { la: 'Forum Oppidi', en: 'The town square' },
  forum:       { la: 'Forum',       en: 'The mall' },
  pistrinum:   { la: 'Pistrinum',   en: 'Turkstra bakery' },
  aardklop:    { la: 'Aardklop',    en: 'Aardklop festival' }
};
