var elements = {
    question: document.getElementById("question"),
    answer_radios: Array.from(document.getElementsByClassName("form-check-input")),
    answer_labels: Array.from(document.getElementsByClassName("form-check-label")),
    counter: document.getElementById("counter")
}

class Question {
    static questions = [];
    static index = 0;
    static correct = 0;
    static incorrect = 0;

    static getCurrentQuestion() {
        return this.questions[this.index];
    }

    static next() {
        Question.getCurrentQuestion().checkAnswer() ?
            Question.correct++ : Question.incorrect++;

        Swal.fire({
            title: `回答${Question.getCurrentQuestion().checkAnswer() ? "正確" : "錯誤"}!`
        }).then(() => {
            if (Question.index == this.questions.length - 1) {
                Swal.fire({
                    title: Question.correct >= 3 ? "恭喜成功!" : "失敗",
                    text: `(答對${Question.correct} 答錯${Question.incorrect})`
                }).then(() => window.location.href = window.location.href.replace("/quiz", ""))
            } else {
                Question.index++;
                Question.getCurrentQuestion().updateForm();
            }
        });
    }

    question = "";
    options = [];
    answer = "";

    constructor(json) {
        this.answer = json.answer;
        this.options = json.options;
        this.question = json.question;
        Question.questions.push(this);
    }

    updateForm() {
        elements.question.innerText = this.question;
        elements.answer_labels.forEach((ele, index) => {
            ele.innerHTML = this.options[index];
        })
        elements.counter.innerText = `答對: ${Question.correct}; 答錯: ${Question.incorrect};`;
        elements.answer_radios.forEach(ele => ele.checked = false);
    }

    checkAnswer() {
        return this.answer == this.options[elements.answer_radios.findIndex(ele => ele.checked)];
    }
}

// 載入4個問題
fetch("../question.json")
    .then(response => response.json())
    .then(data => {
        data.sort(() => Math.random() - 0.5).slice(0, 4).forEach(question => {
            new Question(question);
        });
        Question.getCurrentQuestion().updateForm();
    });