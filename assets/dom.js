const INCOMPLETED_LIST_BOOK_ID = 'incompleteBookshelfList';
const COMPLETED_LIST_BOOK_ID = 'completeBookshelfList';
const BOOK_ITEMID = 'itemId';

function addBook() {
    const incompleteBookList = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    const completeBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const book = inputBook(title, author, year, isComplete);
    const bookObject = composeBookObject(title, author, year, isComplete);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        completeBookList.append(book);
    } else {
        incompleteBookList.append(book);
    }

    updateDataToStorage();
    eraseText();
}

function inputBook(title, author, year, isComplete) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis : ' + author;
    
    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun : ' + year;

    const container = document.createElement('article');
    container.classList.add('book_item', 'shadow');
    container.append(textTitle, textAuthor, textYear);

    const buttonContainer = createButtonContainer();
    if (isComplete) {
        buttonContainer.append(createUndoButton(), createTrashButton());
        container.append(buttonContainer);
    } else {
        buttonContainer.append(createCheckButton(), createTrashButton(), createEditButton());
        container.append(buttonContainer);
    }

    return container;
}

function eraseText() {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement('button');
    if (buttonTypeClass == 'check') {
        button.classList.add('fas', 'fa-check-square');
    } else if (buttonTypeClass == 'trash') {
        button.classList.add('fas', 'fa-trash');
    } else if (buttonTypeClass == 'undo') {
        button.classList.add('fas', 'fa-undo-alt');
    } else {
        button.classList.add('fas', 'fa-edit');
    }

    button.classList.add(buttonTypeClass);
    button.addEventListener('click', function (event) {
        eventListener(event);
    });
    return button;
}

function createButtonContainer() {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');
    return buttonContainer;
}

function addBookToCompleted(bookElement) {
    const bookTitle = bookElement.querySelector('.book_item > h3').innerText;
    const arrayAuthorYear = bookElement.querySelectorAll('.book_item > p');
    const bookAuthor = arrayAuthorYear[0].innerText.substring(10, arrayAuthorYear[0].innerText.length);
    const bookYear = arrayAuthorYear[1].innerText.substring(8, arrayAuthorYear[1].innerText.length);

    const isComplete = true;
    const bookCompleted = inputBook(bookTitle, bookAuthor, bookYear, isComplete);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    bookCompleted[BOOK_ITEMID] = book.id;
    listCompleted.append(bookCompleted);

    bookElement.remove();
    updateDataToStorage();
}

function scrollIntoView() {
    var e = document.getElementById('content');
    if (!!e && e.scrollIntoView) {
        e.scrollIntoView();
    }
}

function undoBookFromCompleted(bookElement) {
    const bookTitle = bookElement.querySelector('.book_item > h3').innerText;
    const arrayAuthorYear = bookElement.querySelectorAll('.book_item > p');
    const bookAuthor = arrayAuthorYear[0].innerText.substring(10, arrayAuthorYear[0].innerText.length);
    const bookYear = arrayAuthorYear[1].innerText.substring(8, arrayAuthorYear[1].innerText.length);

    const isComplete = false;
    const bookInCompleted = inputBook(bookTitle, bookAuthor, bookYear, isComplete);
    const listInCompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    bookInCompleted[BOOK_ITEMID] = book.id;

    listInCompleted.append(bookInCompleted);

    bookElement.remove();
    updateDataToStorage();
}

function removeBook(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
}

function editBook(bookElement) {
    const bookTitle = bookElement.querySelector('.book_item > h3').innerText;
    const arrayAuthorYear = bookElement.querySelectorAll('.book_item > p');
    const bookAuthor = arrayAuthorYear[0].innerText.substring(10, arrayAuthorYear[0].innerText.length);
    const bookYear = arrayAuthorYear[1].innerText.substring(8, arrayAuthorYear[1].innerText.length);

    document.getElementById('inputBookTitle').value = bookTitle;
    document.getElementById('inputBookAuthor').value = bookAuthor;
    document.getElementById('inputBookYear').value = bookYear;

    const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookElement.remove();
    updateDataToStorage();
    scrollIntoView();
}

function createCheckButton() {
    return createButton('check', function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton('trash', function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createUndoButton() {
    return createButton('undo', function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createEditButton() {
    return createButton('edit', function (event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function bookSearch(keyword) {
    const filter = keyword.toUpperCase();
    let books = [];

    for (i = 0; i < getData().length; i++) {
        if (filter === getData()[i].title.toUpperCase()) {
            books.push(getData()[i]);
        }
    }

    showSearchResult(books);
}

function showSearchResult(books) {
    const searchResult = document.querySelector('#searchResult');
    const searchInput = document.getElementById('searchBookTitle').value;
    const parentsearchResult = searchResult.parentElement;
    const buttonSearch = document.getElementById('buttonResultSearch');

    parentsearchResult.removeAttribute('hidden');

    if (getData().length == 0) {
        searchResult.innerText = 'Data buku masih kosong.';
    } else {
        if (searchInput == '') {
            searchResult.innerText = 'Mohon untuk memasukkan judul buku.';
        } else {
            if (books.length == 0) {
                searchResult.innerText = 'Data buku tidak ditemukan.';
            } else {
                searchResult.innerHTML = '';

                books.forEach((book) => {
                    let el = `
                <article class="book_item">
                    <h3>${book.title}</h3>
                    <p>Penulis : ${book.author}</p>
                    <p>Tahun : ${book.year}</p>
                    <p class="ket">Keterangan : <span>${book.isComplete ? 'Sudah dibaca' : 'Belum selesai dibaca'}</span></p>
                </article>
                `;

                    searchResult.innerHTML += el;
                });
            }
        }
    }

    buttonSearch.addEventListener('click', function (event) {
        const a = event.target.parentElement.parentElement.parentElement;
        a.setAttribute('hidden', true);
        document.getElementById('searchBookTitle').value = '';
    });
}