const btnDeleteComment = document.getElementById("btn-delete");

btnDeleteComment.onclick = () => {
  let violatedComments = document.querySelectorAll(".comment-value.delete");
  let deleteIds = [];
  for (let violate of violatedComments) {
    deleteIds.push(violate.textContent);
  }

  console.log(deleteIds);
  //   create http req send deleteIds
  const xhr = new XMLHttpRequest();
  const url = "http://localhost:3000/management/comments";
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
