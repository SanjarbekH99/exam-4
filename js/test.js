

var bookItemTemplate = document.getElementById('books-card').content
var booksListEl = document.getElementById('book_list')
var searchInput = document.getElementById('search-input')
var formEl = document.getElementById('form-search')

const API = 'https://www.googleapis.com/books/v1/volumes?q=search+'
async function getBooks(search = "phyton", pageNumber = 1) {
    let response = await fetch(`${API}${search}?startIndex=${pageNumber}`)
    response =await response.json()
    return response
}

searchInput.addEventListener('keyup', event => {
    event.preventDefault()
    if(!renderbooks(booksListEl)){
        var errList = document.getElementById('err')
        errList.textContent = "Nothing found"
    }

    renderbooks(booksListEl)
})

let currentPage = 1
// render functions

var modalBox = document.getElementById('modalEl')
// var paginationEl = document.querySelector('.pagination')
// paginationNextEl = document.querySelector('#next-btn')
// paginationPrevEl = document.querySelector('#prev-btn')



async function renderbooks(node, page = 1) {
    let response = await getBooks(searchInput.value, page)
    console.log(response);

    const books = response.items
    let maxlength = response.totalItems
    var resultBook = document.getElementById('resultbook')
    resultBook.textContent = maxlength
    node.innerHTML = null
    let bookListFragment = document.createDocumentFragment()
    books.forEach(element => {
        let bookItemEl = document.importNode(bookItemTemplate, true)
        let cardImg = bookItemEl.querySelector('.book__blockImg__img')
        let imgSrc = element.volumeInfo.imageLinks.smallThumbnail
        cardImg.setAttribute('src', imgSrc)

        let cardTitleEl = bookItemEl.querySelector('.book__title')
        cardTitleEl.textContent = element.volumeInfo.title
        let authorEl = bookItemEl.querySelector('.book__author')
        authorEl.textContent = element.volumeInfo.authors
        let yearEl = bookItemEl.querySelector('.book__year')
        yearEl.textContent = element.volumeInfo.publishedDate

        let filmBookMarkBtn = bookItemEl.querySelector('.bookmark-btn')
        filmBookMarkBtn.dataset.bookId = element.id
        let filmMoreBtn = bookItemEl.querySelector('.more-btn')
        filmMoreBtn.dataset.bookId = element.id
        
        booksListEl.addEventListener('click', event => {
            let clickedEl = event.target
            if(clickedEl.matches('.bookmark-btn')){
                const bookId = clickedEl.dataset.bookId
                addBookmark(bookId)
                renderPlayList()

            }
            else if(clickedEl.matches('.more-btn')){
                const bookId = clickedEl.dataset.bookId
                modalBox.innerHTML = null
                let modalEl = getModal()
                let founded = books.find(book => book.id == bookId)
                let modalTitle = modalEl.querySelector('#title')
                modalTitle.textContent = founded.volumeInfo.title
                let modalImg = modalEl.querySelector('.img-book')
                modalImg.setAttribute('src', founded.volumeInfo.imageLinks.smallThumbnail)
                let modalDescription = modalEl.querySelector('description')
                // modalDescription.textContent = founded.volumeInfo.description
                let modalAuthor = modalEl.querySelector('#author')
                modalAuthor.textContent = founded.volumeInfo.authors
                let modalPublished = modalEl.querySelector('#published')
                modalPublished.textContent = founded.volumeInfo.publishedDate
                let modalPublishers = modalEl.querySelector('#publishers')
                modalPublishers.textContent = founded.volumeInfo.publisher
                let modalCotegories = modalEl.querySelector('#categories')
                modalCotegories.textContent = founded.volumeInfo.categories
                let modalCount = modalEl.querySelector('#pageCount')
                modalCount.textContent = founded.volumeInfo.pageCount
                let closeModal = modalEl.querySelector('.modal-btn')
                closeModal.addEventListener('click', () => {
                    modalBox.innerHTML = null
                })
        
                modalBox.appendChild(modalEl)
            }
        })

        bookListFragment.appendChild(bookItemEl)
    })

    node.appendChild(bookListFragment)
}
renderbooks(booksListEl)

function getModal() {
    let modalInstance = document.getElementById('modal-container').content
    let modalEl = document.importNode(modalInstance, true)

    return modalEl
}

modalBox.addEventListener('click', event => {
    if(!event.target.classList.contains('.content') && event.target.matches('.overlay')){
        modalBox.innerHTML = null
    }
})

var bookmarkList = document.querySelector('.list')
var bookmarkTemplate = document.querySelector('#bookmark-item-template').content