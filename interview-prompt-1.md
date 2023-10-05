# Prompt

Add the following functionality to the starter scene included in this project:

- Clicking and dragging on the viewport should display a rectangular marquee defined by the x and y coordinates of the starting point of the drag and the current pointer position.
  - The marquee should render in front of any 3D objects in the scene regardless of how close to the camera they are.
- The rectangular marquee should select any meshes within its bounds.
  - As the user drags the pointer, any mesh whose projection lies **entirely** within the rectangle should become selected, and highlighted with a brighter version of its original color.
  - Any selected mesh which is no longer entirely within the rectangle should become unselected and its color should return to its original value.
- When the user releases the pointer, the rectangular marquee should disappear.
  - Any meshes that are currently selected will remain selected and highlighted until the user presses the pointer again.
- While the user presses and holds the left, right, up, or down arrow keys, each of the selected objects should revolve around the point in 3D space defined by the average of the positions of the objects.
  - If only one object is selected, this should result in the object rotating in place.
  - If more than one is selected, the result should be that the positions and orientations of the selected objects change in world space but remain fixed relative to each other.
  - The axis of revolution for the left and right arrow keys should be parallel to the y axis of the camera plane, and the axis for the up and down keys should be parallel to the x axis of the camera plane.

Your solution should be clearly written but does not need to be strictly documented.  You are encouraged to add inline comments explaining the purpose of any sections of code whose purpose might not be immediately apparent.

You are permitted, but not required, to integrate additional open-source third-party code into your solution to this prompt.  Any such code should be clearly labeled as such, with links to the where the code was found.

For setting up the project and submitting your solution, see the [README](./README.md).

# API Reference
Documentation for the three.js library can be found at https://threejs.org/docs/index.html.


-----My solution-----------------------------------------------------------------
The implementation just has a selection mechanism that adds an outline object 
around the current object and then removes it when deselected. For now, click
selects the object. 

I drew an excalidraw to outline the the process:-
https://excalidraw.com/#json=z61wSy9zmAIRKHvTqTDBn,hBp6ba4anntXuVt4P507Lg

There's a space there for feedback. I would really appreciate it if you took a few mins to write down your evaluation and comments on my thoughts. This helps me become a more all-rounded developer.

Thank you for the opportunity. This was a fun assignment.