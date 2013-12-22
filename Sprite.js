Rect = function(x1, y1, x2, y2) {
	this.left = x1;
	this.top = y1;
	this.right = x2;
	this.bottom = y2;
};

Rect.prototype.set = function(x1, y1, x2, y2) {
	this.left = x1;
	this.top = y1;
	this.right = x2;
	this.bottom = y2;
}

Rect.prototype.boundingRect = function(rect) {
	// We compute right and bottom before we change left and top below.
	if (this.left == 0 && this.top == 0 && this.right == 0 && this.bottom == 0) {
		this.set(rect.left, rect.top, rect.right, rect.bottom);
	} else {
		this.right = Math.max(this.right, rect.right);
		this.bottom = Math.max(this.bottom, rect.bottom);

		this.left = Math.min(this.left, rect.left);
		this.top = Math.min(this.top, rect.top);
	}
};

function intersect(a, b) {
	return (a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom)
}

function Animation(manager, obj, prop, fromvalue, tovalue, time, duration,
		atype) {
	this.obj = obj;
	this.prop = prop;
	if (fromvalue == prop) {
		this.fromvalue = obj[prop];
	} else {
		this.fromvalue = fromvalue;
	}

	this.tovalue = tovalue;
	// this.milli = milli;
	this.type = "Linear";
	if (arguments.length > 7 && atype == "Box")
		this.type = "Box";
	this.manager = manager;
	this.start = time + new Date().getTime();
	this.end = this.start + duration;
	this.duration = duration;
	manager.animations.push(this);
	return this;
}

function AnimationManager() {
	this.animations = new Array();
	return this;
}

AnimationManager.prototype.AddAnimation = function(obj, prop, fromvalue,
		tovalue, time, milli, atype) {
	new Animation(this, obj, prop, fromvalue, tovalue, time, milli, atype);
}

AnimationManager.prototype.AnimateObjects = function() {
	i = 0;
	var timestamp = new Date().getTime();
	while (i < this.animations.length) {
		var progress = (this.animations[i].duration - (this.animations[i].end - timestamp))
				/ this.animations[i].duration;
		if (progress > 1.0)
			progress = 1.0;
		if (progress == 1.0) {
			this.animations[i].obj[this.animations[i].prop] = this.animations[i].tovalue;
		} else if ((progress >= 0.0) && (this.animations[i].type == "Linear")) {
			if (typeof (this.animations[i].obj[this.animations[i].prop]) == "number") {
				var newvalue = this.animations[i].fromvalue
						+ (this.animations[i].tovalue - this.animations[i].fromvalue)
						* progress;
				this.animations[i].obj[this.animations[i].prop] = newvalue;
			}
		}
		if (progress == 1.0) {
			this.animations.splice(i, 1);
		} else
			i++;

	}
}

function nothing() {
}

function Sprite(container, img, arr, xs, ys, ws, hs, xd, yd, wd, hd, tag,
		visible) {
	this.cont = container;
	this.img = img;

	this.xs = xs;
	this.ys = ys;
	if (ws == 0) {
		this.w = img.width;
		this.h = img.height;
	} else {
		this.w = ws;
		this.h = hs;
	}

	if (wd == 0) {
		this.width = this.w;
		this.height = this.h;
	} else {
		this.width = wd;
		this.height = hd;
	}

	this.x = xd;
	this.y = yd;
	this.oldx = 0;
	this.oldy = 0;
	this.x1 = 0;
	this.x2 = 0;
	this.y1 = 0;
	this.y2 = 0;

	this.data = tag;
	this.opacity = 1.0;
	this.scale = 1.0;
	this.visible = visible;

	this.shadowxs = 0;
	this.shadowys = 0;
	this.shadowws = 0;
	this.shadowhs = 0;
	this.shadowwd = 0;
	this.shadowhd = 0;
	this.shadowopacity = 1;
	this.shadow = 0;
	this.shadowOffsetX = 3;
	this.shadowOffsetY = 3;
	// this.shadowBlur = 3;

	// this.shadowColor = "rgba(0, 0, 0, 0.5)";
	// this.parent=parent;
	// this.parent.objects.push(this);

	arr.push(this);

	this.onMouseMove = nothing;
	this.onMouseDown = nothing;
	this.onMouseUp = nothing;
	this.onMouseEnter = nothing;
	this.onMouseLeave = nothing;
	this.onClick = nothing;
	this.onTouchStart = nothing;
	this.onTouchEnd = nothing;

	return this;
};
/*
Sprite.prototype.__defineGetter__("x", function() {
	return this._x;
});

Sprite.prototype.__defineSetter__("x", function(val) {
	if (this._x != val) {
		this._x = val;
		this.changed();
		this.oldx = val;
	}
});

Sprite.prototype.__defineGetter__("xs", function() {
	return this._xs;
});

Sprite.prototype.__defineSetter__("xs", function(val) {
	if (this._xs != val) {
		this._xs = val;
		this.changed();
	}
});

Sprite.prototype.__defineGetter__("ys", function() {
	return this._ys;
});

Sprite.prototype.__defineSetter__("ys", function(val) {
	if (this._ys != val) {
		this._ys = val;
		this.changed();
	}
});

Sprite.prototype.__defineGetter__("y", function() {
	return this._y;
});

Sprite.prototype.__defineSetter__("y", function(val) {
	if (this._y != val) {
		this._y = val;
		this.changed();
		this.oldy = val;
	}
});

Sprite.prototype.__defineGetter__("scale", function() {
	return this._scale;
});

Sprite.prototype.__defineSetter__("scale", function(val) {
	if (this._scale != val) {
		this._scale = val;
		this.changed();
	}
});
*/
Sprite.prototype.changed = function() {
	this.cont.changed = true;
}

