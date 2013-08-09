(function (window, undefined) { // window == context
    var pixelEffectsJS = function ctor() {
        this._image = null;
        this._in_reel_mode = true;

        this._image_outline_data = {};
    };

    pixelEffectsJS.prototype.load_local_image = function (local_file, callback) {
        var img = new Image();
        img.onload = function () {
            this.use_image(img);
            callback.call(callback, img);
        }.bind(this);
        img.src = URL.createObjectURL(local_file);
    };

    pixelEffectsJS.prototype.use_image = function (image) {
        console.log("pixelEffectsJS is using image");
        console.log(image);

        this._image = image;
    };

    pixelEffectsJS.prototype.moore_pattern = function (x, y, z, x1, y1, z1, x2, y2, z2) {
        var pattern = function ctor(x, y, z, x1, y1, z1, x2, y2, z2) {
            this.left = x1;
            this.right = z1;
            this.center = y1;

            this.upper_left = x;
            this.upper_right = z;

            this.lower_left = x2;
            this.lower_right = z2;

            this.up = y;
            this.down = y2;
        };

        pattern.prototype.matches = function (x, y, z, x1, y1, z1, x2, y2, z2) {
            if (x && x.hasOwnProperty("left")) {
                return this.matches(x.upper_left, x.up, x.upper_right,
                                    x.left, x.center, x.right,
                                    x.lower_left, x.down, c.lower_right);
            }

            return this.upper_left === x && this.up === y && this.upper_right === z &&
                   this.left === x1 && this.center === y1 && this.right === z1 &&
                   this.lower_left === x2 && this.down === y2 && this.lower_right === z2;
        };

        return new pattern(x, y, z, x1, y1, z1, x2, y2, z2);
    };

    pixelEffectsJS.prototype.find_outline = function () {

    };

    /*

    */
    pixelEffectsJS.prototype.create_viewer = function (canvas) {
        if (this._image === null) return {};

        var img = this._image;

        var total_width = this._image.width;
        var total_height = this._image.height;

        var view = function ctor(canvas, x, y, width, height) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");

            this.set_dimensions(x, y, width, height);
        };

        view.prototype.set_dimensions = function (x, y, width, height) {
            this.x = x || 0;
            this.y = y || 0;

            this.width = width || total_width;
            this.height = height || total_height;

            this.width = Math.min(this.width, total_width - this.x);
            this.height = Math.min(this.height, total_height - this.y);

            console.log(this.width, this.height);
        };

        view.prototype.prepare_canvas = function () {
            if (this.canvas.width != this.width || this.canvas.height != this.height) {
               this.canvas.width = this.width;
               this.canvas.height = this.height;

                console.log(this.canvas.width === this.width, this.canvas.height === this.height);
            }
        };

        view.prototype.display = function () {
            this.context.drawImage(img, this.x, this.y, this.width, this.height);
        };

        return new view(canvas);
    };

    window.pixelEffectsJS = new pixelEffectsJS();
})(this);