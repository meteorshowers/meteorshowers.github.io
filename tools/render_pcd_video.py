#!/usr/bin/env python3
import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


DTYPE = np.dtype(
    [
        ("x", "<f4"),
        ("y", "<f4"),
        ("z", "<f4"),
        ("intensity", "<f4"),
        ("ring", "<u2"),
        ("timestamp", "<f8"),
    ]
)


def read_pcd(path):
    header = []
    with open(path, "rb") as f:
        while True:
            line = f.readline()
            if not line:
                raise ValueError(f"{path} has no DATA line")
            header.append(line.decode("utf-8", "replace").strip())
            if line.startswith(b"DATA"):
                break
        points = None
        for line in header:
            if line.startswith("POINTS "):
                points = int(line.split()[1])
        data = np.frombuffer(f.read(), dtype=DTYPE, count=points)
    xyz = np.column_stack([data["x"], data["y"], data["z"]]).astype(np.float32)
    intensity = data["intensity"].astype(np.float32)
    mask = np.isfinite(xyz).all(axis=1)
    xyz = xyz[mask]
    intensity = intensity[mask]
    radius = np.linalg.norm(xyz[:, :2], axis=1)
    valid = (radius > 0.1) & (radius < 80.0) & (xyz[:, 2] > -10.0) & (xyz[:, 2] < 10.0)
    return xyz[valid], intensity[valid]


def normalize(values, lo=None, hi=None):
    if lo is None:
        lo = np.nanpercentile(values, 2)
    if hi is None:
        hi = np.nanpercentile(values, 98)
    return np.clip((values - lo) / max(hi - lo, 1e-6), 0, 1)


def colorize(intensity, z):
    iv = normalize(intensity)
    zv = normalize(z)
    r = (45 + 210 * iv).astype(np.uint8)
    g = (90 + 130 * (1 - np.abs(zv - 0.5) * 2)).astype(np.uint8)
    b = (130 + 105 * (1 - iv)).astype(np.uint8)
    return np.column_stack([r, g, b])


def render_frame(point_sets, colors, labels, angle, out_path, size=(1280, 720)):
    w, h = size
    img = Image.new("RGB", size, (247, 248, 246))
    pixels = np.asarray(img).copy()
    depth = np.full((h, w), np.inf, dtype=np.float32)

    yaw = math.radians(angle)
    pitch = math.radians(18)
    cy, sy = math.cos(yaw), math.sin(yaw)
    cp, sp = math.cos(pitch), math.sin(pitch)
    rot_yaw = np.array([[cy, -sy, 0], [sy, cy, 0], [0, 0, 1]], dtype=np.float32)
    rot_pitch = np.array([[1, 0, 0], [0, cp, -sp], [0, sp, cp]], dtype=np.float32)
    rot = rot_pitch @ rot_yaw

    all_rot = []
    for pts in point_sets:
        all_rot.append(pts @ rot.T)
    merged = np.vstack(all_rot)
    span = np.percentile(np.linalg.norm(merged[:, :2], axis=1), 98)
    scale = min(w, h) * 0.42 / max(span, 1e-6)

    for pts, cols in zip(all_rot, colors):
        x = (pts[:, 0] * scale + w * 0.5).astype(np.int32)
        y = (-pts[:, 1] * scale + h * 0.54).astype(np.int32)
        z = pts[:, 2]
        keep = (x >= 0) & (x < w) & (y >= 0) & (y < h)
        x, y, z, cols = x[keep], y[keep], z[keep], cols[keep]
        order = np.argsort(z)
        for idx in order:
            xx, yy = x[idx], y[idx]
            if z[idx] <= depth[yy, xx]:
                depth[yy, xx] = z[idx]
                pixels[yy, xx] = cols[idx]
                if xx + 1 < w:
                    pixels[yy, xx + 1] = cols[idx]

    img = Image.fromarray(pixels)
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rounded_rectangle((28, 24, 360, 110), radius=8, fill=(255, 255, 255, 220), outline=(20, 30, 34, 35))
    draw.text((48, 42), "Airy LiDAR point cloud", fill=(17, 24, 32, 255))
    draw.text((48, 70), f"Yaw {angle:03.0f} deg · {sum(len(p) for p in point_sets):,} points", fill=(86, 97, 104, 255))
    y0 = 126
    for label, col in zip(labels, [(210, 72, 64, 255), (50, 130, 185, 255)]):
        draw.ellipse((48, y0, 60, y0 + 12), fill=col)
        draw.text((70, y0 - 2), label, fill=(47, 56, 61, 255))
        y0 += 24
    img.save(out_path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pcd", nargs="+")
    parser.add_argument("--out-dir", default="/private/tmp/airy_pointcloud/frames")
    parser.add_argument("--frames", type=int, default=120)
    parser.add_argument("--max-points", type=int, default=65000)
    args = parser.parse_args()

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    point_sets, colors, labels = [], [], []
    for i, p in enumerate(args.pcd):
        pts, inten = read_pcd(Path(p))
        if len(pts) > args.max_points:
            idx = np.linspace(0, len(pts) - 1, args.max_points).astype(np.int32)
            pts, inten = pts[idx], inten[idx]
        pts = pts - np.median(pts, axis=0)
        point_sets.append(pts)
        cols = colorize(inten, pts[:, 2])
        if i == 1:
            cols = np.column_stack([cols[:, 2], cols[:, 1], cols[:, 0]])
        colors.append(cols)
        labels.append(Path(p).stem)

    for i in range(args.frames):
        angle = i * 360.0 / args.frames
        render_frame(point_sets, colors, labels, angle, out_dir / f"frame_{i:04d}.png")


if __name__ == "__main__":
    main()
