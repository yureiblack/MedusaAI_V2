import os
from fpdf import FPDF
import markdown

# Ensure exports directory exists (use /tmp for serverless compatibility)
EXPORTS_DIR = "/tmp/exports"
if not os.path.exists(EXPORTS_DIR):
    os.makedirs(EXPORTS_DIR)

def export_pdf(text, filename="report.pdf"):
    filepath = os.path.join(EXPORTS_DIR, filename)
    # fpdf2 supports HTML rendering which is perfect for Markdown conversion
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", size=12)

    # Convert Markdown to HTML
    html_content = markdown.markdown(text)
    
    # Render HTML to PDF
    # fpdf2's write_html handles basic tags like <h1>, <p>, <b>, <ul>, etc.
    pdf.write_html(html_content)

    pdf.output(filepath)
    return filepath


def export_markdown(text, filename="report.md"):
    filepath = os.path.join(EXPORTS_DIR, filename)
    with open(filepath, "w") as f:
        f.write(text)

    return filepath