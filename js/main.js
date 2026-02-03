const DATA = {
  tasks:[
    {task:'Text → Motion', videos:[
      'assets/videos/t2m/t2m_0.mp4',
      'assets/videos/t2m/t2m_1.mp4'
    ]},
    {task:'Motion → Text', videos:[
      'assets/videos/m2t/m2t_0.mp4',
      'assets/videos/m2t/m2t_1.mp4',
      'assets/videos/m2t/m2t_2.mp4'
    ]},
    {task:'Motion Inbetweening', videos:[
      'assets/videos/inbetween/inbetween_0.mp4',
      'assets/videos/inbetween/inbetween_1.mp4'
    ]},
    {task:'Motion Continuation', videos:[
      'assets/videos/continuation/continuation_0.mp4',
      'assets/videos/continuation/continuation_1.mp4'
    ]},
    {task:'Caption Correction', videos:[
      'assets/videos/correction/correction_0.mp4',
      'assets/videos/correction/correction_1.mp4'
    ]}
  ],
  comparisons:[
    {task:'Text → Motion', videos:['assets/videos/comparisons/t2m/t2m_0.mp4','assets/videos/comparisons/t2m/t2m_1.mp4']},
    {task:'Motion → Text', videos:['assets/videos/comparisons/m2t/m2t_0.mp4','assets/videos/comparisons/m2t/m2t_1.mp4']}
  ]
};

/* --- Modal --- */
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalCaption = document.getElementById('modalCaption');
document.getElementById('modalClose').onclick = ()=>{ modal.setAttribute('aria-hidden','true'); modalVideo.pause(); modalVideo.src=''; };
modal.onclick = (e)=>{ if(e.target===modal) { modal.setAttribute('aria-hidden','true'); modalVideo.pause(); modalVideo.src=''; } };
window.onkeydown = (e)=>{ if(e.key==='Escape') { modal.setAttribute('aria-hidden','true'); modalVideo.pause(); modalVideo.src=''; } };
function openModal(src, caption){ modal.setAttribute('aria-hidden','false'); modalVideo.src=src; modalVideo.play().catch(()=>{}); modalCaption.innerText=caption; }

/* --- TASKS --- */
const taskTabs = document.getElementById('taskTabs');
const taskPanels = document.getElementById('taskPanels');

DATA.tasks.forEach((task, i) => {
  /* --- Tab button --- */
  const btn = document.createElement('button');
  btn.className = 'tab' + (i === 0 ? ' active' : '');
  btn.innerText = task.task;   // <-- 用 task.task
  btn.dataset.target = 'task_' + i;
  btn.onclick = () => {
    document.querySelectorAll('#taskTabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#taskPanels .panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(btn.dataset.target);
    panel.classList.add('active');

    // 切换 tab 时，自动播放当前 active 的视频
    const firstVideo = panel.querySelector('video.active');
    if (firstVideo) {
      firstVideo.play();
    }
  };
  taskTabs.appendChild(btn);

  /* --- Panel container --- */
  const panel = document.createElement('div');
  panel.className = 'panel' + (i === 0 ? ' active' : '');
  panel.id = 'task_' + i;

  const slider = document.createElement('div'); slider.className='slider';
  const prev = document.createElement('button'); prev.className='slide-btn prev'; prev.innerText='◀';
  const next = document.createElement('button'); next.className='slide-btn next'; next.innerText='▶';
  const slides = document.createElement('div'); slides.className='slides';

  task.videos.forEach((src,j)=>{
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('controls','');
    if(j===0) video.classList.add('active');
    // video.onclick = ()=>openModal(v.file,v.caption);
    slides.appendChild(video);
  });

  let idx = 0;
  prev.onclick = ()=>{ idx=(idx-1+task.videos.length)%task.videos.length; updateSlides(); };
  next.onclick = ()=>{ idx=(idx+1)%task.videos.length; updateSlides(); };
  function updateSlides(){ 
    const videos = slides.querySelectorAll('video');

    videos.forEach((v, k) => {
      const isActive = k === idx;
      v.classList.toggle('active', isActive);

      if (isActive) {
        v.currentTime = 0;
        v.play();    // 自动播放
      } else {
        v.pause();   // 暂停其他视频
      }
    });
  }

  slider.appendChild(prev);
  slider.appendChild(slides);
  slider.appendChild(next);
  panel.appendChild(slider);
  taskPanels.appendChild(panel);

  // 初始自动播放
  if (i === 0) {
    const firstVideo = panel.querySelector('video.active');
    if (firstVideo) firstVideo.play();
  }
});

/* --- COMPARISONS --- */
const comparisonTabs = document.getElementById('comparison-tabs');
const comparisonPanels = document.getElementById('comparisonPanels');

DATA.comparisons.forEach((comp,i)=>{
  const btn = document.createElement('button');
  btn.className = 'tab'+(i===0?' active':'');
  btn.innerText = comp.task;
  btn.dataset.target = comp.task.replace(/\s+/g,'_');
  btn.onclick = ()=>{
    comparisonTabs.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    btn.classList.add('active');
    comparisonPanels.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  };
  comparisonTabs.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'panel'+(i===0?' active':'');
  panel.id = btn.dataset.target;

  const slider = document.createElement('div'); slider.className='slider';
  const prev = document.createElement('button'); prev.className='slide-btn prev'; prev.innerText='◀';
  const next = document.createElement('button'); next.className='slide-btn next'; next.innerText='▶';
  const slides = document.createElement('div'); slides.className='slides';

  comp.videos.forEach((v,j)=>{
    const video = document.createElement('video');
    video.src = v;
    video.setAttribute('controls','');
    if(j===0) video.classList.add('active');
    // video.onclick = ()=>openModal(v,v);
    slides.appendChild(video);
  });

  let idx=0;
  prev.onclick = ()=>{ idx=(idx-1+comp.videos.length)%comp.videos.length; update(); };
  next.onclick = ()=>{ idx=(idx+1)%comp.videos.length; update(); };
  function update(){ slides.querySelectorAll('video').forEach((v,i)=>v.classList.toggle('active',i===idx)); }

  slider.appendChild(prev);
  slider.appendChild(slides);
  slider.appendChild(next);
  panel.appendChild(slider);
  comparisonPanels.appendChild(panel);
});
