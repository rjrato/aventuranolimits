from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
from flask_bootstrap import Bootstrap5
from email.mime.text import MIMEText
import os
import re
import requests
import smtplib
import ssl

load_dotenv()

application = Flask(__name__)
application.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
Bootstrap5(application)

EMAIL = os.getenv("EMAIL")
PASS = os.getenv("PASS")
TO_ADDRESS = os.getenv("TO_ADDRESS")
recaptcha_site_key = os.getenv("RECAPTCHA_SITE_KEY")
recaptcha_secret_key = os.getenv("RECAPTCHA_SECRET_KEY")


def form_contact():
    if request.method == "POST":
        name = request.form.get("fullname")
        email = request.form.get("email")
        phone = request.form.get("phone")
        message = request.form.get("message")

        if not name or not email or not message:
            return jsonify({"status": "error", "message": "Os campos 'Nome', 'email' e 'mensagem' são obrigatórios."}), 400

        email_validation = re.compile(r"[^@]+@[^@]+\.[^@]+")
        if not email_validation.match(email):
            return jsonify({"status": "error", "message": "Endereço de email incorreto, tente novamente."}), 400

        if len(message) < 1:
            return jsonify({"status": "error", "message": "Por favor preencha o campo 'mensagem'."}), 400

        try:
            msg = MIMEText(f"Mensagem enviada por:\n{name}\n\nEmail:\n{email}\n\nContacto telefónico:\n{phone}\n\nMensagem:\n{message}")
            msg["Subject"] = "Aventuras No Limits - Novo Contacto"
            msg["From"] = EMAIL
            msg["To"] = TO_ADDRESS

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as connection:
                connection.login(user=EMAIL, password=PASS)
                connection.sendmail(
                    from_addr=EMAIL,
                    to_addrs=TO_ADDRESS,
                    msg=msg.as_string()
                )
            return jsonify({"status": "success",
                            "message": "Mensagem recebida!\nResponderemos brevemente."}), 200
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500


@application.route('/favicon.ico')
def favicon():
    return '', 204


@application.route("/")
def index():
    return render_template("welcome-page.html")


@application.route("/progresso")
def progress():
    year = datetime.now().year
    print(f"Recaptcha Site Key: {recaptcha_site_key}")  # Debug line
    return render_template("index.html", year=year, key=recaptcha_site_key)


@application.route("/contact", methods=["POST"])
def contact():
    recaptcha_response = request.form.get("recaptcha_token")
    verify_url = "https://www.google.com/recaptcha/api/siteverify"

    data = {
        "secret": recaptcha_secret_key,
        "response": recaptcha_response
    }

    response = requests.post(verify_url, data=data)
    result = response.json()

    if result.get("success"):
        return form_contact()
    else:
        error_codes = result.get("error-codes", [])
        return f"reCAPTCHA verification failed: {error_codes}", 400


if __name__ == "__main__":
    application.run(debug=True)
