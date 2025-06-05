#!/bin/bash
# Vérifier les arguments
if [ "$#" -lt 5 ] || [ $(( ($# - 3) % 2 )) -ne 0 ]; then
    echo "Usage: $0 <json_path> <version_cle> <version_nom> <url1> <dest1> [<url2> <dest2> ...]"
    exit 1
fi

JSON_PATH="$1"
VERSION_CLE="$2"
VERSION_NOM="$3"
shift 3

FILES_JSON=$(jq -n '[]')  # tableau vide

while [ "$#" -gt 1 ]; do
    URL="$1"
    DEST="$2"
    ENTRY=$(jq -n --arg url "$URL" --arg dest "$DEST" '{url: $url, destination: $dest}')
    FILES_JSON=$(jq --argjson arr "$FILES_JSON" --argjson new "$ENTRY" '$arr + [$new]' <<< "")
    FILES_JSON=$(jq --argjson files "$FILES_JSON" '$files' <<< "")
    shift 2
done


# Mettre à jour le fichier JSON
TMP_FILE=$(mktemp)

jq --arg key "$VERSION_CLE" \
   --arg nom "$VERSION_NOM" \
   --argjson files "$FILES_JSON" \
   '.versions[$key] = {nom: $nom, files: $files}' \
   "$JSON_PATH" > "$TMP_FILE" && mv "$TMP_FILE" "$JSON_PATH"

chmod a+r "$JSON_PATH"

echo "Version '$VERSION_CLE' ajoutée/modifiée avec succès."
