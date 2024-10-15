import React, { useRef, useState, useEffect, useCallback } from 'react';
import Tesseract from 'tesseract.js'; // Importa Tesseract para la detección de texto (placas)
import '@tensorflow/tfjs'; // Cargar TensorFlow.js en el hilo principal

function SubirVideo() {
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [detections, setDetections] = useState([]);
    const previousDetectionsRef = useRef([]);
    const workerRef = useRef(null);

    // Crear el Web Worker dinámicamente con un Blob
    useEffect(() => {
        const workerCode = `
      self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
      self.importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');
      
      let model;

      self.onmessage = async function (e) {
        const { imageData } = e.data;

        if (!model) {
          model = await cocoSsd.load(); // Cargar el modelo solo una vez
        }

        const predictions = await model.detect(imageData);
        self.postMessage({ predictions });
      };
    `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerBlobUrl = URL.createObjectURL(blob);
        workerRef.current = new Worker(workerBlobUrl);

        // Manejar los mensajes del Worker
        workerRef.current.onmessage = (e) => {
            const { predictions } = e.data;

            const enhancedPredictions = predictions.map((prediction) => {
                const previousPrediction = previousDetectionsRef.current.find(
                    (prev) => prev.class === prediction.class
                );
                const speed = calculateSpeed(prediction, previousPrediction);
                return {
                    ...prediction,
                    speed: Math.round(speed * 3.6), // Convertir de m/s a km/h
                };
            });

            setDetections(enhancedPredictions);
            previousDetectionsRef.current = enhancedPredictions.map(prediction => ({
                ...prediction,
                timestamp: Date.now()
            }));
        };

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (videoFile) {
            const videoUrl = URL.createObjectURL(videoFile);
            setVideoUrl(videoUrl);
            setIsProcessing(true);
            setShowModal(true);
        }
    };

    const calculateSpeed = (currentDetection, previousDetection) => {
        if (!previousDetection) return 0;
        const deltaX = currentDetection.bbox[0] - previousDetection.bbox[0];
        const deltaY = currentDetection.bbox[1] - previousDetection.bbox[1];
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const deltaTime = (Date.now() - previousDetection.timestamp) / 1000;
        return distance / deltaTime; // Velocidad en píxeles por segundo
    };

    const detectFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const processFrame = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            workerRef.current.postMessage({ imageData });

            requestAnimationFrame(processFrame);
        };

        requestAnimationFrame(processFrame);
    }, []);

    useEffect(() => {
        if (videoRef.current && isProcessing) {
            videoRef.current.onplay = () => {
                detectFrame();
            };
        }
    }, [isProcessing, detectFrame]);

    const closeModal = () => {
        setShowModal(false);
        setIsProcessing(false);
        setVideoUrl(null);
        setDetections([]);
    };

    // Función para dibujar las cajas de detección en el canvas
    const drawBoundingBoxes = (context, detections) => {
        detections.forEach(detection => {
            const { bbox, class: className } = detection;
            const [x, y, width, height] = bbox;

            // Dibuja un rectángulo alrededor de la detección
            context.beginPath();
            context.rect(x, y, width, height);
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.fillStyle = 'red';
            context.stroke();

            // Dibuja el texto con la clase del objeto detectado
            context.font = '18px Arial';
            context.fillStyle = 'red';
            context.fillText(`${className} (${Math.round(detection.score * 100)}%)`, x, y > 10 ? y - 5 : 10);
        });
    };

    // Función para reconocer texto (placas) en la zona de los vehículos detectados
    const recognizeLicensePlate = (imageData, bbox) => {
        const croppedImageData = cropImage(imageData, bbox); // Recortar la zona donde se espera la placa

        return new Promise((resolve, reject) => {
            Tesseract.recognize(croppedImageData, 'eng', {
                logger: info => console.log(info),
            })
                .then(({ data: { text } }) => {
                    resolve(text.trim());
                })
                .catch(reject);
        });
    };

    // Función para recortar la imagen en función del bounding box
    const cropImage = (imageData, bbox) => {
        const [x, y, width, height] = bbox;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.putImageData(imageData, -x, -y);
        return canvas.toDataURL();
    };

    // Detecta los objetos en cada fotograma y dibuja las cajas
    const detectFrameAndDraw = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const processFrame = async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            workerRef.current.postMessage({ imageData });

            // En lugar de:
            // await workerRef.current.onmessage = async (e) => {
            // Cambiar a:
            workerRef.current.onmessage = async (e) => {
                const { predictions } = e.data;

                const enhancedPredictions = await Promise.all(predictions.map(async (prediction) => {
                    const previousPrediction = previousDetectionsRef.current.find(
                        (prev) => prev.class === prediction.class
                    );
                    const speed = calculateSpeed(prediction, previousPrediction);
                    const plateText = await recognizeLicensePlate(imageData, prediction.bbox);

                    return {
                        ...prediction,
                        speed: Math.round(speed * 3.6), // Convertir a km/h
                        plate: plateText || 'No placa detectada',
                    };
                }));

                setDetections(enhancedPredictions);
                previousDetectionsRef.current = enhancedPredictions.map(prediction => ({
                    ...prediction,
                    timestamp: Date.now()
                }));

                // Dibuja las cajas en el canvas
                drawBoundingBoxes(context, enhancedPredictions);
            };


            requestAnimationFrame(processFrame);
        };

        requestAnimationFrame(processFrame);
    }, [detections]);

    useEffect(() => {
        if (videoRef.current && isProcessing) {
            videoRef.current.onplay = () => {
                detectFrameAndDraw();
            };
        }
    }, [isProcessing, detectFrameAndDraw]);

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Subir Video desde PC</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={!videoFile}
                >
                    Procesar Video
                </button>
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl relative">
                        <h3 className="text-2xl font-semibold mb-4">Video Procesado</h3>

                        <div className="flex">
                            {/* Sección izquierda: Video y Canvas (70%) */}
                            <div className="w-7/10 pr-4">
                                <div className="relative" style={{ width: '100%', height: 'auto' }}>
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        controls
                                        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
                                        autoPlay
                                        muted
                                    >
                                        Tu navegador no soporta la etiqueta de video.
                                    </video>
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0"
                                        style={{ pointerEvents: 'none', zIndex: 2, width: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>

                            {/* Sección derecha: Texto de los vehículos detectados (30%) */}
                            <div className="w-3/10">
                                {detections.length > 0 && (
                                    <div className="ml-4">
                                        <h4 className="text-xl font-semibold mb-2">Vehículos Detectados</h4>
                                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                                            {detections.map((detection, index) => (
                                                <li key={index} className="text-gray-700">
                                                    <p>Clase: {detection.class}</p>
                                                    <p>Confianza: {Math.round(detection.score * 100)}%</p>
                                                    <p>Velocidad: {detection.speed} km/h</p>
                                                    <p>Placa: {detection.plate}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubirVideo;
