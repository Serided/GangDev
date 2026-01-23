const rail=document.getElementById("updatesRail");
const frame=document.getElementById("updatesFrame");
const footerWrap=document.getElementById("updatesFooterWrap");

if(footerWrap){
    const setFooterH=()=>{const h=footerWrap.getBoundingClientRect().height||0;document.documentElement.style.setProperty("--footerH",`${Math.ceil(h)}px`);};
    setFooterH();
    window.addEventListener("resize",setFooterH);
}

if(rail&&frame){
    const cards=Array.from(rail.querySelectorAll(".uCard"));

    const setActive=(idx)=>{cards.forEach((c,i)=>c.classList.toggle("active",i===idx));};

    const closestIndex=()=>{
        const railRect=rail.getBoundingClientRect();
        let best=0,bestDist=Infinity;
        for(let i=0;i<cards.length;i++){
            const r=cards[i].getBoundingClientRect();
            const dist=Math.abs(r.left-railRect.left);
            if(dist<bestDist){bestDist=dist;best=i;}
        }
        return best;
    };

    const snapTo=(idx)=>{
        idx=Math.max(0,Math.min(cards.length-1,idx));
        setActive(idx);
        cards[idx].scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});
    };

    let hovering=false;
    frame.addEventListener("mouseenter",()=>hovering=true);
    frame.addEventListener("mouseleave",()=>hovering=false);

    let lock=false;
    let accum=0;
    const THRESH=40;
    const LOCK_MS=220;

    window.addEventListener("wheel",(e)=>{
        if(!hovering||!cards.length)return;
        const max=rail.scrollWidth-rail.clientWidth;
        if(max<=0)return;

        let delta=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;
        if(e.deltaMode===1)delta*=18;
        if(e.deltaMode===2)delta*=120;

        e.preventDefault();
        if(lock)return;

        accum+=delta;
        if(Math.abs(accum)>=THRESH){
            const dir=accum>0?1:-1;
            accum=0;
            lock=true;
            const cur=closestIndex();
            snapTo(cur+dir);
            setTimeout(()=>{lock=false;},LOCK_MS);
        }
    },{passive:false,capture:true});

    let isDown=false,startX=0,startScroll=0,moved=false;

    rail.addEventListener("pointerdown",(e)=>{
        isDown=true;
        moved=false;
        rail.classList.add("isDragging");
        rail.setPointerCapture(e.pointerId);
        startX=e.clientX;
        startScroll=rail.scrollLeft;
    });

    rail.addEventListener("pointermove",(e)=>{
        if(!isDown)return;
        const dx=e.clientX-startX;
        if(Math.abs(dx)>2)moved=true;
        e.preventDefault();
        rail.scrollLeft=startScroll-dx;
    });

    const endDrag=()=>{
        if(!isDown)return;
        isDown=false;
        rail.classList.remove("isDragging");
        snapTo(closestIndex());
    };

    rail.addEventListener("pointerup",endDrag);
    rail.addEventListener("pointercancel",endDrag);

    rail.addEventListener("click",(e)=>{
        if(moved){e.preventDefault();e.stopPropagation();}
    },true);

    rail.addEventListener("keydown",(e)=>{
        const cur=closestIndex();
        if(e.key==="ArrowRight"){snapTo(cur+1);e.preventDefault();}
        if(e.key==="ArrowLeft"){snapTo(cur-1);e.preventDefault();}
    });

    snapTo(0);
}
