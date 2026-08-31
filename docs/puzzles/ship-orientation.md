# Puzzle: Ship Orientation

**Goal:** Put the ship in the right orientation.  
**Game Designer:** User  
**Status:** In Progress  

---

## 1. Description & Problem Statement
- **Objective:** Put the ship in the right orientation.
- **Problem:** The ship's maneuvering thrusters are disabled and need to be calibrated before they can put the ship in the right orientation.
- **Thruster Specifications:** The ship has 12 thrusters.

---

## 2. Key Rooms, Entities & Items
- **Rooms:**
  - **Mechanical Room:** Where the Mechanical Agent is located.
  - **Engineering Room:** Where the 12 thrusters are calibrated to the right values.
- **Entities / NPCs:**
  - **Mechanical Agent:** Provides the player with instructions on how to calibrate the ship.
- **Systems / Objects:**
  - 12 maneuvering thrusters (calibrated in Engineering Room).

---

## 3. Solution Path & Steps
1. Re-activate the disabled maneuvering thrusters.
2. Talk to the Mechanical Agent in the Mechanical Room to get calibration instructions.
3. Go to the Engineering Room.
4. Calibrate the 12 thrusters to their correct values based on the instructions.
5. Put the ship in the right orientation.

---

## 4. WebMCP Interactions & Tools
- `walk_to`: Navigate between Mechanical Room, Engineering Room, etc.
- `talk_to`: Talk to Mechanical Agent to receive calibration instructions.
- `use` / `push` / `pull`: Interface with calibration controls in the Engineering Room for each of the 12 thrusters.

---

## 5. Completion State
- **Success State:** All 12 thrusters calibrated to the correct values; maneuvering thrusters put the ship in the right orientation.
- **Unlocks:** Sub-Goal 2 (Ship Orientation) completed towards the final goal.
