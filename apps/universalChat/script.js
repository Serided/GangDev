$(document).ready(function () {
    $("#submitmsg").click(function () {
        var clientmsg = $("#usermsg").val();
        // add profanity filter by breaking sentences into words and replacing swearwords with asterisks
        if (clientmsg === "/clear") {
            $.post("php/clear.php");
            $("#usermsg").val("");
            return false;
        }
        else {
            $.post("php/post.php", { text: clientmsg });
            $("#usermsg").val("");
            return false;
        }
    });
    function loadLog() {
        var oldscrollHeight = $("#chatbox")[0].scrollHeight - 20; //Scroll height before the request
        $.ajax({
            url: "tmp/universalChatLog.html",
            cache: false,
            success: function (html) {
                $("#chatbox").html(html); //Insert chat log into the #chatbox div
                //Auto-scroll
                var newscrollHeight = $("#chatbox")[0].scrollHeight - 20; //Scroll height after the request
                if(newscrollHeight > oldscrollHeight){
                    $("#chatbox").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
                }
            }
        });
    }
    setInterval (loadLog, 1000);
    $("#exit").click(function () {
        var exit = confirm("Are you sure you want to end the session?");
        if (exit == true) {
            window.location = "index.php?logout=true";
        }
    });
});