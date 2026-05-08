import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from indic2unicode.fontconv import FontConv

fc = FontConv()

# =====================================================
# TEXT CONVERTER
# =====================================================

def convert_text(text):

    lines = text.splitlines()

    result = []

    for line in lines:

        try:
            # IMPORTANT:
            # do NOT use .strip()
            converted = fc.to_unicode('surekh', line)

            result.append(converted)

        except Exception as e:

            print("CONVERT ERROR:", e)

            result.append(line)

    return "\n".join(result)

# =====================================================
# ENTRY POINT
# =====================================================

if __name__ == "__main__":

    file_path = sys.argv[1]

    with open(file_path, "r", encoding="utf-8") as f:

        input_text = f.read()

    print(convert_text(input_text))