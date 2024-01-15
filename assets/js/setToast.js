
const toast = document.querySelector(".toast");
const progressBar = document.querySelector(".progress");

export default function toastMessage(value) {
    if (value) {
        showMessage("Yahoo!!", "Link3 provides coverage in this area", "5px solid green");
    } else {
        showMessage("Oops!!", "Sorry, we do not have coverage in this area", "5px solid red");
    }
}

document.querySelector(".close").addEventListener("click", function () {
    toast.classList.remove("active");
    progressBar.classList.remove("active");
});

function showMessage(header, body, color) {
    document.getElementById("toast-head").innerHTML = header;
    document.getElementById("toast-body").innerHTML = body;
    toast.style.borderBottom = color;
    toast.classList.add("active");
    progressBar.classList.add("active");
    setTimeout(() => {
        progressBar.classList.remove("active");
        toast.classList.remove("active");
    }, 5000);
}