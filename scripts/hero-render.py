"""Hero render: black honey pouring onto a black feather quill. Usage:
python3 scene.py <out_dir> <frame_start> <frame_end> <samples> <res_x> <res_y>
"""
import math
import random
import sys

import bpy
from mathutils import Vector

OUT, F0, F1, SAMPLES, RX, RY = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6])
FPS = 30
LOOP = 144  # frames; every motion below has a period that divides this

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.glossy_bounces = 4
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.render.resolution_x = RX
scene.render.resolution_y = RY
scene.render.fps = FPS
scene.render.threads_mode = "AUTO"
scene.render.image_settings.file_format = "PNG"
scene.render.use_motion_blur = False
scene.render.film_transparent = False
scene.view_settings.view_transform = "Filmic" if "Filmic" in [v.name for v in bpy.types.ColorManagedViewSettings.bl_rna.properties["view_transform"].enum_items] else "AgX"
scene.view_settings.look = "None"

world = bpy.data.worlds.new("w")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0, 0, 0, 1)
scene.world = world


def setp(node, names, value):
    for name in names:
        if name in node.inputs:
            node.inputs[name].default_value = value
            return


def material(name, color, rough, metallic=0.0, coat=1.0, coat_rough=0.03):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    setp(bsdf, ["Base Color"], (*color, 1))
    setp(bsdf, ["Roughness"], rough)
    setp(bsdf, ["Metallic"], metallic)
    setp(bsdf, ["Coat Weight", "Coat", "Clearcoat"], coat)
    setp(bsdf, ["Coat Roughness", "Clearcoat Roughness"], coat_rough)
    setp(bsdf, ["Specular IOR Level", "Specular"], 0.6)
    return mat


M_HONEY = material("honey", (0.002, 0.002, 0.002), 0.03, 0.0, 1.0, 0.02)
M_BARB = material("barb", (0.006, 0.006, 0.007), 0.27, 0.3, 0.7, 0.12)
M_SHAFT = material("shaft", (0.01, 0.01, 0.01), 0.12, 0.1, 1.0, 0.05)


def link(obj):
    scene.collection.objects.link(obj)
    return obj


# ---------------------------------------------------------------- lights
def area(name, size, energy, loc, color=(1, 1, 1), size_y=None):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "RECTANGLE" if size_y else "SQUARE"
    data.size = size
    if size_y:
        data.size_y = size_y
    obj = link(bpy.data.objects.new(name, data))
    obj.location = loc
    direction = Vector((0, 0, 0)) - Vector(loc)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


area("top", 6, 900, (0.5, -3, 8), size_y=3)
area("left", 1.0, 1900, (-7, -4, 1), size_y=10)
area("right", 0.6, 700, (7, -2, -1), color=(0.66, 0.85, 0.96), size_y=8)
area("front", 5, 35, (2, -10, 2), size_y=4)
area("under", 5, 220, (-2, -4, -7), color=(0.66, 0.85, 0.96), size_y=1.4)
area("back", 3, 500, (3, 6, 3), size_y=6)

# ---------------------------------------------------------------- feather
TILT = 0.62
SCALE = 1.36
ORIGIN = (-0.3, 0.22)
HALF = 2.0
VANE_START = 0.2
rng = random.Random(7)


def bow(s):
    return 0.3 * s * s


def spine(s):
    return Vector((bow(s), -HALF + s * HALF * 2, 0.0))


def to_world(p):
    """Feather-local (x, y up, z towards camera) -> Blender world (X, Y depth, Z up)."""
    x, y, z = p.x * SCALE, p.y * SCALE, p.z * SCALE
    wx = ORIGIN[0] + x * math.cos(TILT) + y * math.sin(TILT)
    wy = ORIGIN[1] - x * math.sin(TILT) + y * math.cos(TILT)
    return Vector((wx, -z, wy))


curve = bpy.data.curves.new("feather", "CURVE")
curve.dimensions = "3D"
curve.bevel_depth = 1.0
curve.bevel_resolution = 2
curve.resolution_u = 1


