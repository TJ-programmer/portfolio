# Batman 3D model

Drop a single GLB file named **`batman.glb`** in this folder:

```
public/models/batman.glb
```

The portfolio auto-detects it: the model becomes the scroll-driven 3D
centerpiece (its view sweeps around as you scroll, with idle float), and the
photo sequence is used only as a fallback if the file is missing.

## Format you should provide

| Format  | Use?  | Why |
|---------|-------|-----|
| **GLB** | ✅ best | Single binary file. Mesh + materials + textures all baked in. |
| GLTF (`.gltf` + `.bin` + textures) | ⚠️ works | Loads, but requires the extra files side by side; GLB is simpler. |
| FBX / OBJ / STL / DAE / MAX / BLEND | ❌ not directly | Convert first (below). |

### How to convert anything else → GLB
- **Blender**: File → Import → your format → File → Export → **glTF 2.0**
  → check `Binary (.glb)`.
- **Online**: drag the file into [any-converter.com](https://www.any-converter.com) → GLB.

### Where to find a good Batman model
- **Sketchfab** (search "Batman") — filter by *Downloadable → glTF/GLB* and
  prefer CC-licensed models (credit the author). Download → check `glTF
  (.glb)`.
- **poly.pizza** — free CC0/CC-BY GLB models.
- **Kayza Models / Quaternius** — free game-ready GLB packs.

### Good-to-know tips
- Keep it **under ~25 MB** and prefer a low-ish polycount for smooth scrolling.
- A standing pose (A-pose/T-pose/neutral) is ideal. If the model lies flat or
  is sideways, tell me and I'll add a rotate/scale config in
  `src/components/three/NeuralScene.tsx`.
- If it ships with animations (e.g. an `idle` clip), mention it — I can layer
  the animation on top of the scroll sweep.
- Assets here are used under the terms of their original licenses; don't ship
  a model you don't have rights to.
