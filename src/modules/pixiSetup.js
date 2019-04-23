export const pixiSetup = app=>{
  let type = 'WebGL';
    if(!PIXI.utils.isWebGLSupported()){
      type = 'canvas';
  }
  PIXI.utils.sayHello(type);

  document.body.appendChild(app.view);
  app.renderer.backgroundColor = '0x000000';
  app.renderer.autoResize = true;
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.display = 'block';
}

export const pixiResize = app=>{
  app.renderer.resize(innerWidth, innerHeight)
  window.onresize = ()=>{
    app.renderer.resize(innerWidth, innerHeight)
  }
}
