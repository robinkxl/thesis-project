(function(){
    guideLine322();
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
    console.log(chosenPage);
    const url = 'http://localhost:1338/';
    if (chosenPage) {
        chosenPage === "home" ? window.location.href = url : window.location.href = `${url}${chosenPage}`;
    }
}