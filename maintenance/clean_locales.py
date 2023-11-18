import json
from collections import OrderedDict
from pathlib import Path
from typing import Any

# FIXME use Path
ROOT_FOLDER = Path(__file__).parent.parent
LOCALES_FOLDER = ROOT_FOLDER / "locales"
LOCALES_LIST_FILE = ROOT_FOLDER / "maintenance" / "locales.json"
LOCALE_FILES = {path.stem: path for path in LOCALES_FOLDER.glob("*.json")}
ALL_LOCALES = set(LOCALE_FILES.keys())


def get_json(path: Path) -> Any:
    return json.loads(path.read_text(), object_pairs_hook=OrderedDict)


def save_json(path: Path, data: Any, sort: bool = False) -> None:
    with path.open("w", encoding="utf-8") as fp:
        json.dump(data, fp, ensure_ascii=False, sort_keys=sort, indent=4)
        fp.write("\n")


def get_flatten_keys(d, parent_key=""):
    items = set()

    for k, v in d.items():
        key = f"{parent_key}.{k}" if parent_key else k
        items.add(key)

        if isinstance(v, dict):
            items |= get_flatten_keys(v, key)

    return items


def filter_data(data, stale_keys):
    filtered = OrderedDict()

    for k, v in data.items():
        if k not in stale_keys:
            value = v

            if isinstance(v, OrderedDict):
                nested_stale_keys = [
                    key.replace(f"{k}.", "")
                    for key in stale_keys
                    if key.startswith(f"{k}.")
                ]
                if nested_stale_keys:
                    value = filter_data(v, nested_stale_keys)

            filtered[k] = value

    return filtered


def remove_stale_translations(ref="en", locales=None):
    locales = set(locales) if locales else set(ALL_LOCALES)
    locales.discard(ref)

    ref_path = LOCALE_FILES[ref]
    ref_data = get_json(ref_path)
    ref_keys = get_flatten_keys(ref_data)

    for locale in locales:
        path = LOCALE_FILES[locale]
        data = get_json(path)
        keys = get_flatten_keys(data)
        stale_keys = sorted(keys - ref_keys)
        filtered_data = filter_data(data, stale_keys)
        save_json(path, filtered_data)

    # Resave ref file to sort and indent
    save_json(ref_path, ref_data, sort=True)


def generate_locales_list():
    locales = []

    for locale in sorted(ALL_LOCALES):
        path = LOCALE_FILES[locale]
        data = get_json(path).get("_language", {})
        code = data.get("code", locale)
        fallback = [
            code.strip() for code in data.get("fallback", "").strip().split(",")
        ]
        # Remove "en" from fallback locales since there's already a last resort fallback to "en"
        fallback = [code for code in fallback if code not in ("en", "")]

        if locale != code:
            # Warn that translators have changed the language code
            print(
                f"Language's code for file '{locale}.json' is '{code}': file"
                " should probably be renamed to '{code}.json'"
            )

        locales.append(
            {
                "code": code,
                "iso": code,
                "name": data.get("name", code),
                "dir": data.get("dir", "ltr"),
                "fallback": fallback or None,
                "file": f"{locale}.json",
            }
        )

    save_json(LOCALES_LIST_FILE, locales, sort=True)


if __name__ == "__main__":
    remove_stale_translations()
    generate_locales_list()
