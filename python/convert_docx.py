import zipfile
import shutil
import tempfile
import os
import sys
import xml.etree.ElementTree as ET

from converter import convert_text

input_docx = sys.argv[1]
output_docx = sys.argv[2]

# =====================================================
# TEMP DIRECTORY
# =====================================================

temp_dir = tempfile.mkdtemp()

# =====================================================
# EXTRACT DOCX
# =====================================================

with zipfile.ZipFile(input_docx, 'r') as zip_ref:
    zip_ref.extractall(temp_dir)

# =====================================================
# XML FILES TO PROCESS
# =====================================================

xml_files = [
    "word/document.xml",
    "word/header1.xml",
    "word/footer1.xml"
]

# =====================================================
# WORD NAMESPACE
# =====================================================

ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
}

# =====================================================
# PROCESS XML
# =====================================================

for xml_file in xml_files:

    full_path = os.path.join(temp_dir, xml_file)

    if not os.path.exists(full_path):
        continue

    try:

        tree = ET.parse(full_path)
        root = tree.getroot()

        # =============================================
        # PROCESS PARAGRAPHS
        # =============================================

        for para in root.findall(".//w:p", ns):

            text_nodes = para.findall(".//w:t", ns)

            if not text_nodes:
                continue

            # collect full paragraph text
            combined_text = ""

            for node in text_nodes:

                if node.text:
                    combined_text += node.text

            if not combined_text.strip():
                continue

            try:

                # convert FULL paragraph
                converted = convert_text(combined_text)

                # put converted text in first node
                text_nodes[0].text = converted

                # clear remaining nodes
                for extra_node in text_nodes[1:]:
                    extra_node.text = ""

            except Exception as e:
                print("PARAGRAPH ERROR:", e)

        # save XML
        tree.write(
            full_path,
            encoding="utf-8",
            xml_declaration=True
        )

        print(f"Processed: {xml_file}")

    except Exception as e:
        print(f"ERROR in {xml_file}: {e}")

# =====================================================
# REBUILD DOCX
# =====================================================

with zipfile.ZipFile(output_docx, 'w', zipfile.ZIP_DEFLATED) as docx:

    for foldername, subfolders, filenames in os.walk(temp_dir):

        for filename in filenames:

            file_path = os.path.join(foldername, filename)

            archive_path = os.path.relpath(
                file_path,
                temp_dir
            )

            docx.write(file_path, archive_path)

# =====================================================
# CLEANUP
# =====================================================

shutil.rmtree(temp_dir)

print("DONE")