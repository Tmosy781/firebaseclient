import axios from "axios";
import React, { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase";

const Upload = () => {
    const [img, setImg] = useState(null);
    const [imgPerc, setImgPerc] = useState(0);
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        img && uploadFile(img, "imgUrl");
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
                        return { ...prev, [fileType]: downloadURL, name: file.name };
                    });
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8082/api/images', { ...inputs });
            window.location.reload();
        } catch (error) {
            console.log(error);
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