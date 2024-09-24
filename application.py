from flask import Flask, render_template, redirect, url_for, session
from flask_bootstrap import Bootstrap5
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

application = Flask(__name__)
application.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
Bootstrap5(application)


@application.route('/favicon.ico')
def favicon():
    return '', 204


@application.route("/")
def index():
    return render_template("welcome-page.html")


@application.route("/progresso")
def progress():
    year = datetime.now().year
    return render_template("index.html", year=year)


if __name__ == "__main__":
    application.run(debug=True)
