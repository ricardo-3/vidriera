export class CameraPlayer {
  constructor(image, video, assets) {
    this.image=image; this.video=video; this.assets=assets; this.sequence=0;
  }

  async showFrame(id) {
    const asset=this.assets[id]; if(!asset)return;
    const sequence=++this.sequence; this.video.pause();
    const prepared=new Image();
    await new Promise(resolve=>{
      let done=false;
      const finish=()=>{if(done)return;done=true;clearTimeout(timer);resolve();};
      const timer=setTimeout(finish,1800);
      prepared.onload=async()=>{try{await prepared.decode();}catch{}finish();};
      prepared.onerror=finish; prepared.src=asset.src;
    });
    if(sequence!==this.sequence)return;
    for(const animation of this.image.getAnimations?.()||[])animation.cancel();
    this.video.hidden=true;this.image.hidden=false;this.image.src=asset.src;this.image.alt=asset.alt;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&typeof this.image.animate==='function')this.image.animate([{opacity:.25},{opacity:1}],{duration:240,easing:'ease-out'});
  }

  playTransition(transition,target) {
    if(!transition?.video||matchMedia('(prefers-reduced-motion: reduce)').matches)return this.showFrame(target);
    const sequence=++this.sequence;
    const finish=()=>{if(sequence===this.sequence)this.showFrame(target);};
    this.video.pause();this.video.src=transition.video;this.video.hidden=false;this.image.hidden=true;
    this.video.addEventListener('ended',finish,{once:true});this.video.addEventListener('error',finish,{once:true});
    this.video.play().catch(finish);
  }

  async scrubTransition(transition,progress) {
    if(!transition?.video||matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
    const sequence=++this.sequence;
    if(this.video.getAttribute('src')!==transition.video){this.video.src=transition.video;this.video.load();}
    if(!Number.isFinite(this.video.duration)||!this.video.duration){
      await new Promise(resolve=>{
        const finish=()=>{clearTimeout(timer);this.video.removeEventListener('loadedmetadata',finish);this.video.removeEventListener('error',finish);resolve();};
        const timer=setTimeout(finish,2500);
        this.video.addEventListener('loadedmetadata',finish,{once:true});this.video.addEventListener('error',finish,{once:true});
      });
    }
    if(sequence!==this.sequence||!Number.isFinite(this.video.duration)||!Number.isFinite(progress))return false;
    this.video.pause();this.video.currentTime=Math.min(1,Math.max(0,progress))*this.video.duration;
    this.image.hidden=true;this.video.hidden=false;return true;
  }
}
