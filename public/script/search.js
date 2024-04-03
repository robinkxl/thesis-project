(function() {
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchPage();
    });
})();
function searchPage() {
    let searched = document.getElementById('search');
    if (!searched) searched = document.getElementById('find');
    searched = searched.value.toLowerCase();

    const searchableElements = document.getElementsByTagName('body')[0].querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, li');

    clearHighlight();

    for (let i = 0; i < searchableElements.length; i++) {
        let text = searchableElements[i].textContent.toLowerCase();
        if (text.includes(searched)) {
            searchableElements[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
            searchableElements[i].classList.add('highlighted');
            break;
        }
    }
}

function clearHighlight() {
    const highlightedElements = document.querySelectorAll('.highlighted');
    highlightedElements.forEach(e => {
        e.classList.remove('highlighted');
    });
}