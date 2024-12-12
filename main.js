// Fungsi menyimpan buku ke localStorage
function saveBookToLocalStorage(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

// Fungsi mengambil buku dari localStorage
function getBooksFromLocalStorage() {
    const booksJSON = localStorage.getItem('books');
    return booksJSON ? JSON.parse(booksJSON) : [];
}

// Fungsi menambahkan atau mengedit buku
function addOrUpdateBook(event) {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const bookId = document.getElementById('bookFormId').value;

    const book = {
        id: bookId ? parseInt(bookId) : new Date().getTime(),
        title,
        author,
        year,
        isComplete
    };

    let books = getBooksFromLocalStorage();

    if (bookId) {
        books = books.map(b => b.id === book.id ? book : b);
    } else {
        books.push(book);
    }

    saveBookToLocalStorage(books);
    renderBooks();

    document.getElementById('bookForm').reset();
    document.getElementById('bookFormId').value = '';
    document.getElementById("formTitle").innerText = "Tambah Buku Baru";
    document.getElementById("editModeMessage").style.display = 'none';

    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.innerHTML = 'Masukkan Buku ke rak <span>Belum Selesai dibaca</span>';
}

// Fungsi edit buku
function editBook(bookId) {
    const books = getBooksFromLocalStorage();
    const book = books.find(b => b.id === bookId);

    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').value = book.isComplete;
    document.getElementById('bookFormId').value = book.id;

    document.getElementById("formTitle").innerText = 'Edit Buku';
    document.getElementById('editModeMessage').style.display = 'block';

    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.innerHTML = 'Perbarui Buku';
    submitButton.querySelector('span').innerText = book.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';
}

// Fungsi check status selesai dibaca
function checkComplete(bookId) {
    const books = getBooksFromLocalStorage();
    const book = books.find(b => b.id === bookId);
    book.isComplete = !book.isComplete;
    saveBookToLocalStorage(books);
    renderBooks();
}

// Fungsi menghapus buku
function deleteBook(bookId) {
    let books = getBooksFromLocalStorage();
    const updatedBooks = books.filter(b => b.id !== bookId);
    saveBookToLocalStorage(updatedBooks);
    renderBooks();
}

// Fungsi mencari buku berdasarkan judul
function searchBooks(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    const books = getBooksFromLocalStorage();
    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm));
    renderFilteredBooks(filteredBooks);
}

// Fungsi merender buku yang telah difilter
function renderFilteredBooks(filteredBooks) {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
        const bookElement = createBookElement(book);

        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

// Fungsi merender semua buku
function renderBooks() {
    const books = getBooksFromLocalStorage();

    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.forEach(book => {
        const bookElement = createBookElement(book);

        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    });
}

// Fungsi membuat element HTML buku
function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    const title = document.createElement('h3');
    title.setAttribute('data-testid', 'bookItemTitle');
    title.innerText = book.title;

    const author = document.createElement('p');
    author.setAttribute('data-testid', 'bookItemAuthor');
    author.innerText = `Penulis: ${book.author}`;

    const year = document.createElement('p');
    year.setAttribute('data-testid', 'bookItemYear');
    year.innerText = `Tahun: ${book.year}`;

    const buttonContainer = document.createElement('div');
    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    completeButton.innerText = book.isComplete ? 'Belum Selesai dibaca' : 'Selesai dibaca';

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus Buku';

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit Buku';

    buttonContainer.appendChild(completeButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(editButton);

    bookElement.appendChild(title);
    bookElement.appendChild(author);
    bookElement.appendChild(year);
    bookElement.appendChild(buttonContainer);

    completeButton.addEventListener('click', () => {
        checkComplete(book.id);
    });
    deleteButton.addEventListener('click', () => {
        deleteBook(book.id);
    });
    editButton.addEventListener('click', () => {
        editBook(book.id);
    });

    return bookElement;
}

document.getElementById('bookForm').addEventListener('submit', addOrUpdateBook);
document.getElementById('searchBook').addEventListener('submit', searchBooks);
document.addEventListener('DOMContentLoaded', renderBooks);