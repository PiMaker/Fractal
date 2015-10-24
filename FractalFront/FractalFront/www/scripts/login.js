var temp = window.localStorage.getItem("server");
if (temp !== undefined && temp !== "") {
    $("#inputServer").val(temp);
    $("#chkServer").attr("checked", "true");
}

temp = window.localStorage.getItem("password");
if (temp !== undefined && temp !== "") {
    $("#inputPassword").val(temp);
    $("#chkPassword").attr("checked", "true");
}

function connectClick() {
    if ($("#chkServer").val() === "remember-server") {
        window.localStorage.setItem("server", $("#inputServer").val());
    } else {
        window.localStorage.setItem("server", undefined);
    }

    if ($("#chkPassword").val() === "remember-password") {
        window.localStorage.setItem("password", $("#inputPassword").val());
    } else {
        window.localStorage.setItem("password", undefined);
    }

    $("body").waitMe({
        effect: "stretch",
        text: "",
        bg: "rgba(0,0,0,0.5)",
        color: "#FFFFFF",
        sizeW: "",
        sizeH: "",
        source: ""
    });

    var url = $("#inputServer").val() + "?pw=" + $("#inputPassword").val();
    if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
        url = "http://" + url;
    }
    $.ajax({
        dataType: "json",
        url: url,
        success: function (data) {
            sessionStorage.jsonData = JSON.stringify(data);
            window.location = "music.html";
        },
        error: function(error, msg) {
            Ply.dialog("alert", msg + " (" + error.status + ")");
            $("body").waitMe("hide");
        }
    });
}

document.getElementById("btnConnect").addEventListener("click", connectClick, false);