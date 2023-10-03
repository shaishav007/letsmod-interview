import { Scene, Mesh, BoxGeometry, WebGLRenderer, PerspectiveCamera, MeshBasicMaterial, Color } from "three";

export class ExampleGame
{
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  objects: Mesh[];

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

    document.body.appendChild( this.renderer.domElement );

    // create scene
    this.scene = new Scene();
    this.camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    this.camera.position.set(5, 10, 20);
    this.camera.lookAt(0, 0, 0);

    this.objects = [];

    for (let i = 0; i < 100; i++)
    {
      let o = this.objects[i] = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial( {color: new Color(Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25)}) );
      o.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
      o.quaternion.random();
      this.scene.add(o);
    }

    // initiate rendering loop
    this.animate();
  }

  animate()
  {
    requestAnimationFrame( () => this.animate() );

    this.renderer.render( this.scene, this.camera );
  }
}

(window as any).game = new ExampleGame();
