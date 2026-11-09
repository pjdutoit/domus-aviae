"""Check every Latin word in js/memories.js with Whitaker's Words.

Run:   python tools/verify_latin.py            (original Whitaker's Words, via latin-words.com)
       python tools/verify_latin.py --offline  (open_words Python port; it has gaps -
                                                 install: pip install git+https://github.com/ArchimedesDigital/open_words)

For every Latin line it prints each word with its possible forms, so you can
confirm the intended reading. Whitaker's Words checks word FORMS, not grammar,
so read the sentences too.
"""
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SRC = Path(__file__).resolve().parent.parent / "js" / "memories.js"
NOT_LATIN = {"turkstra", "melktertjies", "aardklop"}          # Afrikaans names, kept as-is
LATIN_KEYS = ("titleLa", "la", "enter", "begin", "counter", "newMemoryLa", "galleryTitle",
              "close", "restart", "lockedLa", "unlockedLa", "finaleTitleLa", "finaleLa",
              "inscriptionSub", "title", "revisit")
OFFLINE = "--offline" in sys.argv


def collect_lines():
    src = SRC.read_text(encoding="utf-8")
    out = []
    for key in LATIN_KEYS:
        for m in re.finditer(r"\b" + key + r"\s*:\s*'((?:[^'\\]|\\.)*)'", src):
            out.append((key, m.group(1)))
    for m in re.finditer(r"inscription\s*:\s*\[([^\]]*)\]", src):
        out.extend(("inscription", s) for s in re.findall(r"'([^']*)'", m.group(1)))
    seen, uniq = set(), []
    for k, t in out:
        if t not in seen:
            seen.add(t)
            uniq.append((k, t))
    return uniq


_cache = {}


def lookup_online(word):
    if word in _cache:
        return _cache[word]
    url = "https://latin-words.com/cgi-bin/translate.cgi?query=" + urllib.parse.quote(word)
    req = urllib.request.Request(url, headers={"User-Agent": "domus-aviae-latin-check"})
    with urllib.request.urlopen(req, timeout=30) as r:
        msg = json.loads(r.read().decode("utf-8", "replace")).get("message", "")
    time.sleep(0.4)
    lines = [ln.rstrip() for ln in msg.replace("\r", "").split("\n") if ln.strip()]
    ok = bool(lines) and not any("UNKNOWN" in ln for ln in lines[:1])
    _cache[word] = (ok, lines)
    return ok, lines


def lookup_offline(word, parser):
    res = parser.parse(word)
    defs = res.get("defs", []) if isinstance(res, dict) else []
    lines = []
    for d in defs[:3]:
        lines.append(", ".join(d.get("orth", [])[:4]) + "  " + "; ".join(d.get("senses", [])[:1])[:60])
        for inf in d.get("infls", [])[:5]:
            f = inf.get("form", {})
            lines.append("   - " + inf.get("pos", "") + ": " + " ".join(str(v) for v in f.values() if v))
    return bool(defs), lines


def main():
    parser = None
    if OFFLINE:
        from open_words.parse import Parse
        parser = Parse()
    problems = []
    for key, text in collect_lines():
        print("\n" + "=" * 72 + f"\n[{key}]  {text}")
        for raw in re.findall(r"[A-Za-z]+", text):
            word = raw.lower()
            if word in NOT_LATIN:
                print(f"  {raw}: (Afrikaans name, not checked)")
                continue
            if raw.isupper() and len(raw) > 1:      # inscriptional V for U
                word = word.replace("v", "u")
            try:
                ok, lines = lookup_offline(word, parser) if OFFLINE else lookup_online(word)
            except Exception as e:                  # noqa: BLE001
                ok, lines = False, [f"lookup error: {e}"]
            print(f"  {raw}:" + ("" if ok else "   !! NOT RECOGNISED"))
            for ln in lines[:10]:
                print("      " + ln)
            if not ok:
                problems.append((text, raw))
    print("\n" + "=" * 72)
    if problems:
        print("Words NOT recognised (check by hand):")
        for t, w in problems:
            print(f"  {w}  in  {t}")
    else:
        print("All Latin words recognised.")


if __name__ == "__main__":
    main()
