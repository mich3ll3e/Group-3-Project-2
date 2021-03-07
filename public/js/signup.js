$(document).ready(function(){
    $("#signup-form").on("submit",function(e){
        e.preventDefault();
        const newUser = {
            username:$("#username").val().trim(),
            email:$("#email").val().trim(),
            password:$("#password").val().trim()
        }
        signUpUser(newUser);
        $("#username").val("");
        $("#email").val("")
        $("#password").val("")
    });

    function signUpUser(newUser) {
        
    $.ajax("/api/signup", {
      type: "POST",
      data: newUser
    }).then(function() {
        location.replace("/login");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});