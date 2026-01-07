let sysjson = 'script/systemdata.json';
let currentversion = localStorage.getItem('version');

function readSystemJson() {
    $.getJSON(sysjson, function (data) {
        console.log(data);
        let whatsnewlist = data.whatsnew;
        whatsnew(whatsnewlist);
        setversion(data.version);

    }).fail(function () {
        console.error("Error loading moduleset.json");

    });


}

function whatsnew(contem) {
    contem.forEach(element => {
        var layer = `<li class="list-group-item">${element}</li>`;
        //  document.getElementById('whatsnew').appendChild(layer);

        $("#whatsnew").append(layer);
    });

}

function setversion(version) {
    if (currentversion != version || currentversion == null) {
        localStorage.setItem('version', version);
        //show modal
       
    }

}

function ssweetAlert(type, title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: type
    });
}