function set_theme_from_queryparams() {
    const params = new URLSearchParams(window.location.search);
    
    var title = params.get("title");
    if (title) set_salutation(title);

    var bg_theme = params.get("bg");
    if (bg_theme) set_background(bg_theme);

    var content = params.get("content");
    if (content) set_content_from_compressed(content);
}


function set_salutation(text) {
    if (text && text.length > 0)
        document.getElementById("header").innerText = text;
}

function set_background(theme_name) {
    var elements = document.querySelectorAll(".theme");
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.classList.remove("active");
        if (element.classList.contains(theme_name)) {
            element.classList.add("active");
        }
    }
}

async function set_content_from_compressed(content) {
    if (content && content.length > 0) {
        var str = await wysiwyg.decode_compressed_url_safe(content);
        document.getElementById("user-content").innerHTML = str;
    }
}