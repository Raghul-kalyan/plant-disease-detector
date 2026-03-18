let model;
    const URL = "model/"; // make sure model folder is in repo
    const labels = []; // optional: leave empty or manually add labels if needed

    async function loadModel() {
      model = await tmImage.load(URL + "model.json");
      console.log("Model loaded ✅");
    }
    loadModel();

    // ----------- Option 1: File input -----------

    async function predictFile(event) {
      if (!model) return alert("Model still loading...");

      const file = event.target.files[0];
      if (!file) return;

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const prediction = await model.predict(canvas);
        showPrediction(prediction);
      };
    }

    function showPrediction(prediction) {
      let best = prediction[0];
      for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > best.probability) {
          best = prediction[i];
        }
      }

      // Use labels array if you want custom names
      let name = labels[best.classIndex] || best.className;

      document.getElementById("result").innerText =
        `Prediction: ${name} (${(best.probability * 100).toFixed(2)}%)`;
    }

    // ----------- Option 2: Live camera -----------

    const video = document.getElementById("camera");
    const captureBtn = document.getElementById("captureBtn");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function startCamera() {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          video.srcObject = stream;
          captureBtn.style.display = "inline-block";
        })
        .catch(err => alert("Camera access denied or not available"));
    }

    async function capture() {
      if (!model) return alert("Model still loading...");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const prediction = await model.predict(canvas);
      showPrediction(prediction);
    }