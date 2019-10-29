function Ball(id, x, y, radius, color, vx, vy){
    this.id = id;
    this.x = x;             // x-coordinate of circle center
    this.y = y;             // y-coordinate of circle center
    this.radius = radius;
    this.color = color;
    this.vx = vx;           // circle speed x component (pixels per frame)
    this.vy = vy;           // circle speed y component (pixels per frame)
}


Ball.prototype.move = function() {
    this.x += this.vx;
    this.y += this.vy;

    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x,this.y,this.radius,0,Math.PI*2);
    context.closePath();
    context.fill();
}

// Collision detection:
Ball.prototype.isColliding = function(ball2){
    var ball1FutPosX = this.x + this.vx;
    var ball1FutPosY = this.y + this.vy;
    var ball2FutPosX = ball2.x + ball2.vx;
    var ball2FutPosY = ball2.y + ball2.vy;

    // If the linear distance between circle center positions in the next frame
    // is greater than the sum of their radii they are colliding
    if (Math.sqrt(Math.pow(ball1FutPosX - ball2FutPosX, 2) + Math.pow(ball1FutPosY - ball2FutPosY, 2))
            < this.radius + ball2.radius) {
        return true;
    }

    return false;
}