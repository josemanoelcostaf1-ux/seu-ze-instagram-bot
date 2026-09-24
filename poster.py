"""
Publica automaticamente no Instagram os posts de calendar.json cuja data já chegou.
Usa a Instagram Graph API (Meta) — precisa de IG_USER_ID e IG_ACCESS_TOKEN nas variáveis
de ambiente (definidos como Secrets no GitHub Actions).

Estado (o que já foi publicado) fica em state.json, sem banco de dados — mesmo padrão do
projeto irmão eletroposto-whatsapp.
"""
import datetime
import json
import os
import pathlib
import sys
import time

import requests

REPO = os.environ.get("GITHUB_REPOSITORY", "SEU_USUARIO/seu-ze-instagram-bot")
BRANCH = os.environ.get("REPO_BRANCH", "main")
REPO_RAW_BASE = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}"

HERE = pathlib.Path(__file__).parent
CALENDAR_PATH = HERE / "calendar.json"
STATE_PATH = HERE / "state.json"
GRAPH = "https://graph.instagram.com/v21.0"

IG_USER_ID = os.environ.get("IG_USER_ID", "")
ACCESS_TOKEN = os.environ.get("IG_ACCESS_TOKEN", "")


def load_json(path, default):
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return default


def save_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def image_url(rel_path):
    return f"{REPO_RAW_BASE}/{rel_path}"


def create_container(image_path, caption="", is_story=False, is_carousel_item=False):
    url = f"{GRAPH}/{IG_USER_ID}/media"
    payload = {"image_url": image_url(image_path), "access_token": ACCESS_TOKEN}
    if is_story:
        payload["media_type"] = "STORIES"
    elif is_carousel_item:
        payload["is_carousel_item"] = "true"  # itens do carrossel não levam legenda própria
    else:
        payload["caption"] = caption
    r = requests.post(url, data=payload, timeout=30)
    if not r.ok:
        raise RuntimeError(f"Erro ao criar container ({r.status_code}): {r.text}")
    return r.json()["id"]


def create_carousel_container(children_ids, caption=""):
    """Cria o container "pai" de um carrossel a partir dos containers filhos já criados."""
    url = f"{GRAPH}/{IG_USER_ID}/media"
    payload = {
        "media_type": "CAROUSEL",
        "children": ",".join(children_ids),
        "caption": caption,
        "access_token": ACCESS_TOKEN,
    }
    r = requests.post(url, data=payload, timeout=30)
    if not r.ok:
        raise RuntimeError(f"Erro ao criar carrossel ({r.status_code}): {r.text}")
    return r.json()["id"]


def publish_container(container_id):
    url = f"{GRAPH}/{IG_USER_ID}/media_publish"
    r = requests.post(
        url, data={"creation_id": container_id, "access_token": ACCESS_TOKEN}, timeout=30
    )
    if not r.ok:
        raise RuntimeError(f"Erro ao publicar ({r.status_code}): {r.text}")
    return r.json()


def main():
    if not IG_USER_ID or not ACCESS_TOKEN:
        print("IG_USER_ID/IG_ACCESS_TOKEN ainda não configurados nos secrets — nada a fazer.")
        return

    calendar = load_json(CALENDAR_PATH, [])
    state = load_json(STATE_PATH, {})
    now = datetime.datetime.now(datetime.timezone.utc)

    changed = False
    for post in calendar:
        pid = post["id"]
        entry = state.setdefault(pid, {})
        if entry.get("feed_posted") and entry.get("story_posted"):
            continue

        scheduled = datetime.datetime.fromisoformat(post["date"].replace("Z", "+00:00"))
        if scheduled > now:
            continue  # ainda não chegou a hora

        if not entry.get("feed_posted"):
            try:
                if post.get("feed_images"):  # carrossel: várias imagens em um post só
                    children = []
                    for img in post["feed_images"]:
                        children.append(create_container(img, is_carousel_item=True))
                        time.sleep(3)
                    cid = create_carousel_container(children, caption=post["feed_caption"])
                else:
                    cid = create_container(post["feed_image"], caption=post["feed_caption"])
                time.sleep(8)  # dá tempo do Meta processar a imagem antes de publicar
                res = publish_container(cid)
                entry["feed_posted"] = True
                entry["feed_media_id"] = res.get("id")
                entry["feed_posted_at"] = now.isoformat()
                print(f"[OK] Feed publicado: {pid}")
                changed = True
            except Exception as e:  # nunca deixa um erro derrubar o resto do lote
                print(f"[ERRO] Feed {pid}: {e}", file=sys.stderr)

        if not entry.get("story_posted"):
            try:
                cid = create_container(post["story_image"], is_story=True)
                time.sleep(8)
                res = publish_container(cid)
                entry["story_posted"] = True
                entry["story_media_id"] = res.get("id")
                entry["story_posted_at"] = now.isoformat()
                print(f"[OK] Story publicado: {pid}")
                changed = True
            except Exception as e:
                print(f"[ERRO] Story {pid}: {e}", file=sys.stderr)

    if changed:
        save_json(STATE_PATH, state)
    else:
        print("Nada para publicar agora.")


if __name__ == "__main__":
    main()
