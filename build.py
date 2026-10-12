#!/usr/bin/env python3
"""Inline web/ + data/trail.json into one offline file: dist/confirmation-trail.html."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def rd(rel):
    with open(os.path.join(HERE, rel), encoding="utf-8") as f:
        return f.read()


def main():
    data_path = os.path.join(HERE, "data", "trail.json")
    with open(data_path, encoding="utf-8") as f:
        data = json.load(f)
    data_js = json.dumps(data, ensure_ascii=False)
    n = len(data.get("kids", []))
    html = rd("web/index.html")
    html = html.replace("/*__CSS__*/", rd("web/app.css"))
    html = html.replace("/*__TRAIL__*/ null /*__/TRAIL__*/", data_js)
    app = rd("web/app.js").replace("</script", "<\\/script")
    html = html.replace("/*__APP__*/", app)
    os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
    out = os.path.join(HERE, "dist", "confirmation-trail.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"built {out} ({os.path.getsize(out):,} bytes) · kids={n}")


if __name__ == "__main__":
    main()
