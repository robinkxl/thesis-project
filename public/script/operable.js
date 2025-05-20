(function(){
    guideLine211();
    guideLine222();
    guideLine253();
})();

function guideLine211() {
    //Guideline 2-1-1 Example 1
    let link = document.getElementById('gl-2-1-1-link');
    link.addEventListener('focus', () => {
        link.onfocus = document.getElementById('hidden-example').classList.remove('hidden');
        link.blur();

        setTimeout(() => {
            document.getElementById('hidden-example').classList.add('hidden');
        }, 10000);
    });

    //Guideline 2-1-1 Example 2
    let linkFrom = document.getElementById('gl-2-1-1-link-from');
    let linkTo = document.getElementById('gl-2-1-1-link-to');
    linkFrom.addEventListener('focus', () => {
        let countdown = document.getElementById('gl-2-1-1-countdown');
        let counter = 1;

        document.addEventListener('keydown', disableTab);

        let interval = setInterval(() => {
            countdown.textContent = `Countdown: ${3 - counter}`;
            counter++;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            linkTo.focus();
            document.removeEventListener('keydown', disableTab);
            countdown.textContent = `Countdown: 3`;
            counter = 0;
        }, 4000);
    });

    //Guideline 2-1-1 Example 3
    let fakeLink = document.getElementById('fake-link');
    fakeLink.addEventListener('click', () => {
        window.location.href='operable#fake-link';
    });

    // Guideline 2-1-1 Example 4
    let imgLink = document.getElementById('gl-2-1-1-img-link');
    let img = document.getElementById('gl-2-1-1-img');
    if (imgLink && img) {
        imgLink.addEventListener('mouseover', () => swapImageOn('gl-2-1-1-img'));
        imgLink.addEventListener('mouseout', () => swapImageOff('gl-2-1-1-img'));
        imgLink.addEventListener('focus', () => swapImageOn('gl-2-1-1-img'));
        imgLink.addEventListener('blur', () => swapImageOff('gl-2-1-1-img'));
    }

    let wrongImg = document.getElementById('mouse-only-link');
    if (wrongImg) {
        wrongImg.addEventListener('mousedown', () => {
            window.location.href = '#';
        });
    }

    function swapImageOn(id) {
        let img = document.getElementById(id);
        if (img) img.src = 'images/Operable_blue.png';
    }

    function swapImageOff(id) {
        let img = document.getElementById(id);
        if (img) img.src = 'images/Operable.png';
    }
}

function guideLine222() {
    let startBtn = document.getElementById('gl-2-2-2-start');
    let pauseButton = document.getElementById('gl-2-2-2-pause');
    let saleSign = document.getElementById('gl-2-2-2-sign-c');
    let isPaused = false;

    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isPaused ? saleSign.style.animationPlayState = 'running' : null;
        isPaused = false;
    })

    pauseButton.addEventListener('click', (e) => {
        e.preventDefault();
        isPaused = true;
        isPaused ? saleSign.style.animationPlayState = 'paused' : null;
    })
}

function guideLine253() {
    document.querySelectorAll('.example-box .correct, .example-box .wrong').forEach(section => {
        const button = section.querySelector('input[type="submit"], button, input[type="button"]');
        const text = section.querySelector('.toggle-hidden');

        if (button && text) {
            button.addEventListener('click', () => {
                text.classList.toggle('hidden');
            });
        }
    });
}

function disableTab(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
    }
}

