# Domus Aviae

A small birthday gift: Grandma's house reimagined as a Roman villa. Follow the Smarties trail to twelve memories, then to the study.

Plain HTML/CSS/JS with no build step. Open `index.html` or serve the folder.

## Editing

| What | Where |
|---|---|
| All memory text (Latin titles, Latin sentences, Afrikaans memories and translations), intro, finale and dedication | `js/memories.js` |
| Character looks (hair, skin, clothes, height for Avia, me and the cousins) | `js/config.js` |
| Map layout, furniture and room floors | `js/map.js` |
| Finale music | Put a recording at `assets/audio/piano.mp3`. If it's missing, a synthesized *Ode to Joy* plays. |

After changing any Latin, re-check it with `python tools/verify_latin.py`. This looks every word up in Whitaker's Words; it checks the forms, not the grammar.

## Testing shortcuts

- `?debug=all` marks every memory as found and unlocks the study.
- `?debug=5` marks the first 5 as found.
- `?reset=1` clears saved progress.

## Credits

Floor tiles by Thalia Took (thaliatook.com).
Fonts: Cinzel and EB Garamond (Google Fonts).
Music fallback: Beethoven, *Ode to Joy* (public domain).
