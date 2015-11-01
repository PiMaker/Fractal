var temp = window.localStorage.getItem("password");
if (temp !== undefined && temp !== "") {
    $("#inputPassword").val(temp);
    document.getElementById("chkPassword").checked = true;
}

function connectClick() {
    var pass = $("#inputPassword").val();

    if ($("#chkPassword").val() === "remember-password") {
        window.localStorage.setItem("password", pass);
    } else {
        window.localStorage.setItem("password", undefined);
    }

    $("body").waitMe({
        effect: "stretch",
        text: "Logging in...",
        bg: "rgba(0,0,0,0.5)",
        color: "#FFFFFF",
        sizeW: "",
        sizeH: "",
        source: ""
    });

    var shaPass = sha256(pass);

    $.ajax({
        dataType: "json",
        url: "api.php?action=login&password=" + shaPass,
        success: function (data) {
            if (data.success == 1) {
                sessionStorage.setItem("fractal-pass", shaPass);
                window.location = "music.php?password=" + shaPass;
            } else {
                Ply.dialog("alert", data.error);
                $("body").waitMe("hide");
            }
        },
        error: function (error, nothing, msg) {
            if (error.status === 0) {
                msg = "Connection lost.";
            }
            Ply.dialog("alert", msg + " (" + error.status + ")");
            $("body").waitMe("hide");
        }
    });
}

document.getElementById("btnConnect").addEventListener("click", connectClick, false);