Sprite.prototype.setproperties = function() {
	if (arguments.length < 2)
		return;
	for ( var i = 0; i < (arguments.length / 2); i++) {
		if (this.hasOwnProperty(arguments[i * 2]))
			this[arguments[i * 2]] = arguments[i * 2 + 1];
	}

}
Sprite.prototype.render = function(ctx) {
	if (typeof this.img == "undefined")
		return;
	{
		ctx.save();
		var mx = (this.x);
		var my = (this.y);
		if (this.shadow == 10) {
			ctx.globalAlpha = this.shadowopacity;
			if (this.scale == 1.0) {
				ctx.drawImage(this.img, this.shadowxs, this.shadowys,
						this.shadowws, this.shadowhs, this.x
								+ this.shadowOffsetX, this.y
								+ this.shadowOffsetY, this.shadowwd,
						this.shadowhd);
			} else {
				ctx.save();
				ctx.translate(this.x + this.shadowOffsetX + this.shadowws / 2,
						this.y + this.shadowOffsetY + this.shadowhs / 2);
				ctx.scale(this.scale, this.scale);
				ctx.drawImage(this.img, this.shadowxs, this.shadowys,
						this.shadowws, this.shadowhs, -this.shadowws / 2,
						-this.shadowhs / 2, this.shadowwd, this.shadowhd);
				ctx.restore();
			}
		}
		ctx.globalAlpha = this.opacity;
		if (this.scale == 1.0) {
			ctx.drawImage(this.img, this.xs, this.ys, this.w, this.h, mx, my,
					this.width, this.height);
		} else {
			ctx.translate((this.x + this.w / 2), (this.y
					+ this.h / 2));
			ctx.scale(this.scale, this.scale);
			ctx.drawImage(this.img, this.xs, this.ys, this.w, this.h, (-this.width / 2), (-this.height / 2),
					this.width, this.height);
		}
		ctx.restore();
	}
}

function Container(cnv) {
	this.canvas = cnv;
	this.objects = new Array();
	this.oldObj = 0;
	this.mouseObj = 0;
	this.animationmanager = new AnimationManager();
	this.updateRect = new Rect(0, 0, 0, 0);
	this.width = 0;
	this.height = 0;
	this.changed = true;
	return this;
};

Container.prototype.BeginUpdate = function() {
	this.changed = false;
}

Container.prototype.renderAll = function(ctx) {
	this.animationmanager.AnimateObjects();
	for (i = 0; i < this.objects.length; i++) {
		if (this.objects[i].visible == 1) {
			this.objects[i].render(ctx);
		}
	}
}

Container.prototype.MouseMove = function(x, y) {
	for (i = this.objects.length - 1; i >= 0; i--) {
		if ((x > this.objects[i].x)
				&& (x < this.objects[i].x + this.objects[i].width)
				&& (y > this.objects[i].y)
				&& (y < this.objects[i].y + this.objects[i].height)) {
			if (this.oldObj == 0) {
				this.oldObj = this.objects[i];
				this.objects[i].onMouseEnter();
			} else if (this.oldObj != this.objects[i]) {
				this.oldObj.onMouseLeave();
				this.oldObj = this.objects[i];
				this.objects[i].onMouseEnter();
			}
			break;
		}
	}
}

Container.prototype.Click = function(x, y) {
	for (i = this.objects.length - 1; i >= 0; i--) {
		if ((x > this.objects[i].x + this.objects[i].x1)
				&& (x < this.objects[i].x + this.objects[i].width
						+ this.objects[i].x2)
				&& (y > this.objects[i].y + this.objects[i].y1)
				&& (y < this.objects[i].y + this.objects[i].height
						+ this.objects[i].y2) && (this.objects[i].visible == 1)) {
			this.objects[i].onClick();
			break;
		}
	}
}

Container.prototype.MouseDown = function(x, y) {
	for (i = this.objects.length - 1; i >= 0; i--) {
		if ((x > this.objects[i].x + this.objects[i].x1)
				&& (x < this.objects[i].x + this.objects[i].width
						+ this.objects[i].x2)
				&& (y > this.objects[i].y + this.objects[i].y1)
				&& (y < this.objects[i].y + this.objects[i].height
						+ this.objects[i].y2) && (this.objects[i].visible == 1)) {
			this.objects[i].onMouseDown();
			this.mouseObj = this.objects[i];
			break;
		}
	}
}
Container.prototype.MouseUp = function(x, y) {
	if (this.mouseObj == 0) {
		for (i = this.objects.length - 1; i >= 0; i--) {
			if ((x > this.objects[i].x + this.objects[i].x1)
					&& (x < this.objects[i].x + this.objects[i].width
							+ this.objects[i].x2)
					&& (y > this.objects[i].y + this.objects[i].y1)
					&& (y < this.objects[i].y + this.objects[i].height
							+ this.objects[i].y2)
					&& (this.objects[i].visible == 1)) {
				this.objects[i].onMouseUp();
				break;
			}
		}
	} else {
		this.mouseObj.onMouseUp();
		this.mouseObj == 0;
	}
}
Container.prototype.AddAnimation = function(obj, prop, fromvalue, tovalue,
		time, milli, atype) {
	this.animationmanager.AddAnimation(obj, prop, fromvalue, tovalue, time,
			milli, atype);
}
