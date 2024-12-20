import cv2
import numpy as np

class Zone:
    def __init__(self, points):
        self.points = np.array(points, dtype=np.int32)

    def is_inside(self, point):
        return cv2.pointPolygonTest(self.points, point, False) >= 0

    def get_points(self):
        return self.points
