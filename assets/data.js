const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);
    if (data !== null) {
        books = data;
    }

    document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
    if (isStorageExist()) {
        saveData();
    }
}

function composeBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
        if (book.id === bookId) {
            return index;
        }
        index++;
    }
    return -1;
}

function refreshDataFromBooks() {
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for (book of books) {
        const listBook = inputBook(book.title, book.author, book.year, book.isComplete);
        listBook[BOOK_ITEMID] = book.id;

        if (book.isComplete) {
            listCompleted.append(listBook);
        } else {
            listIncompleted.append(listBook);
        }
    }
}

function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}