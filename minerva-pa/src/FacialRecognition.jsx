import { useRef, useEffect } from 'react'
import * as faceapi from 'face-api.js'

function FacialRecognition() {
    const videoRef = useRef()
    const canvasRef = useRef()

    // LOAD FROM USEEFFECT
    useEffect(() => {
        startVideo()
        videoRef && loadModels()

    },)

    // OPEN YOU FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream
            })
            .catch((err) => {
                console.log(err)
            })
    }
    // LOAD MODELS FROM FACE API

    const loadModels = () => {
        Promise.all([
            // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")

        ]).then(() => {
            faceMyDetect()
        })
    }

    const faceMatcher = new faceapi.FaceMatcher(loadLabeledImages)

    /*async function faceMatcher() {
        const labeledFaceDescriptors = await loadLabeledImages()
        return new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    }*/

    const faceMyDetect = () => {
        setInterval(async () => {

            const detections = await faceapi.detectAllFaces(videoRef.current,
                new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors()

            //const resizeDetections = faceapi.resiz
            // DRAW YOU FACE IN WEBCAM
            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current)
            faceapi.matchDimensions(canvasRef.current, {
                width: canvasRef.current.width,
                height: canvasRef.current.height
            })

            const resized = faceapi.resizeResults(detections, {
                width: canvasRef.current.width,
                height: canvasRef.current.height
            })


            const resizedDetections = faceapi.resizeResults(detections, resized)
            const results = resizedDetections.map(d => {
                const bestMatch = faceMatcher.findBestMatch(d.descriptor)
                console.log(bestMatch.toString())
            })
            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvasRef.current, resized)
            })

            faceapi.draw.drawDetections(canvasRef.current, resized)
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)


        }, 1000)
    }

    const loadLabeledImages = () => {
        const labels = ['Andrey', 'David']
        return Promise.all(
            labels.map(async label => {
                const descriptions = []
                for (let i = 1; i <= 2; i++) {
                    const img = await faceapi.fetchImage(`minerva-pa/src/assets/labeled_image/${label}/${i}`)
                    const detections = await faceapi.detectSingleFace(img)
                        .withFaceLandmarks().withFaceDescriptors()
                    descriptions.push(detections.descriptor)
                }
                return new faceapi.LabeledFaceDescriptors(label, descriptions)
            })
        )
    }

    return (
        <div className="myapp">
            <h1>Minerva P. A.</h1>
            <h2>Facial Login</h2>
            <div className="appvide">

                <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
            </div>
            <canvas ref={canvasRef} width="720" height="560"
                className="appcanvas" />
        </div>
    )

}

export default FacialRecognition;