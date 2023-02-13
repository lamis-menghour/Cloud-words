function validationName() {
    var letters = /^[A-Za-z]+$/
    var name = document.getElementById("SugName").value
    if (name.match(letters)) {
        if (2 < name.length && name.length < 10) {
            document.getElementById("nameValidation").innerHTML = "Valid Name"
            // console.log("true")
            return true
        }
        else if (name.length < 3 || name.length > 10) {
            document.getElementById("nameValidation").innerHTML = "Invalid Name"
            // console.log("lenght false")
            return false
        }
    }
    else {
        document.getElementById("nameValidation").innerHTML = "Invalid Name"
        // console.log("invalid false")
        return false
    }
}

function validateForm() {
    let name = document.getElementById("SugName").value;
    if (name == "") {
        alert("Please fill out this field");
        return false;
    }
    else if (validationName()) {
        return true
    }
}


function checkifexist(name, nameWord) {
    if (nameWord.includes(name)) {
        return true
    }
    else {
        return false
    }
}


setInterval(tagCloud, 1500);
var url = "http://sheordatabase.pythonanywhere.com/Cloud_Word_lamis/"
credentials = btoa("ELLabs:123jijel");


function tagCloud() {
    fetch(url,
        {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        })
        .then((response) => response.json())
        .then((namesJson) => {
            document.getElementById("suggestNameCloud").innerHTML = "";

            anychart.onDocumentReady(function () {
                var NAMES = [];
                for (let i = 0; i < namesJson.length; i++) {
                    // x to set words
                    var name = namesJson[i].word;

                    // value to set frequencies
                    var freq = namesJson[i].freq;

                    NAMES.push({ "x": name, "value": freq })
                }
                // console.log("NAMES=", NAMES);


                // create a chart and set the data
                var chart = anychart.tagCloud(NAMES);

                // set a chart title
                // chart.title("Suggested Names");

                var background = chart.background();
                background.fill('');



                // set an array of angles at which the words will be laid out
                // chart.angles([0, 45, -45]);
                // chart.angles([0, -90]);
                // chart.anglesCount(6);

                // set text spacing
                chart.textSpacing(5);

                // set the container id
                chart.container("suggestNameCloud");
                // initiate drawing the chart
                chart.draw();


                var wordNormal = chart.normal();
                wordNormal.fontFamily('arial');
                wordNormal.fontWeight(600);
                wordNormal.stroke('#d29b9b');

                var wordHover = chart.hovered();
                wordHover.fontSize(90);
                wordHover.stroke('#d29b9b');



                // create and configure a color scale.
                var customcolor = anychart.scales.linearColor();
                // customcolor.colors('brown', 'YellowGreen', 'olive', 'DarkGreen', 'SaddleBrown');
                customcolor.colors('#f48fb1', '#d81b60', '#880e4f');

                // set the color scale as the color scale of the chart
                chart.colorScale(customcolor);

                /*
                    // enable a color range
                    chart.colorRange(true);
        
                    // set the color range length
                    chart.colorRange().length('90%');
                */
            })
        })
}

function submitName() {
    fetch(url,
        {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}`
            }
        })
        .then((response) => response.json())
        .then((Json) => {
            nameWord = Json.map(a => a.word);

            // localStorage.setItem("nameWord", nameWord);
            // console.log(localStorage.getItem("nameWord"));

            var name = document.getElementById("SugName").value.toLowerCase();
            if (validateForm()) {
                if (checkifexist(name, nameWord)) {
                    nameIndex = nameWord.indexOf(name);
                    nameFreq = Json[nameIndex].freq + 2;
                    nameId = Json[nameIndex].cloud_word_id;
                    console.log("name exist ", nameFreq)

                    fetch(`http://sheordatabase.pythonanywhere.com/Cloud_Word_lamis/${nameId}`,
                        {
                            method: "PUT",
                            headers: {
                                "Authorization": `Basic ${credentials}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "freq": nameFreq
                            })
                        })
                }
                else {
                    nameFreq = 2
                    fetch(url,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": `Basic ${credentials}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "word": name,
                                "freq": nameFreq
                            })
                        })
                }

            }

            document.getElementById("SugName").value = '';
            document.getElementById("nameValidation").innerHTML = "";
        })

        .catch(err => console.error(err));
}
// window.onload = timedRefresh(5000);


// location.reload(5000);



