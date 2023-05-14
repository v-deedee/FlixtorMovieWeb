const btnMakeAdmin = document.getElementById("btn-make-admin");
const btnDeleteUser = document.getElementById("btn-delete");

btnMakeAdmin.onclick = () => {
  let checkBoxs = document.getElementsByName("makeAdminCheckBox");
  let makeAdminIds = [];
  for (let checkBox of checkBoxs) {
    if (checkBox.checked) {
      makeAdminIds.push(checkBox.value);
    }
  }

  //   console.log(makeAdminIds);
  //   create http req send makeAdminIds
  if (makeAdminIds.length !== 0) {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:3000/management/users";
    const data = { makeAdminIds: makeAdminIds };
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function () {
      if (xhr.status === 200) {
        alert("Success.");
        location.reload();
      }
    });
    xhr.addEventListener("error", function () {
      alert("Fail!");
      location.reload();
    });
    xhr.send(JSON.stringify(data));
  } else {
    alert("Please select.");
  }
};

btnDeleteUser.onclick = () => {
  let bannedUsers = document.querySelectorAll(".user-value.ban");
  let deleteIds = [];
  for (let ban of bannedUsers) {
    deleteIds.push(ban.textContent);
  }

  //   console.log(deleteIds);
  //   create http req send deleteIds
  const xhr = new XMLHttpRequest();
  const url = "http://localhost:3000/management/users";
  const data = { deleteIds: deleteIds };
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      alert("Success.");
      location.reload();
    }
  });
  xhr.addEventListener("error", function () {
    alert("Fail!");
    location.reload();
  });
  xhr.send(JSON.stringify(data));
};
