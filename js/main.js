

var bookItemTemplate = document.getElementById('books-card').content
var booksListEl = document.getElementById('book_list')
var searchInput = document.getElementById('search-input')
var formEl = document.getElementById('form-search')

async function getBooks(search) {
    response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=search+${search}&startIndex=${(currentPage-1)*10}`)
    response = await response.json()
    allBooks = response.totalItems
    return response
}

// let token = window.localStorage.getItem('token')

// if(!token){
//     window.location.replace('login.html')
// }

var counter = 1
getBooks().then(()=> {
    renderbooks(booksListEl)
})

searchInput.addEventListener('keyup', event => {
    event.preventDefault()
    if(!renderbooks(booksListEl)){
        var errList = document.getElementById('err')
        errList.textContent = "Nothing found"
    }

    renderbooks(booksListEl)
})

// render functions

var modalBox = document.getElementById('modalEl')
async function renderbooks(node, page) {
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

// Sort 
var sortByDateBtn = document.querySelector('.sort')
sortByDateBtn.addEventListener('click', (event)=>{
    event.preventDefault()
    async function getBooks2() {
        response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput.value}&startIndex=${currentPage}&orderBy=newest`)
        response = await response.json()
        return response
    }
    getBooks2().then(()=>{
        try {
            renderbooks(booksListEl)
        } catch (error) {
            // console.log(error.message);
        }
    })

})

// Pagination

var pageCount = document.querySelector('.pageCount')
var pagelinkPrev = document.querySelector('.pagePrev')
var pagelinkNext = document.querySelector('.pageNext')
var currentPage = 1
let response;
pagelinkPrev.textContent = '<'
var startIndex = 0

window.addEventListener('click', (event)=>{
    var pageEl = event.target
    if(pageEl.dataset.task=="paginationbtnPrev"){

        if(currentPage>1){
            currentPage-=1
            getBooks().then(()=> {
                renderbooks(booksListEl)
            })
            renderPage()
        }
    }
    if(pageEl.dataset.task=="paginationbtnNext"){
        if(currentPage<Math.ceil(response.totalItems/10)){
            currentPage+=1
            getBooks().then(()=> {
                renderbooks(booksListEl)
            })
            renderPage()
        }
        if(currentPage == 1){
            pagelinkPrev.classList.add('disabled')
        }else{
            pagelinkPrev.classList.remove('disabled')
        }
    
        if(currentPage == Math.ceil(allBooks/10)){
            pagelinkNext.classList.add('disabled')
        }else{
            pagelinkNext.classList.remove('disabled')
        }
    }


    
})

let pageDot = document.getElementById('pagedot')

let page1 = document.querySelector('.per_page1')
let page2 = document.querySelector('.per_page2')
let page3 = document.querySelector('.per_page3')
let page4 = document.querySelector('.per_page4')
function renderPage(){
    response.totalItems
    if(currentPage == Math.ceil(allBooks/10)-5){
        pageDot.remove()
    }
    if(Math.ceil(allBooks/10) > 4){
        page1.textContent = currentPage
        page1.dataset.page = currentPage

        page2.textContent = Number(currentPage)+1
        page2.dataset.page = Number(currentPage)+1

        page3.textContent = Math.ceil(allBooks/10)-1
        page3.dataset.page = Math.ceil(allBooks/10)-1
        
        page4.textContent = Math.ceil(allBooks/10)
        page4.dataset.page = Math.ceil(allBooks/10)
    }
}
