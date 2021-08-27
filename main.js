const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIE_PER_PAGE = 8 // 一頁顯示 8 張電影卡片

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const switchModeButton = document.querySelector('#switch-mode-button')
const favoriteTab = document.querySelector('#nav-favorite-tab')

// 2. 新增 viewingMode 變數，讓系統知道目前該用哪種 Mode 呈現電影內容
let viewingMode = 'card-mode'
// 7. 新增 viewingPage 變數，讓系統知道目前正在瀏覽第幾頁
// 同步需檢查 & 修改 getMoviesByPage() 的引數
let viewingPage = 1
let previousViewingPage = 1
// 14. 將 favoriteList 設為 global 變數，讓系統知道哪些電影已在 favorite 清單
// 同步需修改 renderByCard/renderByList
let favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
// 17. 新增 getSearchResult，避免在 keyword 搜尋不到電影、又恰巧換頁的情況
let getSearchResult = true

// 3. 將 renderMovieList 猜分成兩種模式 ByCard 或 ByList，並新增 viewingMode 參數
// 同步需檢查 & 修改之前有使用到 renderMovieList() 的引數
function renderMovieList(data, viewingMode) {
  if (getSearchResult) {
    switch (viewingMode) {
      case 'list-mode':
        renderByList(data)
        break
      case 'card-mode':
        renderByCard(data)
        break
    }
  }

  favoriteTab.innerHTML = `Favorite (${favoriteList.length})`
}

// 4. 原先的 renderMovieList 函式，修改為 renderByCard 函式
function renderByCard(data) {
  let rawHTML = " "

  data.forEach((item) => {
    if (favoriteList.some(movie => movie.id === item.id)) {
      rawHTML +=
        `
      <div class="col-sm-3">
        <div class="mb-3">
          <div class="card">
            <img class="card-img-top" src="${POSTER_URL + item.image}" alt="Movie Poster">
            <div class="card-body d-flex align-items-center" style="height: 5rem;">
              <h5 class="card-title m-0 py-3">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite ml-2" data-id="${item.id}"><i class="fas fa-thumbs-up"></i></button>
            </div>
          </div>
        </div>
      </div>
      `
    } else {
      rawHTML +=
        `
      <div class="col-sm-3">
        <div class="mb-3">
          <div class="card">
            <img class="card-img-top" src="${POSTER_URL + item.image}" alt="Movie Poster">
            <div class="card-body d-flex align-items-center" style="height: 5rem;">
              <h5 class="card-title m-0 py-3">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-outline-info btn-add-favorite ml-2" data-id="${item.id}"><i class="far fa-thumbs-up"></i></button>
            </div>
          </div>
        </div>
      </div>
    `
    }
  })

  dataPanel.innerHTML = rawHTML
}

// 5. 新增 renderByList 函式
function renderByList(data) {
  let rawHTML = " "

  data.forEach((item) => {
    // 8. 新增 genre 顯示進 list mode
    const genreNumber = item.genres
    const genreName = showGenreName(genreNumber)
    const genreHTML = genreItem(genreName)

    if (favoriteList.some(movie => movie.id === item.id)) {
      rawHTML +=
        `
     <div class="col-12 d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid #ececec;">
       <h5 class="card-title m-0 list-title" style="text-align: center;">${item.title}</h5>
       <div class="list-mode-btn">
         ${genreHTML}
         <button class="btn btn-primary btn-show-movie ml-3 btn-sm" data-toggle="modal"
                 data-target="#movie-modal" data-id="${item.id}"> More</button>
         <button class="btn btn-info btn-add-favorite ml-2 btn-sm" data-id="${item.id}"><i class="fas fa-thumbs-up"></i></button>
       </div>
     </div>
    `
    } else {
      rawHTML +=
        `
     <div class="col-12 d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid #ececec;">
       <h5 class="card-title m-0 list-title" style="text-align: center;">${item.title}</h5>
       <div class="list-mode-btn">
         ${genreHTML}
         <button class="btn btn-primary btn-show-movie ml-3 btn-sm" data-toggle="modal"
                 data-target="#movie-modal" data-id="${item.id}"> More</button>
         <button class="btn btn-outline-info btn-add-favorite ml-2 btn-sm" data-id="${item.id}"><i class="far fa-thumbs-up"></i></button>
       </div>
     </div>
    `
    }
  })

  dataPanel.innerHTML = rawHTML
}

