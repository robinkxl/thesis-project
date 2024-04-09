(function(){
    let hash = window.location.hash;

    if (hash) {
        const id = hash.slice(1, hash.length);
        const item = document.getElementById(id);
        if (item) item.classList.add('highlighted');
    }
})();