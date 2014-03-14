window.debugMode = false;
function Rainer(){

	var numDrops = 15;
	var spawnRate = 0.03;
	this.drops = [];
	this.background = new Image();
	this.bgWidth = -1;
	this.bgHeight = -1;
	this.sourceCanvas = document.createElement("canvas");

	this.shape = "circle";
	
	var backgroundCanvas = document.createElement("canvas");
	var backgroundCtx = backgroundCanvas.getContext("2d");
	
	var that = this;
	
	this.resize = function(){

		if(this.background.width / canvas.width < this.background.height / canvas.height){
			this.bgWidth = canvas.width; //this.bgWidth = background.width / (this.background.width / canvas.width);
			this.bgHeight = this.background.height / (this.background.width / canvas.width);
		}
		else{
			this.bgWidth = this.background.width / (this.background.height / canvas.height);
			this.bgHeight = canvas.height;
		}

		context.drawImage(this.background, 0, 0, this.bgWidth, this.bgHeight);

		this.sourceCanvas.width = this.bgWidth;
		this.sourceCanvas.height = this.bgHeight;
		this.sourceCanvas.getContext("2d").drawImage(this.background, 0, 0, this.bgWidth, this.bgHeight);

		backgroundCanvas.width = canvas.width/5 + 1;
		backgroundCanvas.height = canvas.height/5 + 1;
		backgroundCtx.drawImage(canvas,0,0,backgroundCanvas.width, backgroundCanvas.height);
		
		RainDrop.prototype.bgCtx = backgroundCtx;

		for(var i=0; i< that.drops.length; i++){
			that.drops[i].pos = new Vector(Math.random() * canvas.width, Math.random() * canvas.height);
		}
	}

	this.start = function(){
		for(var i=0; i< numDrops; i++){
			this.drops.push(new RainDrop());
		}

		this.resize();
		
		RainDrop.prototype.bgCtx = backgroundCtx;
		run(this);
	}
	
	function run(that){
		that.update();
		that.draw();

		setTimeout(function(){run(that);}, 1000/60);
	}
	
	this.update = function(){
		for(var i=0; i< this.drops.length; i++){
			var drop = this.drops[i];

			var posX = Math.max(drop.pos.x - drop.size - 2, 0);
			var posY = Math.max(drop.pos.y - drop.size - 2, 0);
			var size = drop.size*2 + 4;

			context.drawImage(this.sourceCanvas, posX, posY, size, size, posX, posY, size, size);

			if(this.drops[i].deleteMe == true){
				this.drops.splice(i, 1);
				i--;
				continue;
			}

			this.drops[i].update();
		}

		if(Math.random() < spawnRate){
			this.drops.push(new RainDrop());
		}
	}
	
	this.draw = function(){

		if(debugMode) context.drawImage(backgroundCanvas,0,0);

		for(var i=0; i< this.drops.length; i++){
			this.drops[i].draw();
		}
	}
}

function RainDrop(){
	this.spawn();
	this.pos = new Vector(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
	this.deleteMe = false;
}

RainDrop.prototype.size = 10;
RainDrop.prototype.speed = new Vector(Math.random() * 2 + 1,Math.random() * 2 + 2);

RainDrop.prototype.spawn = function(){
	this.size = Math.floor(Math.random() * 5 + 10);
	
	this.speed = new Vector(Math.random() * 2 + 1,Math.random() * 2 + 2);
	this.speed = this.speed.divide(15 - this.size + 2);
	this.speed = this.speed.divide(15 - this.size + 2);
	
	var drift = Math.abs(this.speed.x / this.speed.y) * this.canvas.height;
	//this.pos = new Vector();
	//this.pos.x = (Math.random() * (this.canvas.width + drift)) - ((drift > 0) ? (drift) : (0));
	//this.pos.y = 0;
	this.pos = new Vector(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
}

RainDrop.prototype.update = function(){
	var rand = (noise.noise(this.pos.x, this.pos.y, 0) + 1) * 10;
	this.fullSpeed = rand < 5 ? 0 : rand;

	if(this.fullSpeed == 0){
		this.fullSpeed = (Math.random() * 100 < 5) ? Math.random() * 2 : 0;
	}

	//console.log(noise.noise(this.pos.x, this.pos.y, 0) + 1);

	this.pos = this.pos.add(this.speed.multiply(this.fullSpeed));
	
	if(this.pos.y >= this.canvas.height || this.pos.x > this.canvas.width){
		//this.spawn();
		this.deleteMe = true;
	}
}

RainDrop.prototype.draw = function(){
	//this.context.fillStyle = "#999";
	//this.backgroundCanvas.getContext('2d').getImageData(100, 100, 1, 1).data
	this.context.fillStyle = this.getImageColor(this.pos.x, this.pos.y); //"rgba(255,255,255,255)";//
	
	if(rainer.shape == "square"){
		// Square
		this.context.fillRect(this.pos.x - this.size,this.pos.y - this.size, this.size*2, this.size*2);
	}
	else if(rainer.shape == "circle"){
		// Circle
		this.context.beginPath();
		this.context.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, false);
		this.context.fill();
		this.context.closePath();
	}
}

RainDrop.prototype.bgCtx = null;

RainDrop.prototype.getImageColor = function(x, y, amount){
	amount = (amount == undefined) ? 25 : amount;

	var data = this.bgCtx.getImageData(Math.floor(x/5), Math.floor(y/5), 1, 1).data;

	if(debugMode){
		console.log(debugMode);
		this.context.fillStyle = "#F00";
		this.context.fillRect(Math.floor(x/5),Math.floor(y/5), 1,1);
	}

	return "rgba(" + this.lighten(data[0], amount) + "," + this.lighten(data[1], amount) + "," + this.lighten(data[2], amount) + "," + 0.8 + ")"; 
}

RainDrop.prototype.lighten = function(val, amount){
	return Math.min(255, Math.floor(val+amount));
}

function Vector(x, y){
	this.x = (typeof x != "undefined") ? x : 0;
	this.y = (typeof y != "undefined") ? y : 0;
}

Vector.prototype.add = function(vec){
	return new Vector((this.x + vec.x), (this.y + vec.y)); //{x: (this.x + vec.x), y: (this.y + vec.y)};
}

Vector.prototype.multiply = function(scale){
	return new Vector((this.x * scale), (this.y * scale));
}

Vector.prototype.divide = function(scale){
	return new Vector((this.x / scale), (this.y / scale));
}