from flask import Flask, request, send_file
import io
from PyPDF2 import PdfReader, PdfWriter

app = Flask(__name__)

@app.route('/encrypt_pdf', methods=['POST'])
def encrypt_pdf():
    # Get the PDF file and password from the POST request
    pdf_file = request.files.get('pdf')
    password = request.form.get('password')

    if not pdf_file or not password:
        return "PDF file and password are required", 400

    # Read the PDF file
    pdf_reader = PdfReader(pdf_file)
    pdf_writer = PdfWriter()

    for page_num in range(len(pdf_reader.pages)):
        pdf_writer.add_page(pdf_reader.pages[page_num])

    # Encrypt the PDF
    pdf_writer.encrypt(user_pwd=password, owner_pwd=None, use_128bit=True)

    # Create a BytesIO object to save the encrypted PDF
    encrypted_pdf = io.BytesIO()
    pdf_writer.write(encrypted_pdf)
    encrypted_pdf.seek(0)

    return send_file(
        encrypted_pdf,
        as_attachment=True,
        download_name='encrypted_pdf.pdf',
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    app.run(debug=True)
