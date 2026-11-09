/* =====================================================================
   DOMUS AVIAE — CHARACTER APPEARANCE
   ---------------------------------------------------------------------
   Edit anything here: hair colours, hair styles, skin, clothes, height.
   Colours are normal CSS hex colours (#rrggbb).

   hairStyle options:  'short' | 'long' | 'bob' | 'ponytail' | 'pigtails' | 'curly'
   height:             in pixels (roughly 13 = small child, 17 = short adult,
                       23 = tall adult). Characters are 10 pixels wide.
   dress: true         draws a dress/skirt instead of trousers.
   ===================================================================== */

window.CHARACTERS = {

  // Grandma — short, brown hair, always dressed in black.
  avia: {
    hair: '#5b3a24', hairStyle: 'curly',
    skin: '#f1cdb0',
    top: '#1c1b21', bottom: '#1c1b21', dress: true,
    shoes: '#0d0d10',
    height: 17,
    trim: '#3b3a44'          // subtle detail colour on the black dress
  },

  // The grandchild (me) — blond and tall.
  me: {
    child: { hair: '#efd06a', hairStyle: 'short', skin: '#f6d6bb',
             top: '#2f6fb3', bottom: '#3a3d55', shoes: '#4a2f22', height: 15 },
    teen:  { hair: '#e9c95e', hairStyle: 'short', skin: '#f6d6bb',
             top: '#3f7f4a', bottom: '#2e3550', shoes: '#3a2a20', height: 21 },
    adult: { hair: '#e3c25a', hairStyle: 'short', skin: '#f3d2b5',
             top: '#ece4d2', bottom: '#2a2f45', shoes: '#2a1d16', height: 23 }
  },

  // The cousins: 2 boys and 4 girls.
  cousins: [
    { hair: '#17120f', hairStyle: 'short',    skin: '#efc9a6', top: '#b8322a', bottom: '#33415c', shoes: '#2b2b2b', height: 15 },  // boy, black hair
    { hair: '#f0d47a', hairStyle: 'short',    skin: '#f6d6bb', top: '#2f8f83', bottom: '#4a3f35', shoes: '#2b2b2b', height: 14 },  // boy, blond
    { hair: '#7a4a26', hairStyle: 'long',     skin: '#f3cfb2', top: '#d9779a', bottom: '#d9779a', shoes: '#6b3b3b', height: 15, dress: true }, // girl
    { hair: '#c98b3c', hairStyle: 'ponytail', skin: '#f6d6bb', top: '#7d5bb5', bottom: '#3a3d55', shoes: '#3a2a20', height: 14 },  // girl
    { hair: '#3a2416', hairStyle: 'pigtails', skin: '#efc9a6', top: '#e0a531', bottom: '#e0a531', shoes: '#5a3a22', height: 13, dress: true }, // girl
    { hair: '#e8c46a', hairStyle: 'bob',      skin: '#f6d6bb', top: '#5a9bd4', bottom: '#5a9bd4', shoes: '#3a2a20', height: 14, dress: true }  // girl
  ]
};
