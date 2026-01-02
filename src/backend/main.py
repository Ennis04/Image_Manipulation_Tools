import cv2
import numpy as np

def apply_brightness(img, value):
    return cv2.convertScaleAbs(img, alpha=1.0, beta=value)

def apply_sharpness(img, value):
    if value <= 0:
        return img
    kernel = np.array([[0, -1, 0],
                       [-1, 5 + value / 10, -1],
                       [0, -1, 0]])
    return cv2.filter2D(img, -1, kernel)

def apply_noise_reduction(img, value):
    if value <= 0:
        return img
    k = max(1, (value // 10) * 2 + 1)
    return cv2.medianBlur(img, k)

def process_image(img, params):
    img = apply_brightness(img, params.get("brightness", 0))
    img = apply_sharpness(img, params.get("sharpness", 0))
    img = apply_noise_reduction(img, params.get("denoise", 0))
    return img
