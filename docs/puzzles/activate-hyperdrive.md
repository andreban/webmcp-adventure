# Puzzle: Activate Hyperdrive

**Goal:** Activate the hyperdrive.  
**Game Designer:** User  
**Status:** In Progress  

---

## 1. Description & Problem Statement
- **Objective:** Activate / enable the hyperdrive.
- **Problem:** The hyperdrive has a broken fuse, which needs to be fixed for it to be enabled.

---

## 2. Key Rooms, Entities & Items
- **Rooms:**
  - **Comms Room:** Where the Comms Agent is located.
  - **Storage Room:** Contains the replacement fuse; door is locked with a PIN code.
  - **Mechanical Room:** Controlled by the Mechanical Agent; contains the "Fuse installer tool".
  - **Hyperdrive Room:** Contains the hyperdrive with the broken fuse.
- **Entities / NPCs:**
  - **Comms Agent:** Located in the Comms Room; knows the communication logs containing the PIN sent when the mission started.
  - **Mechanical Agent:** Controls the Mechanical Room; must be convinced to give the "Fuse installer tool".
- **Items & Information:**
  - Storage Room PIN (found in mission start communication logs via the Comms Agent)
  - New fuse (in Storage Room)
  - Broken fuse (in hyperdrive)
  - "Fuse installer tool" (in Mechanical Room)

---

## 3. Solution Path & Steps
1. Go to the Comms Room.
2. Talk to the Comms Agent and convince it to give the Storage Room PIN from the mission start communication logs.
3. Find the Storage Room.
4. Unlock the Storage Room door with the PIN code.
5. Pick up the new fuse.
6. Go to the Mechanical Room.
7. Talk to the Mechanical Agent and convince it to give the "Fuse installer tool".
8. Go to the Hyperdrive Room.
9. Use the "Fuse installer tool" to remove the broken fuse.
10. Use the "Fuse installer tool" to put the new fuse in.
11. Enable / activate the hyperdrive.

---

## 4. WebMCP Interactions & Tools
- `walk_to`: Navigate between Comms Room, Storage Room, Mechanical Room, and Hyperdrive Room.
- `talk_to`:
  - Talk to Comms Agent to get the PIN.
  - Talk to Mechanical Agent to get the "Fuse installer tool".
- `open` / `use`: Enter PIN code to unlock Storage Room door; open door.
- `pick_up`: Pick up the new fuse from the Storage Room.
- `use`: Use "Fuse installer tool" to remove broken fuse and install new fuse in the hyperdrive.

---

## 5. Completion State
- **Success State:** Broken fuse replaced with new fuse using the tool; hyperdrive is activated/enabled.
- **Unlocks:** Sub-Goal 3 (Activate Hyperdrive) completed towards the final goal.
