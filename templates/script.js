function start() {
    document.getElementById("start_page").style.display = "none";
    document.getElementById("train_page").style.display = "block";
}

function mainBlock() {

}
function changeContent() {
    // Select the image and text elements by their IDs
    const imageElement = document.getElementById("Output_Image");
    const textElement = document.getElementById("Output_Text");

    // Update the image source and text content
    imageElement.src = "../asset/cat.jpg";
    textElement.querySelector("h1").textContent = "cat";
}

