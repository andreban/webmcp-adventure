# Ship Rooms & Locations

**Project Name:** WebMCP Adventure  
**Game Designer:** User  
**Status:** In Progress  

---

## 1. Ship Floorplan & Layout

```
[ Front of Ship ]
       |
  +----+----+
  | Bridge  | (Navigator NPC)
  +----+----+
       |
  +----+-----------------------------------------------------+
  |                         Corridor                         |
  |  (Doors to: Janitor's Closet, Comms, Storage, Mechanical)|
  +----+-----------------------------------------------------+
       |
  +----+----+
  | Engineering Room | (12 Thrusters Calibration)
  +----+----+
       |
  +----+----+
  | Hyperdrive Room  | (Hyperdrive Unit)
  +----+----+
       |
[ Back of Ship ]
```

### Layout Description
- **Front of the Ship:** Bridge (Navigator NPC location).
- **Corridor:** Starts at the back of the Bridge and runs toward the rear. Doors along the corridor lead to:
  - **Janitor's Closet** (Robot starting room)
  - **Comms Room**
  - **Storage Room**
  - **Mechanical Room**
- **Rear End of Corridor:** Leads into the Engineering Room.
- **Behind Engineering Room:** Leads into the Hyperdrive Room.

---

## 2. Master Room Roster

### 1. Janitor's Closet *(Starting Location)*
- **Description:** Small maintenance closet where the player's robot boots up.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Dark utilitarian room illuminated by glowing standby indicator lights.
  - **Fixtures & Background:** Industrial metal shelves stocked with solvent jugs and spare gaskets; exposed wall conduits.
  - **Robot Starting Pad:** Floor-mounted recharge pad with thick power cables trailing to the wall.
  - **Exit Door:** Heavy sliding sci-fi bulkhead door with a manual release lever connecting to the Corridor.
- **Entities Present:** Ship Robot (at game start)
- **Key Objects / Items:** TBD
- **Exits / Connections:** Door connects to the Corridor

---

### 2. Bridge (Front of Ship)
- **Description:** Forward command bridge and astrogation center overlooking deep space.
- **Visual Design & Atmosphere:**
  - **Lighting / Viewport:** Panoramic wrap-around cockpit viewport looking out into deep space with tumbling, skewed starfields and distant planetary nebula.
  - **Astrogation & Helm:** Central circular glowing holographic astrogation table displaying 3D trajectory spheres, flanked by the center command chair.
  - **Navigator Station:** Navigation station console on the left side where the powered-down Navigator android sits/stands.
  - **Exit Door:** Heavy sliding sci-fi doorway on the far left wall leading back into the Main Corridor.
- **Entities Present:** Navigator NPC, Navigation Console
- **Key Objects / Systems:** Navigation console (course plotting interface)
- **Exits / Connections:** Far left doorway leads back to the Main Corridor

---

