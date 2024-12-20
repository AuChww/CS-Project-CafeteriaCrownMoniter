import cv2

class CameraService:
    def __init__(self, camera_index=0):
        self.cap = cv2.VideoCapture(camera_index)
        if not self.cap.isOpened():
            raise Exception("Cannot open camera")

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            raise Exception("Failed to capture frame from camera")
        return frame

    def release(self):
        self.cap.release()

    @staticmethod
    def draw_boxes(frame, result):
        for box in result.boxes:
            cv2.rectangle(frame, (box.x1, box.y1), (box.x2, box.y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                f"{box.label} ({box.confidence:.2f})",
                (box.x1, box.y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                2,
            )
        return frame
