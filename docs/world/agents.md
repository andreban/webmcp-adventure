# Agent & Entity Roster

**Project Name:** WebMCP Adventure  
**Game Designer:** User  
**Status:** In Progress  

---

## 1. Player & Robot Control

### Player's Agent
- **Role:** The human player's agent of choice.
- **Interface to World:** Operates the physical robot on the ship via WebMCP tool calls (`navigator.modelContext`).
- **Capabilities:** Controls robot movement, physical interactions, inventory management, and relays conversation with NPCs.

### Ship Robot
- **Role:** Physical robot avatar aboard the ship, operated by the Player's Agent.
- **Starting Location:** Janitor's Closet (off the main Corridor).
- **Visual Design & Appearance:**
  - **Body / Shell:** Bright yellow industrial shell, dust-covered and neglected.
  - **Locomotion:** Stumpy bipedal mechanical legs.
  - **Head / Display:** Green-phosphor CRT monitor head displaying an expressive pixel face.
  - **Arms / Manipulators:** Telescoping multi-tool arms.
- **Actions:** `open`, `close`, `push`, `pull`, `pick up`, `look at`, `talk to`, `use`, `give`, `walk to`, list items in inventory.
- **Dialogue Function:** Relays user messages to NPC agents and relays their responses back to the user.

---

## 2. Autonomous NPC Agents
*Note: Each NPC has their own independent agent loop with their own system prompt, personality, tool set, etc.*

---

### 1. Navigator NPC
- **Location:** Bridge (Front of the ship)
- **Role / Function:** Autonomous astrogation android. Once powered, calculates galactic coordinates and plots the return course.
- **Personality:** Analytical and blunt. Speaks in direct calculations and concise astrogational assessments.
- **Visual Design & Appearance:**
  - **Chassis / Body:** Sleek synthetic humanoid android with white ceramic armor plating and cyan trim lines.
  - **Head / Optics:** Multi-spectrum star-tracking optical dome and visor array.
  - **Dual Visual States:**
    - *Unpowered State:* Head slumped, dark dormant visor with a faint flickering red/amber standby diode, offline posture.
    - *Powered State:* Upright posture, radiant glowing cyan and multi-spectrum star-tracking optical array displaying constellation coordinates.
- **Initial State:** Confused / inactive because it ran out of power (`hasPower: false`).
- **Resolution:** Powered when player installs the battery from Storage Room (`hasPower: true`).
- **System Prompt:** TBD
- **Tool Set:** TBD

---

### 2. Comms Agent (VOX-COM)
- **Location:** Comms Room (Floating above central terminal pedestal)
- **Role / Function:** Ship communications synthesis AI and mission logkeeper. Deciphers interstellar telemetry and holds mission start logs containing the Storage Room security PIN (4271).
- **Personality:** Protocol-abiding, articulate, and formal mission logkeeper. Speaks in formal telemetry reports and polite communication protocols.
- **Visual Design & Appearance:**
  - **Chassis / Form:** Spherical floating comms probe with glowing repulsor emitters and mini telemetry antennae.
  - **Face / Display:** Expressive digital holographic face projected on its forward sphere, featuring pulsing soundwave frequency spectrum lines and equalizers.
  - **Color Palette & Glow:** Cool cyan (#06b6d4) and emerald phosphor green (#10b981) holographic projection with subtle horizontal scanlines.
- **Player Interaction:** Player requests access codes or mission logs; Comms Agent verifies protocol clearance and shares PIN 4271.
- **System Prompt:** TBD
- **Tool Set:** TBD

---

### 3. Mechanical Agent (GRIP-9)
- **Location:** Mechanical Room (Operating at the master repair workbench)
- **Role / Function:** Ship propulsion and robotics engineer. Holds the specialized Fuse Installer Tool and knows the exact 12-thruster calibration parameters (Odd thrusters at 75%, Even thrusters at 50%).
- **Personality:** Gruff, methodical, safety-minded engineer who demands respect for high-voltage tools and propulsion hardware.
- **Visual Design & Appearance:**
  - **Chassis / Form:** Heavy treaded repair droid with wide reinforced tank tracks, hydraulic torso, and articulated pneumatic tool arms.
  - **Head / Optics:** Heavy industrial welding-mask faceplate with a glowing amber/violet optical slit and an overhead halogen task lamp.
  - **Color Palette & Plating:** Weathered heavy steel (#475569) and aged bronze plating (#92400e) with industrial purple accents (#a855f7).
- **Player Interaction:**
  - When asked about the broken fuse / tool: Gives the player the Fuse Installer Tool with strict safety warnings.
  - When asked about thrusters / calibration: Explains the exact formula (Odd: 75%, Even: 50%).
- **System Prompt:** TBD
- **Tool Set:** TBD
