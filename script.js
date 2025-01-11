document.addEventListener('DOMContentLoaded', () => {
    const currentPage = 1;

    //Customer Info
    const customer = {
        name : "",
        lastname : "",
        cin : "",
        email : "",
        phonenumber : "",
        cottage : "",
        typecottage : "",
        enterdate : "",
        exitdate : ""
    }

    //Page 1 
    const hd = document.getElementById('hd');
    const fb = document.getElementById('fb');
    const cbt1 = document.getElementById('cbt1');
    const cbt2 = document.getElementById('cbt2');
    const cbt3 = document.getElementById('cbt3');
    const para = document.getElementById('para');
    const btn = document.getElementById('topage2');

    function hideCurrentPage(hide) {
        if (currentPage === 1) {
            [hd, fb, cbt1, cbt2, cbt3, para, btn].forEach((el, idx) => {
                if (!el) console.error(`Element with id not found for index ${idx}`);
                else {
                    if (hide) el.classList.add('hidden');
                    else el.classList.remove('hidden');
                }
            });
        }
    }

    function nextPage() {
        if (currentPage === 1) {
            [hd, fb, cbt1, cbt2, cbt3, para, btn].forEach((el, idx) => {
                if (!el) console.error(`Element with id not found for index ${idx}`);
                else el.classList.add('moved');
            });
            currentPage++;
        }
    }

    document.getElementById('topage2').addEventListener('click', () => {
        nextPage();
    });

    hideCurrentPage(1);
});
