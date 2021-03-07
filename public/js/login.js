$(document).ready(function(){
    $("#login-form").on("submit",function(e){
        e.preventDefault();
        const user = {
            username:$("#username").val().trim(),
            password:$("#password").val().trim()
        }
        loginUser(user);
        $("#username").val("");
        $("#password").val("")
    });

    function loginUser(user) {
        
    $.ajax("/api/login", {
      type: "POST",
      data: user
    }).then(function() {
        location.replace("/chat");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