def strand(points, radii):
    sp = curve.splines.new("POLY")
    sp.points.add(len(points) - 1)
    for pt, p, r in zip(sp.points, points, radii):
        w = to_world(p)
        pt.co = (w.x, w.y, w.z, 1)
        pt.radius = r * SCALE


def barb(s, side, length, sweep, hook, cup, lift, thick, seg=14):
    c = spine(s)
    pts, rad = [], []
    for k in range(seg + 1):
        u = k / seg
        ang = sweep + hook * u * u
        reach = length * u
        pts.append(Vector((
            c.x + side * math.cos(ang) * reach,
            c.y + math.sin(ang) * reach + hook * 0.12 * length * u * u,
            lift * u - cup * reach * reach,
        )))
        rad.append(thick * (1 - 0.78 * u))
    strand(pts, rad)


BARBS = 900
for side in (1, -1):
    reach = 0.92 if side == 1 else 0.64
    clump, left = 0.0, 0
    for i in range(BARBS):
        v = (i + rng.random() * 0.6) / BARBS
        if left <= 0:
            left = 8 + int(rng.random() * 60)
            clump = (rng.random() - 0.5) * 0.15
        left -= 1
        s = VANE_START + v * (1 - VANE_START) * 0.995
        profile = math.sin(math.pi * v ** 0.52) ** 0.6
        length = reach * profile * (0.94 + rng.random() * 0.08) + 0.03
        barb(s, side, length, 0.36 + v * 0.62 + clump + (rng.random() - 0.5) * 0.015,
             0.34 + rng.random() * 0.08, 0.34 + clump * 0.6,
             (rng.random() - 0.5) * 0.02 + clump * 0.1, 0.0038)
for i in range(110):
    side = 1 if i % 2 else -1
    barb(VANE_START - 0.04 + rng.random() * 0.08, side, 0.14 + rng.random() * 0.32,
         -0.5 + rng.random() * 1.2, (rng.random() - 0.3) * 1.6, (rng.random() - 0.5) * 1.2,
         (rng.random() - 0.5) * 0.3, 0.0018)
feather = link(bpy.data.objects.new("feather", curve))
feather.data.materials.append(M_BARB)

shaft_curve = bpy.data.curves.new("shaft", "CURVE")
shaft_curve.dimensions = "3D"
shaft_curve.bevel_depth = 1.0
shaft_curve.bevel_resolution = 6
shaft_curve.resolution_u = 2
sp = shaft_curve.splines.new("POLY")
N = 80
sp.points.add(N)
for i, pt in enumerate(sp.points):
    s = i / N
    w = to_world(spine(s))
    pt.co = (w.x, w.y, w.z, 1)
    pt.radius = min(0.006 + s * 1.5, 0.056 * (1 - s) ** 0.85 + 0.006) * SCALE
shaft = link(bpy.data.objects.new("shaft", shaft_curve))
shaft.data.materials.append(M_SHAFT)


def on_quill(s):
    w = to_world(spine(s))
    return w.x, w.z


# ---------------------------------------------------------------- honey
mball = bpy.data.metaballs.new("honey")
mball.resolution = 0.03
mball.render_resolution = 0.011
mball.threshold = 0.6
honey = link(bpy.data.objects.new("honey", mball))
honey.data.materials.append(M_HONEY)


def smooth(v):
    return v * v * (3 - 2 * v)


TOP = 3.4
cap = on_quill(0.9)
tip = on_quill(0.004)
neck = on_quill(0.8)
sag_at = on_quill(0.2)
RUNS = [(0.9, 144, 0.0, 0.12), (-0.6, 72, 0.37, 0.1), (0.3, 144, 0.55, 0.11)]


