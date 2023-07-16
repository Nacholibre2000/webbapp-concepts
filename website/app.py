from flask import Flask, render_template

app = Flask(__name__)

CONCEPTS = [
  {
    'id': 1,
    'concept': 'Utbud',
    'explanation':
    'Är den samlade mängd varor och tjänster som säljare bjuder ut till försäljning vid ett visst pris',
    'course_requirement': 1,
  },
  {
    'id': 2,
    'concept': 'Efterfrågan',
    'explanation':
    'Är den samlade mängd varor och tjänster som köpare vill köpa vid ett visst pris',
    'course_requirement': 4,
  },
]


@app.route("/")
def hello_world():
  return render_template('home.html', concepts=CONCEPTS)


if __name__ == "__main__":
  app.run(host='0.0.0.0', debug=True)
