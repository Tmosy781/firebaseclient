import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const Upload = () => {
    const [img, setImg] = useState(null);
    const [imgPerc, setImgPerc] = useState(0);
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        if (img) {
            uploadFile(img, "imgUrl");
        }
    }, [img]);

    const uploadFile = (file, fileType) => {
        const storage = getStorage(app);
        const folder = fileType === "imgUrl" ? "images/" : "files/";
        const fileName = new Date().getTime() + "_" + file.name;
        const storageRef = ref(storage, folder + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (fileType === "imgUrl") {
                    setImgPerc(Math.round(progress));
                }
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                    default:
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('Download URL:', downloadURL);
                    setInputs((prev) => {
                        return { ...prev, imgUrl: downloadURL, imgName: file.name };
                    });
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting data:", inputs); // Log the inputs to debug

        // Ensure that both imgName and imgUrl are set
        if (!inputs.imgName || !inputs.imgUrl) {
            console.error("imgName and imgUrl are required");
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(inputs),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Upload successful:", data);
            window.location.reload();
        } catch (error) {
            console.log("Error uploading image:", error);
        }
    };

    return (
        <div className="upload">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="img">Image:</label> {imgPerc > 0 && "Uploading: " + imgPerc + "%"}
                    <br />
                    <input type="file" id="img" accept="image/*"
                        onChange={(e) => setImg(e.target.files[0])} />
                </div>
                <br />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default Upload;