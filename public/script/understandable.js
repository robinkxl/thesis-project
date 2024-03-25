(function(){
    guideLine322();
    guideLine331();
})();

function guideLine322() {
    const formCorrect = document.getElementById('formCorrectGl322');
    const formWrong = document.getElementById('formWrongGl322');
    const selectWrong = formWrong.querySelector('select');
    
    formCorrect.addEventListener('submit', (e) => {
        e.preventDefault();
        changePageGl322(formCorrect.querySelector('select'));
    });

    selectWrong.addEventListener('change', function() {
        changePageGl322(this);
    });
}

function changePageGl322(e) {
    const form = e.closest('form');
    const chosenPage = form.querySelector('select').value;
    const url = 'http://localhost:1338/';
    if (chosenPage) {
        chosenPage === "home" ? window.location.href = url : window.location.href = `${url}${chosenPage}`;
    }
}

function guideLine331() {
    //on submit on the wrong one with a vague error at the bottom.
    document.getElementById('correctForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('unameCorrect').value;
        const pw = document.getElementById('passwordCorrect').value;
        let errContUname = document.getElementById('unameCorrectError');
        let errContPw = document.getElementById('passwordCorrectError');

        validateAndAddErrors(username, errContUname, usernameValidation);
        validateAndAddErrors(pw, errContPw, passwordValidation);

        const errorListName = errContUname.querySelector('li');
        const errorListPw = errContPw.querySelector('li');

        //If none of them contains a li element then the form has validated successfully.
        if (!errorListName && !errorListPw) {
            alert('The form validated and was sent!');
        }
    });

    document.getElementById('unameCorrect').addEventListener('blur', (e) => {
        let content = e.target.value;
        let errorContainer = document.getElementById('unameCorrectError');
        validateAndAddErrors(content, errorContainer, usernameValidation);
    });

    document.getElementById('passwordCorrect').addEventListener('blur', (e) => {
        let content = e.target.value;
        let errorContainer = document.getElementById('passwordCorrectError');
        validateAndAddErrors(content, errorContainer, passwordValidation);
    });

    document.getElementById('wrongForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('unameWrong').value;
        const pw = document.getElementById('passwordWrong').value;
        let usernameErrors = usernameValidation(username);
        let pwErrors = passwordValidation(pw);

        console.log(usernameErrors);
        console.log(pwErrors);

        if (usernameErrors.length === 0 && pwErrors.length === 0) {
            alert('The form validated and was sent!');
        } else {
            let errorBox = document.getElementById('wrongFormError');
            errorBox.textContent = "Something went wrong.";
        }
    })
}

function validateAndAddErrors(value, errorContainer, validationFunction) {
    let errors = validationFunction(value);

    while (errorContainer.firstChild) {
        errorContainer.removeChild(errorContainer.lastChild);
    }

    if (errors) {
        let errorList = document.createElement('ul');

        errors.forEach((e) => {
            let errorItem = document.createElement('li');
            errorItem.textContent = e;
            errorList.appendChild(errorItem);
        });

        errorContainer.appendChild(errorList);
    }
}

function usernameValidation(strToValidate) {
    let errors = [];
    const containsSpecial = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/; //Checks for some of the most common special characters.
    const containsLetter = /[A-Za-z]/; //Checks for everything that is in range [A-Za-z]. Letters like åäö are invalid.
    const containsNumber = /\d/; //Checks for digits [0-9].

    strToValidate = strToValidate.trim();

    if (containsSpecial.test(strToValidate)) errors.push("The username should not contain symbols or spaces.");
    if (containsNumber.test(strToValidate)) errors.push("The username should not contain digits.");

    let count = 0;
    for (let i = 0; i < strToValidate.length && count < 2; i++) {
        let l = strToValidate[i];
        if (containsLetter.test(l)) count++;
    }

    if (count < 2) errors.push("The username doesn't contain enough characters in the range A-Za-z.");

    return errors;
}

function passwordValidation(pwToValidate) {
    let errors = [];
    const containsUppercase = /[A-Z]/; //Check for uppercase letter.
    const containsNumber = /\d/; //Checks for digits [0-9].
    const containsSpecial = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/; //Checks for some of the most common special characters.

    if (pwToValidate.length < 8) errors.push("The password should be at least 8 characters long.");
    if (!containsUppercase.test(pwToValidate)) errors.push("The password needs to contain at least 1 uppercase letter.");
    if (!containsNumber.test(pwToValidate)) errors.push("The password needs to contain at least 1 digit.");
    if (!containsSpecial.test(pwToValidate)) errors.push("The password needs to contain at least 1 symbol.");

    return errors;
}