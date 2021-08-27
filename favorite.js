const BASE_URL ="https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [] // favorite.js 需要修改這裡!!!
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


function renderMovieList(data) {
  let rawHTML = " "

  data.forEach((item) => {
    // console.log(item)
    // title, image, id 隨著每個 item 改變
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img class="card-img-top" src="${POSTER_URL + item.image}" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button> 
            </div>
          </div>
        </div>
      </div>
    `
  })

  dataPanel.innerHTML = rawHTML
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

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  // console.log(movieIndex)
  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies) 
}

// favorite.js 新增 removeFromFavorite 函式
function removeFromFavorite(id) {
  if (!movies) return
  
  const movieIndex = movies.findIndex((movie) => movie.id === id) //透過 id 找到要刪除電影的 index
  // console.log(movieIndex)
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1) //刪除該筆電影
  localStorage.setItem('favoriteMovies', JSON.stringify(movies)) //存回 local storage
  renderMovieList(movies) // 每次 remove 後，重新 renderMovie，方能即時更新頁面
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  console.log(event.target)
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))  // favorite.js 需要修改這裡!!!
  }
})

renderMovieList(movies) // 最後記得要 render 頁面