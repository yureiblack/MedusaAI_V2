import os
from fpdf import FPDF

# Ensure exports directory exists (use /tmp for serverless compatibility)
EXPORTS_DIR = "/tmp/exports"
if not os.path.exists(EXPORTS_DIR):
    os.makedirs(EXPORTS_DIR)

def export_pdf(text, filename="report.pdf"):
    filepath = os.path.join(EXPORTS_DIR, filename)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    for line in text.split("\n"):
        pdf.multi_cell(0, 8, line)

    pdf.output(filepath)
    return filepath


def export_markdown(text, filename="report.md"):
    filepath = os.path.join(EXPORTS_DIR, filename)
    with open(filepath, "w") as f:
        f.write(text)

    return filepath