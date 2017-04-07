var Snake = function(color){
	this.body = [];
	this.body.push({x : 10, y : 10});
	this.color = color;
	this.dir = Dir.right;
	this.width = 20;
	this.height = 20;

	this.move = function(collision){
		let newHeadPos = {
			x : this.body[0].x,
			y : this.body[0].y
		}

		switch (this.dir) {
			case Dir.left: newHeadPos.x -= snakeSpeed;
				break;

			case Dir.right: newHeadPos.x += snakeSpeed;
				break;

			case Dir.up: newHeadPos.y -= snakeSpeed;
				break;

			case Dir.down: newHeadPos.y += snakeSpeed;
				break;
		}

		for (let j = this.body.length-1; j > 0; j--) {
      this.body[j].x = this.body[j-1].x;
      this.body[j].y = this.body[j-1].y;
    }

    this.body[0].x = newHeadPos.x;
    this.body[0].y = newHeadPos.y;

		return true;
	}


	this.eat = function(){
		let rect = this.body[0];
		this.body.push({x:rect.x,y:rect.y})
	}


	this.canEat = function(){

		let Head = {
			top 	: this.body[0].y,
			left  : this.body[0].x,
			right : this.body[0].x + this.width,
			bottom: this.body[0].y + this.height,
		}

		let Food = {
			top 	: food.y,
			left  : food.x,
			right : food.x + food.width,
			bottom: food.y + food.height
		}

		// collision detection
		if(Head.right < Food.left || Head.left > Food.right ||
			Head.top > Food.bottom || Head.bottom < Food.top) {
				return false;
			}

			return true;
	}
}

let Dir = {
  left : 37,
  right : 39,
  up : 38,
  down : 40
}
