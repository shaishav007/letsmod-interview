import { Scene, Raycaster,Vector2, Mesh,BackSide, BoxGeometry, WebGLRenderer, PerspectiveCamera, MeshBasicMaterial, Color, Group, Vector3 } from "three";

export class ExampleGame
{
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  objects: Mesh[];

  selected:object[];
  pivot:object;
  constructor()
  {
    // create webgl rendering context
    this.renderer = new WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0px";
    this.renderer.domElement.style.left = "0px";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.selected=[];
    document.body.appendChild( this.renderer.domElement );
    this.pivot = new Object();
    
    // create scene
    this.scene = new Scene();
    this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    this.camera.position.set(5, 10, 20);
    this.camera.lookAt(0, 0, 0);

    this.objects = [];
    this.scene.add(this.pivot);

    for (let i = 0; i < 100; i++)
    {
      let o = this.objects[i] = new Mesh(new BoxGeometry(1, 1, 1), 
      new MeshBasicMaterial( {color: new Color(Math.random() * 0.5 + 0.25,
                                               Math.random() * 0.5 + 0.25, 
                                              Math.random() * 0.5 + 0.25)}) );
      o.position.set(Math.random() * 20 - 10, 
                     Math.random() * 20 - 10, 
                     Math.random() * 20 - 10);
      o.quaternion.random();

      
      this.scene.add(o);
    }


    this.renderer.domElement.addEventListener("click", (event) => {
      const raycaster = new Raycaster();
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);

      // Find objects intersecting with the ray
      const intersects = raycaster.intersectObjects(this.objects);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // Add the clicked object to the selected array
        if (!this.selected.includes(clickedObject)) {
          this.addHighlight(clickedObject);
          this.selected.push(clickedObject);

          
        }else{
          this.removeHighlight(clickedObject);
          this.selected = this.selected.filter((obj)=>obj!==clickedObject)


        }
        console.log(this.selected)
      }

      
    });

    document.addEventListener("keydown", (event) => {
      if(event.key==="ArrowLeft"){
        console.log('everything will be rotated clockwise along the y axis');
        this.rotateSelection('Y');//clockwise about Y
      }
      
    });
    
   
    // initiate rendering loop
    this.animate();
  }

  rotateSelection=(direction)=>{
    //rotate all objects of the selction about Y axis
    const averageX = this.selected.reduce((sumX, object) => sumX + object.position.x, 0) / this.selected.length;
    const averageY = this.selected.reduce((sumY, object) => sumY + object.position.y, 0) / this.selected.length;
    
    
    switch(direction){
      case('Y'):
        this.selected.forEach((obj)=>{
          //this is +Y axis
          const axis = new Vector3(averageX,0,0);
          const newPosition = obj.position.clone().sub(axis.clone());

          // Apply the rotation
          newPosition.applyAxisAngle(axis, 0.1);

          // Offset the position to account for the rotation axis
          newPosition.add(axis.clone());

          // Update the object's position
          obj.position.copy(newPosition);
        })
      break;
    }

   
  }
  addHighlight=(obj:object)=>{
    
    const originalMaterial = obj.material.clone();

    // Modify the color of the material to make it lighter
    const highlightColor = new Color(
      Math.min(1, originalMaterial.color.r + 0.2), // Adjust the 'r' component for a lighter color
      Math.min(1, originalMaterial.color.g + 0.2), // Adjust the 'g' component for a lighter color
      Math.min(1, originalMaterial.color.b + 0.2)  // Adjust the 'b' component for a lighter color
    );
    const outlineMaterial = new MeshBasicMaterial({
      color: highlightColor, 
      side: BackSide, // use backface for outline effect
    });

    // obj.material = new MeshBasicMaterial({ color: highlightColor });
    const outlineObject = obj.clone();
    outlineObject.material = outlineMaterial;

    // Scale up the outline object slightly
    const scale = 1.1; // Adjust the scale factor as needed
    outlineObject.scale.set(scale, scale, scale);

    // Add the outline object to the scene
    this.scene.add(outlineObject);

    // Store the outline object as a property of the clicked object
    obj.outlineObject = outlineObject;
    
  }

  removeHighlight=(obj:object)=>{
    this.scene.remove(obj.outlineObject)
    
  }
  
  animate()
  {
    requestAnimationFrame( () => this.animate() );


    this.renderer.render( this.scene, this.camera );
  }
}

(window as any).game = new ExampleGame();
