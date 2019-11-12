var cnv;

var sceneCamera;
var light;
var objects;

var img;

var minDist = 0.01;

function setup() {
   // colorMode(HSL);
   setupCoolors();
   setupCamera();
   setupObjects();
   setupLights();
   cnv = createCanvas(window.innerWidth, window.innerHeight);
   cnv.position(0, 0);
   // colorMode(RGB);
   // colorMode(HSL);
   background(coolors.black);
   img = createImage(sceneCamera.res.width, sceneCamera.res.height);
   img.loadPixels();
   render();
   img.updatePixels();
   image(img, (window.innerWidth - sceneCamera.res.width) / 2, (window.innerHeight - sceneCamera.res.height) / 2);
}

function setupCamera() {
   sceneCamera = {
      center: createVector(-2, 0.5, 0),
      forward: createVector(1, 0, 0),
      up: createVector(0, 1, 0),
      res: {
         width: window.innerWidth,
         height: window.innerHeight
      },
      // res: {
      //    width: 10,
      //    height: 10
      // },
      fov: 60,
      renderDist: 10
   };
   sceneCamera.right = p5.Vector.cross(sceneCamera.forward, sceneCamera.up);
}

function setupObjects() {
   objects = [{
      type: "sphere",
      center: createVector(2, 0, 0),
      r: 0.5,
      color: coolors.rasp
   }, {
      type: "sphere",
      center: createVector(3, 1, 0),
      r: 0.5,
      color: coolors.blue
   }, {
      type: "sphere",
      center: createVector(1, 0.5, -0.5),
      r: 0.25,
      color: color(100, 80, 80)
   }];

   for(var i = 0; i<objects.length; i++){
      if(objects[i].type=="sphere"){
         objects[i].dist2 = function(point){
            return dist2Point(point, this.center) - this.r;
         }
      }else if(objects[i].type=="cube"){
         objects[i].dist2 = function(point){
         }
      }
   }

}

function setupLights(){
   light = {
      center: createVector(1, 5, 0)
   };
}

function dist2Point(point1, point2) {
   return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) + Math.pow(point1.z - point2.z, 2));
}

function getNearestObject(point) {
   var min = objects[0].dist2(point);
   var objHit = objects[0];
   for (var i = 0; i < objects.length; i++) {
      var newDist = objects[i].dist2(point);
      if (newDist < min) {
         min = newDist;
         objHit = objects[i];
      }
   }
   return {
      dist: min,
      objHit
   };
}

function castRay(direction) {
   var dist = 0;
   var point = sceneCamera.center;
   var hit = false;
   var objHit = null;
   var norm = null;
   while (dist < sceneCamera.renderDist && !hit) {
      var nextSphere = marchSphere(point);
      if (nextSphere.result == 'hit') {
         hit = true;
         return {
            hit,
            dist,
            objHit: nextSphere.objHit,
            norm: nextSphere.norm,
            PoH: point
         };
      } else {
         dist += nextSphere.dist;
         point = {
            x: point.x + nextSphere.dist * direction.x,
            y: point.y + nextSphere.dist * direction.y,
            z: point.z + nextSphere.dist * direction.z
         };
      }
   }
   return {
      hit,
      dist,
   };

}

function getNormalAt(point, obj) {
   var e = 0.01;
   var v = createVector(
      obj.dist2(createVector(point.x + e, point.y, point.z), obj) -
      obj.dist2(createVector(point.x - e, point.y, point.z), obj),
      obj.dist2(createVector(point.x, point.y + e, point.z), obj) -
      obj.dist2(createVector(point.x, point.y - e, point.z), obj),
      obj.dist2(createVector(point.x, point.y, point.z + e), obj) -
      obj.dist2(createVector(point.x, point.y, point.z - e), obj),
   );

   return v.normalize();
}

function marchSphere(point) {
   var nearestObject = getNearestObject(point);
   var dist = nearestObject.dist;
   if (dist < minDist) {
      var norm = getNormalAt(point, nearestObject.objHit);
      return {
         result: 'hit',
         objHit: nearestObject.objHit,
         norm,
      }
   } else {
      return {
         result: 'no hit',
         dist: dist
      }
   }
}

function render() {
   // y   x
   // |  /
   // | /
   // |/________z
   colorMode(HSL);
   for (var i = -sceneCamera.res.width / 2; i < sceneCamera.res.width / 2; i++) {
      for (var j = -sceneCamera.res.height / 2; j < sceneCamera.res.height / 2; j++) {
         // sceneCamera.direction*sceneCamera.renderDist+i*sceneCamera.right+j*sceneCamera.up
         var vec = rotateAround(sceneCamera.forward, "y", -Math.PI * 2 * i * sceneCamera.fov * 1.0 / (sceneCamera.res.width * 360));
         vec = rotateAround(vec, "z", -Math.PI * 2 * j * sceneCamera.fov * 1.0 / (sceneCamera.res.width * 360));
         var ray = castRay(vec);
         if (ray.hit) {
            var d = createVector(light.center.x-ray.PoH.x, light.center.y-ray.PoH.y, light.center.z-ray.PoH.z);
            var cosSim = p5.Vector.dot(ray.norm, d.normalize());
            cosSim = cosSim<0 ? 0 : cosSim;
            var c = color(hue(ray.objHit.color), saturation(ray.objHit.color), cosSim*lightness(ray.objHit.color));
            img.set(i + sceneCamera.res.width / 2, j + sceneCamera.res.height / 2, c);
         } else {
            img.set(i + sceneCamera.res.width / 2, j + sceneCamera.res.height / 2, coolors.black);
         }
      }
   }
}

function rotateAround(v, axis, angle) {
   // console.log(axis + " " + angle);
   var resx = 0;
   var resy = 0;
   var resz = 0;
   if (axis == "x") {
      resx = v.x;
      resy = Math.cos(angle) * v.y - Math.sin(angle) * v.z;
      resz = Math.sin(angle) * v.y + Math.cos(angle) * v.z;
   } else if (axis == "y") {
      resx = Math.cos(angle) * v.x + Math.sin(angle) * v.z;
      resy = v.y;
      resz = -Math.sin(angle) * v.x + Math.cos(angle) * v.z;
   } else if (axis == "z") {
      resx = Math.cos(angle) * v.x - Math.sin(angle) * v.y;
      resy = Math.sin(angle) * v.x + Math.cos(angle) * v.y;
      resz = v.z;
   }
   return createVector(resx, resy, resz);
}
