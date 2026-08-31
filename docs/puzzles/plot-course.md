# Puzzle: Plot a Course

**Goal:** Plot the correct course to return the ship to its proper trajectory.  
**Location / Sector:** Bridge (Front of the ship)  
**Key Entity:** Navigator NPC (autonomous agent)  
**Status:** In Progress  

---

## 1. Description & Problem Statement
- **Objective:** Get the Navigator NPC to plot the course.
- **Problem:** The Navigator NPC is confused because it ran out of power.
- **Player Task:** Pick up a battery from the Storage Room and install it on the Navigator.

---

## 2. Key Rooms, Entities & Items
- **Rooms:**
  - **Storage Room:** Contains the battery (unlocked with PIN from Comms Agent).
  - **Bridge:** Where the unpowered Navigator NPC is located.
- **Entities / NPCs:**
  - **Navigator NPC:** Located on the Bridge; out of power and confused until battery is installed.
- **Items:**
  - Battery (in Storage Room)

---

## 3. Solution Path & Steps
1. Unlock the Storage Room door using the PIN from the Comms Agent.
2. Pick up the battery from the Storage Room.
3. Go to the Bridge.
4. Install the battery on the Navigator.
5. Navigator recovers power and plots the course.

---

## 4. WebMCP Interactions & Tools
- `walk_to`: Navigate between Corridor, Storage Room, and Bridge.
- `pick_up`: Pick up battery from Storage Room.
- `use`: Install battery on the Navigator (`use({ item: "battery", target: "navigator" })`).
- `talk_to`: Interact with Navigator NPC once powered.

---

## 5. Completion State
- **Success State:** Navigator on the Bridge has battery installed, recovers power, and plots the course.
- **Unlocks:** Sub-Goal 1 (Plot a Course) completed towards the final goal.
