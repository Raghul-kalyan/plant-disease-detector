let model;

// Load the pre-trained model
async function loadModel() {
  model = await tf.loadLayersModel("model/model.json");
  console.log("Model loaded");
}
loadModel();

async function preprocessImage(image) {
  return tf.tidy(() => {
    return tf.browser
      .fromPixels(image, 3)
      .resizeBilinear([224, 224])
      .expandDims(0);
  });
}

const classes = [
  "Tomato - Healthy",
  "Tomato - Late Blight",
  "Tomato - Early Blight",
];

async function predict() {
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const tensor = await preprocessImage(img);

    const prediction = model.predict(tensor);
    const probs = await prediction.data();

    console.log("Probabilities:", probs);

    const maxIndex = probs.indexOf(Math.max(...probs));

    document.getElementById("result").innerText =
      "Prediction: " + classes[maxIndex];
  };
}
