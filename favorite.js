const BASE_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const emptyFavoritePage = document.querySelector(".empty-favorite");

const users = JSON.parse(localStorage.getItem("favorite")) || [];

function renderUserList(data) {
  let rawHTML = "";
  if (!data || !data.length) {
    rawHTML = `
    <h1 class="mt-4 text-center">您尚未有收藏的教師資訊</h1>
    <div class="text-center">
    <a class="btn btn-lg btn-outline-secondary mt-5 mb-5" href="index.html">帶我去首頁</a>
    </div>
  `;
    dataPanel.innerHTML = rawHTML;
  } else {
    data.forEach((item) => {
      rawHTML += `
    <div class="col-sm-6 col-md-4 mb-4">
      <div class="card">
        <img class="card-img-top"
        src="${item.avatar}"
        alt="user-photo"
        >
        <div class="card-footer text-muted">
          <p id="card-name" class="text-center mt-0 mb-0">${item.name}</p>
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
           class="btn btn-danger btn-remove-from-favorite"
           data-id=${item.id}
           >
           <i class="fa-solid fa-trash-can btn-remove-from-favorite" data-id=${item.id}></i>
          </button>
          </div>
        </div>    
      </div>
    </div>`;
    });
  }

  dataPanel.innerHTML = rawHTML;
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

function removeFromFavorite(id) {
  if (!users || !users.length) return;
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return;
  users.splice(userIndex, 1);
  localStorage.setItem("favorite", JSON.stringify(users));
  renderUserList(users);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-from-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderUserList(users);
