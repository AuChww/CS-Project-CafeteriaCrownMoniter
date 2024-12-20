import cv2

class CameraService:
    def __init__(self, camera_index=0):
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            raise Exception("Cannot open camera")

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            raise Exception("Failed to read frame from camera")
        return frame

    def release(self):
        self.cap.release()