### 3. Corridor
- **Description:** Long central spine corridor connecting the front and rear of the ship.
- **Visual Design & Atmosphere:**
  - **Perspective:** Down-the-hallway single-point perspective looking through the ship's central spine.
  - **Lighting / Mood:** Pulsing yellow and amber caution lights casting warning hues, indicating ship disarray and off-course alert.
  - **Environment Features:** Reinforced observation window panels revealing starry deep space outside.
  - **Doors & Signage:** Labeled pneumatic bulkhead doors along the corridor walls (Janitor's Closet, Comms Room, Mechanical Room, and Storage Room with an illuminated digital PIN keypad; Bridge visible forward, Engineering aft).
- **Entities Present:** None (Storage Keypad interface fixture present)
- **Exits / Connections:**
  - Front: Leads to the Bridge
  - Back: Leads to the Engineering Room
  - Doors along corridor: Lead to Janitor's Closet, Comms Room, Storage Room, and Mechanical Room

---

### 4. Comms Room
- **Description:** Ship communications hub housing transceiver banks, frequency analyzers, and mission log archives.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Cool cyan ambient lighting with pulsing audio spectrum visualizers and signal frequency meters.
  - **Equipment & Fixtures:** Wall-to-wall radio frequency equipment racks, signal dishes, and encrypted audio transmission banks.
  - **Operator Station:** Central operator terminal console featuring an illuminated holographic interface pedestal for the Comms Agent.
  - **Exit Door:** Heavy sliding sci-fi bulkhead door on the left wall connecting back to the Main Corridor.
- **Entities Present:** Comms Agent (operator terminal), Mission Log Terminal
- **Key Objects / Systems:** Mission start communication logs (containing Storage Room PIN)
- **Exits / Connections:** Door connects to the Corridor

---

### 5. Storage Room
- **Description:** Secure ship supply bay containing vital spare parts, modular robotic containers, and backup power cells.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Dark industrial supply bay illuminated by overhead flickering fluorescent tubes.
  - **Lockers & Storage:** Modular robotic storage containers, magnetic parts lockers, and stacked component crates.
  - **Item Placement:**
    - Left Side: Heavy steel storage parts rack holding the heavy high-density power Battery.
    - Right Side: Open workbench holding a protective foam case containing the New Hyperdrive Fuse.
  - **Exit Door:** Reinforced security bulkhead door on the left wall leading back into the Main Corridor.
- **Lock / Security:** Door locked from corridor with PIN code (4271)
- **Entities Present:** None
- **Items:**
  - Power Battery (for Navigator)
  - New Replacement Fuse (for Hyperdrive)
- **Exits / Connections:** Left security door connects to the Corridor

---

### 6. Mechanical Room
- **Description:** Ship mechanics bay containing heavy repair machinery, pneumatic calibration equipment, and specialized thruster tools.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Deep industrial purple and violet ambient glow illuminated by warm halogen task lamps over the work areas.
  - **Machinery & Fixtures:** Heavy pneumatic calibration benches, wall-mounted tool pegboards with specialized wrenches and diagnostic meters.
  - **Mechanical Agent Station:** Heavy master repair workbench on the right side where the Mechanical Agent operates and keeps the Fuse Installer Tool.
  - **Exit Door:** Heavy sliding industrial bulkhead door on the left wall connecting back to the Main Corridor.
- **Entities Present:** Mechanical Agent (controls the room)
- **Items / Tools:** "Fuse installer tool" (held by Mechanical Agent)
- **Knowledge / Interactions:** Calibration instructions for the 12 maneuvering thrusters
- **Exits / Connections:** Door connects to the Corridor

---

### 7. Engineering Room
- **Description:** Propulsion engineering bay housing the 12 maneuvering thrusters calibration panel, coolant pipelines, and engine routing systems.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Dark atmospheric industrial bay illuminated by the amber and cyan glows of thruster status readouts and exhaust ducts.
  - **Key System / Fixture:** Massive wall-mounted console array featuring 12 vertical LED thruster sliders (labeled T1 through T12) and wireframe ship orientation vector screens.
  - **Surrounding Details:** Heavy overhead coolant pipelines, cable gantries, and glowing engine exhaust conduits.
  - **Exits:**
    - Left Wall: Forward pneumatic bulkhead door leading to the Main Corridor.
    - Right Wall: Heavy reinforced blast hatch leading to the Hyperdrive Chamber.
- **Entities Present:** None (Thruster Console interface present)
- **Key Objects / Systems:** 12 maneuvering thrusters calibration interface/controls
- **Exits / Connections:**
  - Forward (Left door): Leads to the Corridor
  - Aft (Right door): Leads to the Hyperdrive Room

---

### 8. Hyperdrive Room (Rear of Ship)
- **Description:** Heavy reactor vault housing the ship's primary interstellar hyperdrive unit.
- **Visual Design & Atmosphere:**
  - **Lighting / Mood:** Unstable electric-cyan core glow with crackling energy arcs and amber radiation hazard strobe lamps.
  - **Key System / Fixture:** Massive vertical warp-core pillar with a glowing containment chamber and an open maintenance panel/fuse socket (holding the smoking blown fuse).
  - **Chamber Details:** Heavy coolant pipelines, power capacitors, and high-voltage radiation warning signage.
  - **Exit Door:** Reinforced blast hatch on the left wall connecting forward to the Engineering Room.
- **Entities Present:** Hyperdrive Core Unit (with blown fuse)
- **Key Objects / Systems:** Hyperdrive unit (contains broken fuse socket)
- **Items:** Broken fuse (removable via Fuse Installer Tool)
- **Exits / Connections:** Left blast hatch leads to the Engineering Room
