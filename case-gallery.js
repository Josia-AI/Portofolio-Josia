/* Accessible lightbox for real project screenshots; no third-party dependencies. */
(() => {
 'use strict';
 const triggers = Array.from(document.querySelectorAll('.case-shot[data-full]'));
 if (!triggers.length) return;
 const dialog = document.createElement('div');
 dialog.className = 'case-lightbox';
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Project screenshots');
 dialog.innerHTML = '<div class="case-lightbox-actions"><button class="case-lightbox-close" type="button" aria-label="Close image">✕</button></div><button class="case-lightbox-arrow case-lightbox-prev" type="button" aria-label="Previous image">❮</button><img alt=""><button class="case-lightbox-arrow case-lightbox-next" type="button" aria-label="Next image">❯</button><div class="case-lightbox-footer"><span class="case-lightbox-caption"></span><span class="case-lightbox-counter"></span></div>';
 document.body.append(dialog);
 const picture=dialog.querySelector('img');const caption=dialog.querySelector('.case-lightbox-caption');const counter=dialog.querySelector('.case-lightbox-counter');
 const closeButton=dialog.querySelector('.case-lightbox-close');
 const prevButton=dialog.querySelector('.case-lightbox-prev');const nextButton=dialog.querySelector('.case-lightbox-next');
 let current=0, lastFocus=null, touchX=null;
 function update() {
  const trigger=triggers[current]; const ind=document.documentElement.lang==='id';
  const name=ind?trigger.dataset.captionId:trigger.dataset.captionEn;
  picture.src=trigger.dataset.full; picture.alt=name || 'Project screenshot';
  caption.textContent=name || '';counter.textContent=`${current+1} / ${triggers.length}`;
 }
 function open(index) {current=index;lastFocus=document.activeElement; update();dialog.classList.add('is-open');document.body.classList.add('case-lightbox-open');closeButton.focus();}
 function close(){dialog.classList.remove('is-open');document.body.classList.remove('case-lightbox-open');picture.removeAttribute('src');lastFocus?.focus();}
 function shift(delta){current=(current+delta+triggers.length)%triggers.length;update();}
 triggers.forEach((trigger,index)=>trigger.addEventListener('click',()=>open(index)));
 closeButton.addEventListener('click',close);prevButton.addEventListener('click',()=>shift(-1));nextButton.addEventListener('click',()=>shift(1));
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 document.addEventListener('keydown',e=>{
  if(!dialog.classList.contains('is-open'))return;
  if(e.key==='Escape'){e.preventDefault();close();}
  if(e.key==='ArrowLeft'){e.preventDefault();shift(-1);}
  if(e.key==='ArrowRight'){e.preventDefault();shift(1);}
  if(e.key==='Tab'){
   const tabs=[closeButton,prevButton,nextButton];const focus=tabs.indexOf(document.activeElement);
   if(e.shiftKey && focus===0){e.preventDefault();nextButton.focus();}
   else if(!e.shiftKey && focus===tabs.length-1){e.preventDefault();closeButton.focus();}
  }
 });
 dialog.addEventListener('touchstart',e=>{touchX=e.touches[0]?.clientX ?? null;},{passive:true});
 dialog.addEventListener('touchend',e=>{if(touchX===null)return;const diff=(e.changedTouches[0]?.clientX ?? touchX)-touchX;touchX=null;if(Math.abs(diff)>60)shift(diff<0?1:-1);},{passive:true});
})();
