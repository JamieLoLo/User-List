const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

const users = [];
let filteredUsers = [];
const USERS_PER_PAGE = 12;

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-6 col-md-4 mb-4">
      <div class="card">
        <img class="card-img-top"
        src="${item.avatar}"
        alt="user-photo"
        >
        <div class="card-footer text-muted">
          <p id="card-name" class="text-center mt-2 mb-1">${item.name}</p>
          <p class="text-center"><i class="fa-solid fa-flag"></i> ${item.region}</p>
          <div class="card-button">
            <button
            class="btn btn-secondary btn-show-user me-2"
            data-bs-target="#user-modal"
            data-bs-toggle="modal"
            data-id=${item.id}
            >
            更多資訊
            </button>
            <button
            class="btn btn-outline-secondary btn-add-to-favorite"
            data-id=${item.id}
            >
           
            <i class="fa-solid fa-bookmark btn-add-to-favorite" data-id=${item.id}></i>
            </button>
          </div>
        </div>    
      </div>
    </div>`;
    dataPanel.innerHTML = rawHTML;
  });
}

function showUserModal(id) {
  const modalTitle = document.querySelector("#modal-username");
  const modalImage = document.querySelector("#modal-image");
  const modalAge = document.querySelector("#modal-age");
  const modalBirthday = document.querySelector("#modal-birthday");
  const modalEmail = document.querySelector("#modal-email");
  const modalRegion = document.querySelector("#modal-region");
  axios
    .get(BASE_URL + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = data.name;
      modalAge.innerText = `Age: ${data.age}`;
      modalBirthday.innerText = `Birthday: ${data.birthday}`;
      modalEmail.innerText = `Email: ${data.email}`;
      modalRegion.innerText = `Region: ${data.region}`;
      modalImage.innerHTML = `
        <img
          src="${data.avatar}" alt="user-photo"
          />`;
    })
    .catch((err) => {
      console.log(err);
    });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favorite")) || [];
  const user = users.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert(`${user.name} 教師已經在收藏清單中`);
  }
  console.log(user);
  list.push(user);
  localStorage.setItem("favorite", JSON.stringify(list));
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
        <li class="page-item mt-3 mb-3"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getUserByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-to-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  let keyword = searchInput.value.trim().toUpperCase();
  filteredUsers = users.filter((user) =>
    user.region.trim().toUpperCase().includes(keyword)
  );
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字 ${keyword} 沒有符合條件的教師`);
  }
  renderPaginator(filteredUsers.length);
  renderUserList(getUserByPage(1));
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderUserList(getUserByPage(page));
});

axios
  .get(BASE_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderPaginator(users.length);
    renderUserList(getUserByPage(1));
  })
  .catch((err) => {
    console.log(err);
  });
