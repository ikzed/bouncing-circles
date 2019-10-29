
describe("Circles Tests", function() {
  var circle;
  var circle2;

  beforeEach(function() {
    circle = new Ball(1, 40, 40, 20, '', 4, 5);
    circle2 = new Ball(1, 50, 50, 20, '', 4, 5);
  });

  describe("Given a circle ", function() {
    beforeEach(function() {
      overlappingCircle = new Ball(1, 50, 50, 20, '', 4, 5);
      nonOverlappingCircle = new Ball(1, 150, 150, 20, '', 4, 5);
    });

    it("It should alert when it's colliding with another", function() {
      expect(circle.isColliding(overlappingCircle)).toBe(true);
    });

    it("It should not alert when it's distant from another", function() {
      expect(circle.isColliding(nonOverlappingCircle)).toBe(false);
    });

  });

  describe("Given a mouse click location ", function() {
    beforeEach(function() {
      x = 150, y = 180;
      generateRandomCircles(x,y,1,8);
    });

    it("generateRandomCircles should generate at least 1 circle", function() {
      expect(ballArr.length).toBeGreaterThan(0);
    });

    it("All generated circles should be centred on the cliked location", function() {
      for (var i = 0; i < ballArr.length; i++){
        expect(ballArr[i].x).toEqual(150);
        expect(ballArr[i].y).toEqual(180);
      }
      
    });

  });
  
  describe("Given a circle that is colliding", function() {
    beforeEach(function() {
      circle = new Ball(1, 80, 80, 20, '', 4, 5);
      circle2 = new Ball(1, 120, 80, 20, '', -4, 5);
      detectInterCircleCollisions(circle, 0, [circle, circle2]);
    });

    it("When colliding with another circle it should bounce", function() {
      expect(circle.vx).toBeLessThan(0);
    });

    it("and it's speed should be damped", function() {
      expect(Math.abs(circle.vx)).toBeLessThan(4);
    });
  });

  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});
