from flask import Flask,render_template, request, jsonify
import os, pickle

basedir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(basedir, 'model')
pkl_file = os.path.join(model_path, 'models.pkl')
load_model = pickle.load(open(pkl_file, 'rb'))
model = load_model['model']
vector = load_model['vectorizer']

app = Flask(__name__)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/process', methods=['GET', 'POST'])
def bullying():
	if request.method == 'POST':
		tweets = request.form['tweets']
		if tweets:
			vectored = vector.transform([tweets])
			prediction = model.predict(vectored)[0]
			data = {'bullying_text': str(prediction)}
			response = jsonify(data)
			response.status_code = 200
		return response


if __name__ == '__main__':
	app.run(debug=True)