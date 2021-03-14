$(document).ready(() => {
  // updating a user
  $("#update-profile-form").on("submit", event => {
    event.preventDefault();
    const id = $("#updateBtn").data("id");
    const updatedUser = {
      username: $("#username")
        .val()
        .trim(),
      email: $("#email")
        .val()
        .trim()
    };
    $.ajax("/api/update/" + id, {
      type: "PUT",
      data: updatedUser
    })
      .then(() => {
        location.replace("/login");
      })
      .catch(err => {
        console.log(err);
      });
    $("#username").val(updatedUser.username);
    $("#email").val(updatedUser.email);
    $("#password").val("");
  });

  //deleting a user
  $("#delete-button").click(function(event) {
    event.preventDefault();
    const id = $(this).data("id");
    $.ajax({
      url: "/api/delete/" + id,
      type: "DELETE"
    })
      .then(() => {
        location.replace("/");
      })
      .catch(err => {
        console.log(err);
      });
  });
});