def balls(frame):
    """(x, z_up, depth, radius) for every blob at this frame; all cycles divide LOOP."""
    ph = (frame % LOOP) / LOOP
    tau = 2 * math.pi
    out = []
    y, i = TOP, 0
    while y > cap[1] + 0.1:
        sway = math.sin(tau * 3 * ph + y * 1.7) * 0.014 * (TOP - y)
        out.append((cap[0] + sway, y, 0, 0.112 + 0.012 * math.sin(i * 0.6 - tau * 12 * ph)))
        y -= 0.045
        i += 1
    breathe = math.sin(tau * 2 * ph)
    out += [
        (cap[0], cap[1], 0.02, 0.36 + breathe * 0.02),
        (cap[0] - 0.2 + math.sin(tau * ph) * 0.04, cap[1] - 0.2, 0.06, 0.27),
        (cap[0] + 0.12, cap[1] + 0.18, 0, 0.25 - breathe * 0.015),
        (cap[0] + 0.14, cap[1] - 0.34 + math.sin(tau * ph) * 0.03, 0.08, 0.22),
        (neck[0], neck[1] - 0.05, 0.05, 0.2 + math.sin(tau * 2 * ph) * 0.015),
    ]
    for side, period, offset, size in RUNS:
        p = (frame / period + offset) % 1
        fade = math.sin(math.pi * p) ** 0.55
        for k in range(9):
            s = 0.7 - smooth(max(0, p - k * 0.014)) * 0.62
            x, z = on_quill(s)
            out.append((x, z - 0.03, side * 0.03, size * fade * (1 - k * 0.09) * (1 - p * 0.45)))
    sag = (frame / 144 + 0.4) % 1
    base = sag_at[1] - 0.05
    if sag < 0.7:
        st = smooth(sag / 0.7)
        for k in range(4):
            out.append((sag_at[0], base - st * 0.5 * (k / 3), 0.02, 0.065 + (0.07 * st if k == 3 else 0)))
    else:
        fall = (sag - 0.7) / 0.3
        out.append((sag_at[0], base - 0.5 - fall * fall * 2.6, 0.02, 0.135))
        out.append((sag_at[0], base - 0.1 * (1 - fall), 0.02, 0.075 * (1 - fall)))
    out.append((tip[0], tip[1] + 0.03, 0, 0.075))
    q = (frame / 72) % 1
    if q < 0.56:
        g = smooth(q / 0.56)
        out.append((tip[0], tip[1] - 0.03 - g * 0.09, 0, 0.15 * g))
    else:
        fall = (q - 0.56) / 0.44
        out.append((tip[0], tip[1] - 0.12 - fall * fall * 2.2, 0, 0.15 * (1 - fall * 0.2)))
        out.append((tip[0], tip[1] - 0.03 - fall * 0.05, 0, 0.07 * (1 - fall)))
    return [b for b in out if b[3] > 0.01]


def build(frame):
    mball.elements.clear()
    for x, z, depth, r in balls(frame):
        el = mball.elements.new()
        el.co = (x, -depth, z)
        el.radius = r * 2.0
        el.stiffness = 2.0


# ---------------------------------------------------------------- camera
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 92
cam_data.dof.use_dof = True
cam_data.dof.focus_distance = 16
cam_data.dof.aperture_fstop = 5.6
cam = link(bpy.data.objects.new("cam", cam_data))
cam.location = (0, -16, 0.2)
cam.rotation_euler = (math.pi / 2, 0, 0)
scene.camera = cam

from mathutils import Matrix

AXIS_A = to_world(spine(0.0))
AXIS_B = to_world(spine(1.0))
AXIS = (AXIS_B - AXIS_A).normalized()

for frame in range(F0, F1 + 1):
    angle = 0.42 * math.sin(2 * math.pi * (frame % LOOP) / LOOP)
    roll = Matrix.Translation(AXIS_A) @ Matrix.Rotation(angle, 4, AXIS) @ Matrix.Translation(-AXIS_A)
    feather.matrix_world = roll
    shaft.matrix_world = roll
    build(frame)
    scene.frame_set(frame)
    scene.render.filepath = f"{OUT}/f{frame:04d}.png"
    bpy.ops.render.render(write_still=True)
    print("rendered", frame, flush=True)
