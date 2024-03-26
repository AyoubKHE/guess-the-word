
let words = [
    ["city", "bell", "sing", "come", "bear",
    "play", "bird", "bean", "game", "rice"],

    ["brand", "catch", "crime", "bread", "cause",
    "cross", "break", "chain", "crowd", "breed"],

    ["bottle", "button", "editor", "bottom", "camera",
    "effect", "bought", "cancer", "effort", "branch"],

    ["nabbers", "nabbing", "nacelle", "nadiral", "naffing",
    "naganas", "naggers", "naggier", "nagging", "naggish"],

    ["applause", "positive", "creative", "sunshine", "grateful",
    "pleasure", "serenity", "devotion", "inspired", "colorful"]
]

let randomListIndex = Math.floor(Math.random() * words.length);
let randomWordIndex = Math.floor(Math.random() * words[randomListIndex].length);

let word = words[randomListIndex][randomWordIndex].toUpperCase();

let numberOfHints = Math.ceil(word.length / 3);

function generateGameArea() {

    function generateTries() {

        function generateTry(tryNumber) {
            let divTry = document.createElement("div");

            divTry.setAttribute("class", "tries");
            divTry.setAttribute("id", `try${tryNumber}`);

            divTry.innerHTML =
                `
                    <span class="try-title">Try ${tryNumber}</span>
                `
            for (let i = 0; i < word.length; i++) {
                divTry.innerHTML +=
                    `
                    <input type="text" class ="char" ${tryNumber === 1 ? "" : "disabled"}></input>
                `
            }

            return divTry;

        }

        for (let i = 0; i < word.length; i++) {
            divGameArea.appendChild(generateTry(i + 1));
        }

    }

    let divGameArea = document.createElement("div");
    generateTries();

    divGameArea.innerHTML +=
        `
        <div class="buttons">
            <button class="btn-check-word" id="btn-check-word">Check Word</button>
            <button class="btn-hint" id="btn-hint">${numberOfHints} Hints</button>
        </div>

        <div class="remark" id="remark">
            <h4 style="color: blue;">You win the answer is</h4>
            <span class="answer" id="answer"></span>
        </div>
    `

    // <button class="btn-check-word btn-check-word-${word.length <= 6 ? "small" : "big"}-format" id="btn-check-word">Check Word</button>
    // <button class="btn-hint btn-hint-${word.length <= 6 ? "small" : "big"}-format" id="btn-hint">${numberOfHints} Hints</button>

    document.getElementById("game-area").appendChild(divGameArea);

}

function addEventsToChars() {

    function inputEvent(inputNumber) {

        allChars[inputNumber].addEventListener("input", function () {

            function isCorrectChar() {
                let regex = /^[a-zA-Z]$/;
                return regex.test(allChars[inputNumber].value);
            }

            if (this.value.length >= 1) {

                this.value = this.value[this.value.length - 1];
                this.value = this.value.toUpperCase();

                if(!isCorrectChar()) {
                    this.value = "";
                    return;
                }

                if (inputNumber < allChars.length - 1) {
                    allChars[inputNumber + 1].focus();
                }
            }
        })
    }

    function keyEvent(inputNumber) {

        allChars[inputNumber].addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                if (inputNumber > 0) {
                    allChars[inputNumber - 1].focus();
                    event.preventDefault();
                }
            }

            if (event.key === "ArrowRight") {
                if (inputNumber < allChars.length - 1) {
                    allChars[inputNumber + 1].focus();
                }
            }

            if (event.key === "Backspace") {
                if (inputNumber > 0) {
                    allChars[inputNumber].value = "";
                    allChars[inputNumber - 1].focus();
                    event.preventDefault();
                }
            }
        })
    }

    let allChars = document.querySelectorAll(".tries .char");
    allChars[0].focus();

    for (let i = 0; i < allChars.length; i++) {

        inputEvent(i);

        keyEvent(i);
    }
}

function addEventsToButtons() {

    let btnHint = document.getElementById("btn-hint");
    let isGameEnd = false;

    let currentTry = 1;

    btnCheckWord.addEventListener("click", function () {

        if (!isGameEnd) {

            function editScreen(tryNumber) {

                let currentChars = document.querySelectorAll(`#try${tryNumber} input`);
                let goodAnswers = [];
                for (let i = 0; i < currentChars.length; i++) {
                    currentChars[i].setAttribute("disabled", "true");

                    if (currentChars[i].style.backgroundColor === "rgb(255, 158, 16)") {
                        goodAnswers.push(i);
                    }
                }

                let nextChars = document.querySelectorAll(`#try${tryNumber + 1} input`);
                for (let i = 0; i < currentChars.length; i++) {
                    if (goodAnswers.indexOf(i) !== -1) {
                        nextChars[i].value = word[i];
                        nextChars[i].style.backgroundColor = "#FF9E10";
                        nextChars[i].setAttribute("disabled", "true");
                    }
                    else {
                        nextChars[i].removeAttribute("disabled");
                    }

                }
                nextChars[0].focus();
            }

            function isCorrectWord() {
                let counter = 0;
                for (let i = 0; i < chars.length; i++) {
                    if (chars[i].value === word[i]) {
                        chars[i].style.backgroundColor = "#FF9E10";
                        counter++;
                    }
                    else if (word.indexOf(chars[i].value) !== -1 && chars[i].value !== "") {
                        chars[i].style.backgroundColor = "#09A78A";
                    }
                    else {
                        chars[i].style.backgroundColor = "#8C8F9A";
                    }
                }

                return counter === word.length;
            }


            let chars = document.querySelectorAll(`#try${currentTry} input`);
            if (isCorrectWord()) {
                document.getElementById("remark").style.display = "block";
                document.getElementById("answer").textContent = word[0] + word.substring(1).toLowerCase();
                for (let i = 0; i < chars.length; i++) {
                    chars[i].setAttribute("disabled", "true");
                }
                isGameEnd = true;
            }
            else if (currentTry < word.length) {
                editScreen(currentTry);
                currentTry++;
            }
            else {
                document.getElementById("remark").innerHTML = `
                    <h4 style="red: blue;">You lose the answer is</h4>
                    <span class="answer" id="answer"></span>
                `;
                document.getElementById("remark").style.display = "block";
                document.getElementById("answer").textContent = word[0] + word.substring(1).toLowerCase();
                isGameEnd = true;
            }
        }

    })

    btnHint.addEventListener("click", function () {

        if (!isGameEnd) {

            if (numberOfHints > 0) {

                function getRandomIndex() {
                    do {
                        randomIndex = (Math.floor(Math.random() * word.length));
                    } while (currentChars[randomIndex].value !== "")
                }


                let currentChars = document.querySelectorAll(`#try${currentTry} input`);
                let randomIndex;
                getRandomIndex();
                currentChars[randomIndex].value = word[randomIndex];
                numberOfHints--;
                btnHint.textContent = `${numberOfHints} hint${numberOfHints > 1 ? "s" : ""}`;
            }
        }

    })
}

function addEventsToDocument() {
    document.addEventListener("keydown", function (event) {
        if(event.key === "Enter") {
            btnCheckWord.click();
        }
    })
}

generateGameArea();

addEventsToChars();

let btnCheckWord = document.getElementById("btn-check-word");

addEventsToButtons();

addEventsToDocument();