// 9. 將 genreNumber 轉換成 genreName
function showGenreName(data) {
  const genreName = []
  data.forEach(item => {
    if (item === 1) {
      genreName.push('Action')
    } else if (item === 2) {
      genreName.push('Adventure')
    } else if (item === 3) {
      genreName.push('Animation')
    } else if (item === 4) {
      genreName.push('Comedy')
    } else if (item === 5) {
      genreName.push('Crime')
    } else if (item === 6) {
      genreName.push('Documentary')
    } else if (item === 7) {
      genreName.push('Drama')
    } else if (item === 8) {
      genreName.push('Family')
    } else if (item === 9) {
      genreName.push('Fantasy')
    } else if (item === 10) {
      genreName.push('History')
    } else if (item === 11) {
      genreName.push('Horror')
    } else if (item === 12) {
      genreName.push('Music')
    } else if (item === 13) {
      genreName.push('Mystery')
    } else if (item === 14) {
      genreName.push('Romance')
    } else if (item === 15) {
      genreName.push('Science Fiction')
    } else if (item === 16) {
      genreName.push('TV Movie')
    } else if (item === 17) {
      genreName.push('Thriller')
    } else if (item === 18) {
      genreName.push('War')
    } else if (item === 19) {
      genreName.push('Western')
    }
  })
  return genreName
}

// 10. 將 genreName 轉換為想顯示的 HTML 內容
function genreItem(data) {
  let genreHTML = ''
  data.forEach((item) => {
    genreHTML +=
      `<span class="rounded mx-1 px-2 py-1" style="font-size: 10px; color: #1b1b1b; background-color: #fab900;">${item}</span>`
  })
  return genreHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''
  // 13. 同步修改 renderPaginator 時的初始樣式
  for (let page = 1; page <= numberOfPages; page++) {
    if (page === Number(viewingPage)) {
      rawHTML += `<li class="page-item"><a class="page-link text-white bg-secondary" href="#" data-page="${page}">${page}</a></li>`
    } else {
      rawHTML += `<li class="page-item"><a class="page-link text-secondary" href="#" data-page="${page}">${page}</a></li>`
    }
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
    .then(response => {
      // response.data.results
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release Date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src=${POSTER_URL + data.image} alt="movie-poster" class="img-fluid">`
    })
}

function addToFavorite(id) {
  const thisMovie = movies.find((movie) => movie.id === id)
  if (favoriteList.some(movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  favoriteList.push(thisMovie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
  renderMovieList(getMoviesByPage(viewingPage), viewingMode)
}

// 15. 新增 removeFromFavorite 函式
function removeFromFavorite(id) {
  const thisMovie = favoriteList.findIndex(movie => movie.id === id)
  favoriteList.splice(thisMovie, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
}

// 16. 將 checkFavStatus 函式獨立出來
function checkFavStatus(id, target) {
  const thisMovie = movies.find((movie) => movie.id === id)
  if (favoriteList.some(movie => movie.id === id)) {
    if (confirm(`${thisMovie.title} 已收藏 (　ﾟ∀ﾟ) ﾉ♡ ` + '\n如果想取消收藏，請按下 "確認"')) {
      removeFromFavorite(id)
      alert(`已將 ${thisMovie.title} 從收藏清單移除 (╥﹏╥)`);
    } else {
      alert('結束這回合 (´･_･`)\n' + `${thisMovie.title} 還在您的收藏清單中唷！`)
    }
  } else {
    addToFavorite(id)
  }
  renderMovieList(getMoviesByPage(viewingPage), viewingMode)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    const id = Number(event.target.dataset.id)
    const targetElement = event.target
    checkFavStatus(id, targetElement)
  } else if (event.target.matches('.fa-thumbs-up')) {
    const id = Number(event.target.parentElement.dataset.id)
    const targetElement = event.target.parentElement
    checkFavStatus(id, targetElement)
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  viewingPage = Number(event.target.dataset.page)
  changePaginatorStyle(event.target.classList)

  // 12. 新增 previousViewingPage 記得把前一個修改過的 button 樣式再修改回來
  if (previousViewingPage) {
    let previousPageClass = event.target.parentElement.parentElement.children[previousViewingPage - 1].children[0].classList
    changePaginatorStyle(previousPageClass)
  }

  previousViewingPage = Number(event.target.dataset.page)

  renderMovieList(getMoviesByPage(viewingPage), viewingMode)
})

