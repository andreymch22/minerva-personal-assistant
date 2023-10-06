import * as faceapi from 'face-api.js'
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
            console.log(descriptions)
            //return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

loadLabeledImages()