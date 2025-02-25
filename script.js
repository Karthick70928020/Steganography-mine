const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

if (document.getElementById("imageInput")) {
    document.getElementById("imageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function encodeMessage() {
    const message = document.getElementById("messageInput").value;
    if (!message) {
        alert("Enter a message to encode.");
        return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let binaryMessage = message.split("").map(char => char.charCodeAt(0).toString(2).padStart(8, "0")).join("");
    binaryMessage += "00000000";

    if (binaryMessage.length > data.length / 4) {
        alert("Message too long to hide in this image.");
        return;
    }

    for (let i = 0; i < binaryMessage.length; i++) {
        data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryMessage[i]);
    }

    ctx.putImageData(imageData, 0, 0);

    const encodedImage = document.createElement("a");
    encodedImage.href = canvas.toDataURL("image/png");
    encodedImage.download = "hidden_data_image.png";
    encodedImage.click();

    alert("Message hidden. Save and share this image.");
}

if (document.getElementById("encodedImageInput")) {
    document.getElementById("encodedImageInput").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function decodeMessage() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let binaryMessage = "";
    for (let i = 0; i < data.length; i += 4) {
        binaryMessage += (data[i] & 1);
        if (binaryMessage.endsWith("00000000")) break;
    }

    let message = "";
    for (let i = 0; i < binaryMessage.length - 8; i += 8) {
        message += String.fromCharCode(parseInt(binaryMessage.substring(i, i + 8), 2));
    }

    document.getElementById("decodedMessage").innerText = "Decoded Message: " + message;
}