// 11. 新增 changePaginatorStyle 函式，修改當前/先前 page 顯示的 paginator 樣式
function changePaginatorStyle(data) {
  data.toggle('bg-secondary')
  data.toggle('text-white')
  data.toggle('text-secondary')
}

// 6. 在 switchModeButton 新增監聽器，切換 viewingMode 及 按鈕樣式
switchModeButton.addEventListener('click', function onSwitchModeClicked(event) {
  if (event.target.tagName === 'I') {
    viewingMode = event.target.id
    const viewModes = event.target.parentElement.children
    for (let i = 0; i < viewModes.length; i++) {
      if (viewModes[i].id === viewingMode) {
        viewModes[i].classList.remove('text-secondary')
        viewModes[i].classList.add('text-light')
        viewModes[i].classList.remove('bg-light')
        viewModes[i].classList.add('bg-secondary')
      } else {
        viewModes[i].classList.add('text-secondary')
        viewModes[i].classList.remove('text-light')
        viewModes[i].classList.add('bg-light')
        viewModes[i].classList.remove('bg-secondary')
      }
    }
  }

  renderMovieList(getMoviesByPage(viewingPage), viewingMode)
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(viewingPage), viewingMode)
  })
  .catch((err) => console.log(err))


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    searchInput.value = ''  // 把 input.value 清空，alert 後跳回完整電影資料
    alert('Cannot find movie with keyword: ' + keyword)
  }

  showFilteredResult(filteredMovies)
})

// !! 搜尋 keyword 動態顯示搜尋結果
searchInput.addEventListener('input', function timelySearch() {
  const keyword = searchInput.value.trim().toLowerCase()
  // 一有 keyword 就開始搜尋
  if (keyword.length > 0) {
    filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(keyword)
    )
    if (filteredMovies.length) {
      showFilteredResult(filteredMovies)
    } else {
      getSearchResult = false
      dataPanel.innerHTML = '<h1 class="p-3 m-auto" style="color: coral;">NOT FOUND!&ensp;:(</h1>'
      paginator.innerText = ''
    }
  }
})
// !! 也新增 backspace 到 keyword = 0 時，重新 render 畫面
searchInput.addEventListener('keydown', function onSearchInputClicked(event) {
  if ((event.code === 'Backspace')) {
    filteredMovies = [] // 清空搜尋紀錄
    showFilteredResult(movies) // 這裡要放 movies 否則 paginator 會無法呈現
  }
})
// !! 將 showFilteredResult 獨立拉出為一個函式（因會重複使用）
function showFilteredResult(data) {
  viewingPage = 1 // 8. 按下搜尋鍵後，要將 viewingPage 修正回 1
  previousViewingPage = 1 // previousViewingPage 也要修正回 1
  getSearchResult = true
  renderPaginator(data.length)
  renderMovieList(getMoviesByPage(viewingPage), viewingMode)
}