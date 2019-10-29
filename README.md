# bouncing-circles

App launched via index.html
Unit tests via CircleTestRunner.html



-----
Code Assumptions:


I've used a javascript canvas to do frame based renderings of the animation. CSS Transforms would have been slightly more direct; though I chose the canvas as it's more suited to unit testing.

The implemented solution makes a few assumptions:

- No air friction / no rolling friction. The energy losses occur only when the ball bounces / collides

- Circle collisions with frame walls are modelled as percentage kinetic energy loss and the exit angle is equal to the angle of incidence

- Circle movement assumes point masses however collisions are determined by their occupied area, not by a reduced radius around the center.

- Circle collisions with another circle are modelled as a percentage kinetic energy loss combined with the reversal of x and y velocity vector directions for both circles. Clearly this is a flawed assumption. However, I made this simplification to keep the focus of the exercise on the coding (implementing momentum conservation and kinetic energy conservation with simultaneous solution of equations seemed besides what was expected).

- I've added in a few unit tests. In terms of further tests, there's scope for increasing test coverage and type of tests - boundary conditions for example.
