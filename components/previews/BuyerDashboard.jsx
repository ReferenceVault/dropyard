"use client";
import { useState } from "react";
import {
  Search, Heart, Clock, MapPin, Package, ChevronRight,
  TrendingDown, Check, User, Compass, ShoppingBag,
  MessageSquare, History, Tag, ArrowRight, Sparkles, Truck,
  Calendar, ArrowLeft
} from "lucide-react";

const C = {
  gLightBg:"#ECFDF5",gSoft:"#D1FAE5",gAccent:"#6EE7B7",
  gPrimary:"#1F7A4D",gHover:"#17603D",gDark:"#0F3D2A",
  oLightBg:"#FFF7ED",oSoft:"#FED7AA",oAccent:"#FDBA74",
  oPrimary:"#F08A00",oHover:"#C96F00",oDark:"#7A4300",
  tPrimary:"#0F766E",tLight:"#CCFBF1",tSoft:"#99F6E4",
  ai:"#7C3AED",aiLight:"#F5F3FF",
};
const F={h:"'Outfit',sans-serif",b:"'Plus Jakarta Sans',sans-serif"};

const dedSellers = [
  { id:"patel", name:"The Patel Family", type:"moving", badge:"🚚 Moving Sale", tagline:"Relocating to Vancouver — everything must go before moving day!", location:"Barrhaven South", dist:"1.5 km", dateFrom:"Apr 5", dateTo:"Apr 20", daysLeft:8, color:C.tPrimary, bg:C.tLight, img:"📦" },
  { id:"williams", name:"Estate of M. Williams", type:"estate", badge:"🏠 Estate Sale", tagline:"A lifetime of treasures — antiques, furniture, art, and collectibles.", location:"Half Moon Bay", dist:"3.2 km", dateFrom:"Apr 8", dateTo:"May 8", daysLeft:26, color:"#7C3AED", bg:"#F5F3FF", img:"🏺" },
  { id:"chris", name:"Chris B.", type:"garage", badge:"🏷️ Garage Sale", tagline:"Spring cleanout! Tools, garden gear, sports equipment, and more.", location:"Stonebridge", dist:"0.7 km", dateFrom:"Apr 12", dateTo:"Apr 14", daysLeft:2, color:C.oPrimary, bg:C.oLightBg, img:"🔧" },
];

const allItems = [
  // Regular DROP items (live only during 48hr window)
  {id:1,t:"Sectional Sofa",p:450,op:null,cond:"Good",cat:"Furniture",seller:"Jane D.",dist:"1 km",saves:14,img:"🛋️",layer:"drop",timeLeft:"19h 49m",status:"live",ded:null,sellerId:null},
  {id:2,t:"iPhone 13 — 128GB",p:320,op:null,cond:"Excellent",cat:"Electronics",seller:"Mike T.",dist:"2 km",saves:22,img:"📱",layer:"drop",timeLeft:"19h 49m",status:"live",ded:null,sellerId:null},
  {id:3,t:"Vintage Wooden Table",p:120,op:null,cond:"Good",cat:"Furniture",seller:"Alex K.",dist:"1 km",saves:8,img:"🪑",layer:"drop",timeLeft:"19h 49m",status:"live",ded:null,sellerId:null},
  {id:4,t:"Kids' Bicycle — 16\"",p:30,op:null,cond:"Good",cat:"Sports",seller:"Tom R.",dist:"0.3 km",saves:5,img:"🚲",layer:"drop",timeLeft:"19h 49m",status:"live",ded:null,sellerId:null},
  {id:5,t:"Dyson V8 Vacuum",p:120,op:null,cond:"Like New",cat:"Electronics",seller:"Anna W.",dist:"2.1 km",saves:18,img:"🧹",layer:"drop",timeLeft:"19h 49m",status:"claimed",ded:null,sellerId:null},
  // Patel Moving Sale (always available within date range)
  {id:6,t:"Full Bedroom Set — Queen",p:600,op:800,cond:"Good",cat:"Furniture",seller:"The Patel Family",dist:"1.5 km",saves:31,img:"🛏️",layer:"dedicated",status:"live",ded:"moving",sellerId:"patel"},
  {id:7,t:"Dining Set — 8 Chairs + Table",p:350,op:500,cond:"Good",cat:"Furniture",seller:"The Patel Family",dist:"1.5 km",saves:19,img:"🍽️",layer:"dedicated",status:"live",ded:"moving",sellerId:"patel"},
  {id:20,t:"LG 55\" Smart TV",p:250,op:400,cond:"Good",cat:"Electronics",seller:"The Patel Family",dist:"1.5 km",saves:27,img:"📺",layer:"dedicated",status:"live",ded:"moving",sellerId:"patel"},
  {id:21,t:"Sofa Set — 3-Seater + Loveseat",p:500,op:750,cond:"Good",cat:"Furniture",seller:"The Patel Family",dist:"1.5 km",saves:18,img:"🛋️",layer:"dedicated",status:"live",ded:"moving",sellerId:"patel"},
  {id:22,t:"Kids' Study Desk + Chair",p:45,op:80,cond:"Excellent",cat:"Kids & Baby",seller:"The Patel Family",dist:"1.5 km",saves:8,img:"📖",layer:"dedicated",status:"live",ded:"moving",sellerId:"patel"},
  // Williams Estate Sale
  {id:8,t:"Antique China Cabinet (1960s)",p:280,op:null,cond:"Fair",cat:"Décor",seller:"Estate of M. Williams",dist:"3.2 km",saves:12,img:"🏺",layer:"dedicated",status:"live",ded:"estate",sellerId:"williams"},
  {id:9,t:"Vintage Record Player + Vinyls",p:90,op:null,cond:"Fair",cat:"Electronics",seller:"Estate of M. Williams",dist:"3.2 km",saves:9,img:"🎵",layer:"dedicated",status:"live",ded:"estate",sellerId:"williams"},
  {id:23,t:"Oil Painting — Landscape",p:150,op:null,cond:"Good",cat:"Décor",seller:"Estate of M. Williams",dist:"3.2 km",saves:14,img:"🖼️",layer:"dedicated",status:"live",ded:"estate",sellerId:"williams"},
  {id:24,t:"Silverware Collection — 48pc",p:120,op:null,cond:"Good",cat:"Kitchen",seller:"Estate of M. Williams",dist:"3.2 km",saves:6,img:"🍴",layer:"dedicated",status:"live",ded:"estate",sellerId:"williams"},
  // Chris Garage Sale
  {id:10,t:"Honda Lawnmower",p:180,op:250,cond:"Good",cat:"Tools",seller:"Chris B.",dist:"0.7 km",saves:7,img:"🌿",layer:"dedicated",status:"live",ded:"garage",sellerId:"chris"},
  {id:11,t:"Box of Power Tools",p:95,op:null,cond:"Good",cat:"Tools",seller:"Chris B.",dist:"0.7 km",saves:4,img:"🔧",layer:"dedicated",status:"live",ded:"garage",sellerId:"chris"},
  {id:25,t:"Mountain Bike — 26\"",p:85,op:120,cond:"Fair",cat:"Sports",seller:"Chris B.",dist:"0.7 km",saves:6,img:"🚵",layer:"dedicated",status:"live",ded:"garage",sellerId:"chris"},
  // Shelf items
  {id:12,t:"Samsung Galaxy Tab A7",p:65,op:80,cond:"Fair",cat:"Electronics",seller:"Mike T.",dist:"2 km",saves:4,img:"📲",layer:"shelf",days:10,priceDrop:true,ded:null,sellerId:null},
  {id:13,t:"Standing Desk",p:140,op:175,cond:"Good",cat:"Furniture",seller:"David N.",dist:"2.4 km",saves:11,img:"🖥️",layer:"shelf",days:12,priceDrop:true,ded:null,sellerId:null},
  {id:14,t:"Winter Jacket — Men's L",p:20,op:null,cond:"Excellent",cat:"Clothing",seller:"Omar H.",dist:"1.1 km",saves:5,img:"🧥",layer:"shelf",days:7,priceDrop:false,ded:null,sellerId:null},
  {id:15,t:"Yoga Mat + Bands",p:15,op:null,cond:"Like New",cat:"Sports",seller:"Chloe D.",dist:"0.6 km",saves:3,img:"🧘",layer:"shelf",days:5,priceDrop:false,ded:null,sellerId:null},
  {id:16,t:"Kitchen Utensils Box",p:10,op:null,cond:"Good",cat:"Kitchen",seller:"Raj P.",dist:"0.9 km",saves:2,img:"🍴",layer:"shelf",days:3,priceDrop:false,ded:null,sellerId:null},
];

const categories=["All","Furniture","Electronics","Kitchen","Kids & Baby","Clothing","Sports","Tools","Décor"];
const dedTypes=[
  {id:"all-ded",label:"All Sales",color:C.tPrimary},
  {id:"moving",label:"🚚 Moving Sales",color:C.tPrimary},
  {id:"estate",label:"🏠 Estate Sales",color:"#7C3AED"},
  {id:"garage",label:"🏷️ Garage Sales",color:C.oPrimary},
];

function ItemCard({item}){
  const [saved,setSaved]=useState(false);
  const isDrop=item.layer==="drop";
  const isDed=item.layer==="dedicated";
  const isClaimed=item.status==="claimed";
  const isShelf=item.layer==="shelf";
  const dedInfo=item.ded==="moving"?{l:"Moving Sale",c:C.tPrimary,ic:"🚚"}:item.ded==="estate"?{l:"Estate Sale",c:"#7C3AED",ic:"🏠"}:item.ded==="garage"?{l:"Garage Sale",c:C.oPrimary,ic:"🏷️"}:null;
  const seller=item.sellerId?dedSellers.find(s=>s.id===item.sellerId):null;

  return(
    <div style={{borderRadius:14,overflow:"hidden",backgroundColor:"#fff",border:`1px solid ${isClaimed?"#e5e7eb":dedInfo?dedInfo.c+"20":isDrop?C.gSoft:"#f0f0f0"}`,opacity:isClaimed?0.5:1,transition:"all 0.2s",cursor:"pointer"}}
      onMouseEnter={e=>{if(!isClaimed){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(0,0,0,0.07)"}}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
      <div style={{height:150,backgroundColor:dedInfo?dedInfo.c+"08":isDrop?C.gLightBg:isShelf?"#fafafa":"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <span style={{fontSize:44,filter:isClaimed?"grayscale(0.5)":"none"}}>{item.img}</span>
        {/* Badges */}
        {dedInfo&&!isClaimed&&<div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,backgroundColor:dedInfo.c,color:"#fff"}}><span style={{fontSize:9}}>{dedInfo.ic}</span><span style={{fontSize:8,fontWeight:800,letterSpacing:0.7,fontFamily:F.b}}>{dedInfo.l.toUpperCase()}</span></div>}
        {isDrop&&!isClaimed&&!dedInfo&&<div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,backgroundColor:C.gDark,color:"#fff"}}><div style={{width:5,height:5,borderRadius:"50%",backgroundColor:"#22C55E",boxShadow:"0 0 5px #22C55E",animation:"pulse 2s infinite"}}/><span style={{fontSize:8,fontWeight:800,letterSpacing:0.7,fontFamily:F.b}}>LIVE DROP</span></div>}
        {isClaimed&&<div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,backgroundColor:"#6B7280",color:"#fff"}}><Check size={9}/><span style={{fontSize:8,fontWeight:800,fontFamily:F.b}}>CLAIMED</span></div>}
        {isShelf&&<div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:6,backgroundColor:C.oPrimary,color:"#fff"}}><Package size={9}/><span style={{fontSize:8,fontWeight:800,fontFamily:F.b}}>ON THE SHELF</span></div>}
        {item.priceDrop&&<div style={{position:"absolute",top:8,right:8,display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:6,backgroundColor:"#DC2626",color:"#fff"}}><TrendingDown size={9}/><span style={{fontSize:8,fontWeight:800,fontFamily:F.b}}>PRICE DROP</span></div>}
        <button onClick={e=>{e.stopPropagation();setSaved(!saved)}} style={{position:"absolute",bottom:8,right:8,width:28,height:28,borderRadius:"50%",backgroundColor:"rgba(255,255,255,0.9)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Heart size={12} fill={saved?"#EF4444":"none"} style={{color:saved?"#EF4444":"#ccc"}}/></button>
      </div>
      <div style={{padding:"10px 12px 12px"}}>
        <h3 style={{fontSize:13,fontWeight:700,color:C.gDark,lineHeight:1.3,marginBottom:4,fontFamily:F.h,minHeight:34,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{item.t}</h3>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
          <span style={{fontSize:18,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${item.p}</span>
          {item.op&&<span style={{fontSize:11,color:"#ccc",textDecoration:"line-through",fontFamily:F.b}}>${item.op}</span>}
          {item.op&&<span style={{fontSize:8,fontWeight:700,padding:"1px 4px",borderRadius:4,backgroundColor:"#FEE2E2",color:"#DC2626",fontFamily:F.b}}>{Math.round((1-item.p/item.op)*100)}% off</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#999",fontFamily:F.b,marginBottom:6}}><span>{item.dist}</span><span>·</span><span>{item.seller}</span></div>
        {/* Time context — different per layer */}
        {isDrop&&!isClaimed&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,fontWeight:600,color:C.gPrimary,fontFamily:F.b,marginBottom:8,padding:"3px 7px",borderRadius:5,backgroundColor:C.gLightBg}}><Clock size={9}/>{item.timeLeft} left to claim</div>}
        {isDed&&!isClaimed&&seller&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,fontWeight:600,color:dedInfo.c,fontFamily:F.b,marginBottom:8,padding:"3px 7px",borderRadius:5,backgroundColor:dedInfo.c+"08"}}><Calendar size={9}/>Available {seller.dateFrom} – {seller.dateTo}{seller.daysLeft<=3&&<span style={{color:"#DC2626",fontWeight:700}}> · {seller.daysLeft}d left!</span>}</div>}
        {isShelf&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:9,fontWeight:600,color:C.oDark,fontFamily:F.b,marginBottom:8,padding:"3px 7px",borderRadius:5,backgroundColor:C.oLightBg}}><Package size={9} style={{color:C.oPrimary}}/> {item.days}d ago{item.priceDrop&&<span style={{color:"#DC2626",fontWeight:700}}> — reduced!</span>}</div>}
        {!isClaimed?<button style={{width:"100%",padding:"7px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:F.b,backgroundColor:dedInfo?dedInfo.c:isDrop?C.gPrimary:C.oPrimary,color:"#fff"}}>{isDrop?"Claim Now":"Claim This Item"}</button>
        :<button disabled style={{width:"100%",padding:"7px 0",borderRadius:8,border:"1px solid #e5e7eb",fontSize:11,fontWeight:600,fontFamily:F.b,backgroundColor:"#fafafa",color:"#ccc",cursor:"not-allowed"}}>Claimed</button>}
      </div>
    </div>
  );
}

function SellerCard({seller,onView}){
  const items=allItems.filter(i=>i.sellerId===seller.id);
  const urgent=seller.daysLeft<=3;
  return(
    <div onClick={()=>onView(seller.id)} style={{borderRadius:16,overflow:"hidden",backgroundColor:"#fff",border:`2px solid ${seller.color}20`,cursor:"pointer",transition:"all 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px ${seller.color}15`}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
      <div style={{padding:"14px 18px",background:`linear-gradient(135deg,${seller.color},${seller.color}dd)`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:1}}>
          <span style={{fontSize:8,fontWeight:800,padding:"3px 8px",borderRadius:6,backgroundColor:"rgba(255,255,255,0.2)",color:"#fff",letterSpacing:0.7,fontFamily:F.b}}>{seller.badge}</span>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <Calendar size={10} style={{color:"rgba(255,255,255,0.7)"}}/>
            <span style={{fontSize:10,fontWeight:700,color:"#fff",fontFamily:F.b}}>{seller.dateFrom} – {seller.dateTo}</span>
            {urgent&&<span style={{fontSize:8,fontWeight:800,padding:"2px 6px",borderRadius:4,backgroundColor:"rgba(255,255,255,0.25)",color:"#fff",fontFamily:F.b,animation:"pulse 2s infinite"}}>{seller.daysLeft}d left!</span>}
          </div>
        </div>
      </div>
      <div style={{padding:"14px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:44,height:44,borderRadius:12,backgroundColor:seller.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,border:`1px solid ${seller.color}20`}}>{seller.img}</div>
          <div style={{flex:1,minWidth:0}}>
            <h3 style={{fontSize:15,fontWeight:800,color:C.gDark,fontFamily:F.h}}>{seller.name}</h3>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              <span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:"#999",fontFamily:F.b}}><MapPin size={10}/>{seller.location}</span>
              <span style={{fontSize:10,color:"#ccc"}}>·</span>
              <span style={{fontSize:10,color:"#999",fontFamily:F.b}}>{seller.dist}</span>
            </div>
          </div>
        </div>
        <p style={{fontSize:12,color:"#777",lineHeight:1.5,marginBottom:12,fontFamily:F.b}}>{seller.tagline}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:11,fontWeight:800,color:seller.color,fontFamily:F.h}}>{items.length} items</span>
            <span style={{fontSize:10,color:"#ccc"}}>·</span>
            <span style={{display:"flex",alignItems:"center",gap:2,fontSize:10,color:"#999",fontFamily:F.b}}><Heart size={9}/>{items.reduce((a,b)=>a+b.saves,0)} saves</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,color:seller.color,fontFamily:F.b}}>View All Items <ChevronRight size={13}/></div>
        </div>
      </div>
    </div>
  );
}

function SellerDetailView({sellerId,onBack}){
  const seller=dedSellers.find(s=>s.id===sellerId);
  const items=allItems.filter(i=>i.sellerId===sellerId);
  const [cat,setCat]=useState("All");
  const filtered=cat==="All"?items:items.filter(i=>i.cat===cat);
  const catsForSeller=["All",...[...new Set(items.map(i=>i.cat))]];
  if(!seller) return null;
  return(
    <>
      <div style={{borderRadius:16,overflow:"hidden",marginBottom:20,border:`2px solid ${seller.color}20`}}>
        <div style={{padding:"20px 24px",background:`linear-gradient(135deg,${seller.color},${seller.color}cc)`,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.08)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,backgroundColor:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",color:"#fff",fontSize:11,fontWeight:600,fontFamily:F.b,marginBottom:12}}><ArrowLeft size={12}/> Back to all sales</button>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:56,height:56,borderRadius:16,backgroundColor:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:"1px solid rgba(255,255,255,0.1)"}}>{seller.img}</div>
              <div>
                <span style={{fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:6,backgroundColor:"rgba(255,255,255,0.2)",color:"#fff",letterSpacing:0.7,fontFamily:F.b}}>{seller.badge}</span>
                <h2 style={{fontSize:22,fontWeight:900,color:"#fff",marginTop:6,fontFamily:F.h}}>{seller.name}</h2>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2,fontFamily:F.b}}>{seller.tagline}</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 24px",backgroundColor:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#777",fontFamily:F.b}}><MapPin size={12} style={{color:seller.color}}/>{seller.location} · {seller.dist}</span>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#777",fontFamily:F.b}}><Package size={12} style={{color:seller.color}}/>{items.length} items</span>
            <span style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#777",fontFamily:F.b}}><Heart size={12} style={{color:"#EF4444"}}/>{items.reduce((a,b)=>a+b.saves,0)} saves</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:8,backgroundColor:seller.bg,border:`1px solid ${seller.color}20`}}>
            <Calendar size={12} style={{color:seller.color}}/>
            <span style={{fontSize:12,fontWeight:700,color:seller.color,fontFamily:F.b}}>{seller.dateFrom} – {seller.dateTo}</span>
            {seller.daysLeft<=5&&<span style={{fontSize:10,fontWeight:700,color:"#DC2626",fontFamily:F.b}}>({seller.daysLeft} days left)</span>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:14}}>
        {catsForSeller.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${cat===c?seller.color:"#e5e7eb"}`,cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:F.b,whiteSpace:"nowrap",backgroundColor:cat===c?seller.color:"#fff",color:cat===c?"#fff":"#888",transition:"all 0.15s"}}>{c}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {filtered.map(i=><ItemCard key={i.id} item={i}/>)}
      </div>
    </>
  );
}

export default function DropYardBuyerDashboard(){
  const [role,setRole]=useState("buyer");
  const [page,setPage]=useState("discover");
  const [tab,setTab]=useState("all");
  const [cat,setCat]=useState("All");
  const [dedFilter,setDedFilter]=useState(null);
  const [viewSeller,setViewSeller]=useState(null);

  // "All Items" and "This Week's Drop" both show dedicated items alongside regular ones
  const filtered=allItems.filter(item=>{
    if(tab==="drop"&&item.layer==="shelf")return false; // drops tab shows drop + dedicated, not shelf
    if(tab==="shelf"&&item.layer!=="shelf")return false;
    if(tab==="dedicated"&&item.layer!=="dedicated")return false;
    if(cat!=="All"&&item.cat!==cat)return false;
    if(dedFilter&&dedFilter!=="all-ded"&&item.ded!==dedFilter)return false;
    return true;
  });
  const dropCount=allItems.filter(i=>i.layer==="drop").length;
  const dedCount=allItems.filter(i=>i.layer==="dedicated").length;
  const shelfCount=allItems.filter(i=>i.layer==="shelf").length;
  const filteredSellers=dedFilter&&dedFilter!=="all-ded"?dedSellers.filter(s=>s.type===dedFilter):dedSellers;

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}*{box-sizing:border-box;margin:0;padding:0}body{overflow-x:hidden}`}</style>
      <div style={{minHeight:"100vh",backgroundColor:"#F7F7F5",fontFamily:F.b}}>

        {/* TOP NAV */}
        <nav style={{borderBottom:"1px solid #f0f0f0",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>🏡</span><span style={{fontSize:19,fontWeight:900,fontFamily:F.h}}><span style={{color:C.oPrimary}}>Drop</span><span style={{color:C.gPrimary}}>Yard</span></span></div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:50,backgroundColor:C.gLightBg,border:`1px solid ${C.gSoft}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",backgroundColor:"#22C55E",animation:"pulse 2s infinite"}}/><span style={{fontSize:11,fontWeight:800,color:C.oPrimary,fontFamily:F.b}}>Drop is live!</span><span style={{fontSize:10,color:"#999",fontFamily:F.b}}>Claim items now.</span><span style={{fontSize:11,fontWeight:800,color:C.gDark,fontFamily:F.h,backgroundColor:"#fff",padding:"2px 8px",borderRadius:5}}>19h 49m</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
                <button onClick={()=>setRole("seller")} style={{padding:"6px 14px",fontSize:12,fontWeight:role==="seller"?700:500,border:"none",cursor:"pointer",fontFamily:F.b,backgroundColor:role==="seller"?C.gLightBg:"#fff",color:role==="seller"?C.gPrimary:"#bbb"}}>Seller</button>
                <button onClick={()=>setRole("buyer")} style={{padding:"6px 14px",fontSize:12,fontWeight:role==="buyer"?700:500,border:"none",cursor:"pointer",fontFamily:F.b,backgroundColor:role==="buyer"?C.oLightBg:"#fff",color:role==="buyer"?C.oPrimary:"#bbb"}}>Buyer</button>
              </div>
              <div style={{width:34,height:34,borderRadius:"50%",backgroundColor:C.oAccent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:C.oDark,fontFamily:F.h}}>AA</div>
              <span style={{fontSize:12,color:"#999",cursor:"pointer",fontFamily:F.b}}>Sign out</span>
            </div>
          </div>
        </nav>

        {/* BUYER NAV */}
        <div style={{borderBottom:"1px solid #f0f0f0",backgroundColor:"#fff"}}>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex"}}>
              {[{id:"discover",label:"Discover",icon:Compass},{id:"saved",label:"Saved",icon:Heart,badge:"3"},{id:"claims",label:"Claims",icon:ShoppingBag,badge:"1"},{id:"messages",label:"Messages",icon:MessageSquare},{id:"history",label:"History",icon:History}].map(item=>{
                const active=page===item.id;
                return(<button key={item.id} onClick={()=>{setPage(item.id);setViewSeller(null)}} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",border:"none",cursor:"pointer",backgroundColor:"transparent",borderBottom:`2px solid ${active?C.gPrimary:"transparent"}`}}>
                  <item.icon size={15} style={{color:active?C.gPrimary:"#bbb"}}/><span style={{fontSize:13,fontWeight:active?700:500,color:active?C.gPrimary:"#888",fontFamily:F.b}}>{item.label}</span>
                  {item.badge&&<span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20,backgroundColor:active?C.gPrimary:"#f3f4f6",color:active?"#fff":"#bbb"}}>{item.badge}</span>}
                </button>);
              })}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={13} style={{color:C.gPrimary}}/><span style={{fontSize:12,fontWeight:600,color:C.gPrimary,fontFamily:F.b}}>Barrhaven</span></div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{maxWidth:1280,margin:"0 auto",padding:"20px 24px 60px"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:14}}>
            <h1 style={{fontSize:22,fontWeight:900,color:C.gDark,fontFamily:F.h}}>{page==="discover"?"Discover":page==="saved"?"Saved Items":page==="claims"?"My Claims":page==="messages"?"Messages":"History"}</h1>
            <span style={{fontSize:12,color:"#bbb",fontFamily:F.b}}>{tab==="dedicated"&&viewSeller?allItems.filter(i=>i.sellerId===viewSeller).length:filtered.length} items</span>
          </div>

          {/* Layer tabs */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{display:"flex",backgroundColor:"#fff",borderRadius:10,padding:3,border:"1px solid #e5e7eb"}}>
              {[
                {id:"all",label:"All Items",count:allItems.length},
                {id:"drop",label:"This Week's Drop",count:dropCount+dedCount,live:true},
                {id:"dedicated",label:"Dedicated Drops",count:dedCount,ded:true},
                {id:"shelf",label:"On the Shelf",count:shelfCount,shelf:true},
              ].map(t=>(
                <button key={t.id} onClick={()=>{setTab(t.id);setViewSeller(null);if(t.id!=="dedicated")setDedFilter(null)}}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:F.b,transition:"all 0.2s",
                    backgroundColor:tab===t.id?(t.ded?C.tPrimary:t.shelf?C.oPrimary:t.live?C.gDark:C.gPrimary):"transparent",
                    color:tab===t.id?"#fff":"#999"}}>
                  {t.live&&tab===t.id&&<div style={{width:5,height:5,borderRadius:"50%",backgroundColor:"#22C55E",boxShadow:"0 0 5px #22C55E",animation:"pulse 2s infinite"}}/>}
                  {t.shelf&&<Package size={11}/>}{t.ded&&<Tag size={11}/>}
                  {t.label}<span style={{fontSize:9,fontWeight:800,padding:"1px 5px",borderRadius:20,backgroundColor:tab===t.id?"rgba(255,255,255,0.2)":"#f0f0f0",color:tab===t.id?"rgba(255,255,255,0.8)":"#ccc"}}>{t.count}</span>
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,border:"1px solid #e5e7eb",backgroundColor:"#fff",width:200}}>
                <Search size={13} style={{color:"#d1d5db"}}/><input placeholder="Search items..." style={{border:"none",outline:"none",flex:1,fontSize:11,color:C.gDark,fontFamily:F.b,backgroundColor:"transparent"}}/>
              </div>
              <select style={{padding:"6px 10px",borderRadius:7,border:"1px solid #e5e7eb",fontSize:11,fontWeight:600,color:"#777",backgroundColor:"#fff",cursor:"pointer",fontFamily:F.b}}>
                <option>Newest</option><option>Price: Low → High</option><option>Price: High → Low</option><option>Nearest</option>
              </select>
            </div>
          </div>

          {/* DEDICATED DROPS TAB */}
          {tab==="dedicated"&&!viewSeller&&<>
            <div style={{display:"flex",gap:6,marginBottom:16}}>
              {dedTypes.map(dt=><button key={dt.id} onClick={()=>setDedFilter(dedFilter===dt.id?null:dt.id)}
                style={{display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:F.b,
                  backgroundColor:dedFilter===dt.id?dt.color:"#fff",color:dedFilter===dt.id?"#fff":dt.color,
                  border:`1.5px solid ${dedFilter===dt.id?dt.color:dt.color+"30"}`}}>
                {dt.label}<span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:20,backgroundColor:dedFilter===dt.id?"rgba(255,255,255,0.2)":"#f0f0f0",color:dedFilter===dt.id?"rgba(255,255,255,0.7)":"#ccc"}}>{dt.id==="all-ded"?dedSellers.length:dedSellers.filter(s=>s.type===dt.id).length}</span>
              </button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16,marginBottom:24}}>
              {filteredSellers.map(s=><SellerCard key={s.id} seller={s} onView={setViewSeller}/>)}
            </div>
            <p style={{fontSize:10,fontWeight:800,color:"#ccc",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10,fontFamily:F.b}}>All Dedicated Items</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{filtered.map(i=><ItemCard key={i.id} item={i}/>)}</div>
          </>}
          {tab==="dedicated"&&viewSeller&&<SellerDetailView sellerId={viewSeller} onBack={()=>setViewSeller(null)}/>}

          {/* Banners for drop/shelf */}
          {tab==="drop"&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderRadius:10,marginBottom:12,background:`linear-gradient(135deg,${C.gDark},${C.gHover})`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:6,height:6,borderRadius:"50%",backgroundColor:"#22C55E",boxShadow:"0 0 6px #22C55E",animation:"pulse 2s infinite"}}/><span style={{color:"#fff",fontSize:13,fontWeight:700,fontFamily:F.h}}>Barrhaven Drop is LIVE</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontFamily:F.b}}>Includes featured Dedicated Drops</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:6,backgroundColor:"rgba(255,255,255,0.1)"}}><Clock size={11} style={{color:C.gAccent}}/><span style={{color:"#fff",fontSize:11,fontWeight:800,fontFamily:F.h}}>19h 49m left</span></div>
          </div>}
          {tab==="shelf"&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderRadius:10,marginBottom:12,backgroundColor:C.oLightBg,border:`1px solid ${C.oSoft}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><Package size={14} style={{color:C.oPrimary}}/><span style={{color:C.gDark,fontSize:13,fontWeight:700,fontFamily:F.h}}>The Shelf</span><span style={{color:"#999",fontSize:11,fontFamily:F.b}}>Available now. No countdown.</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><TrendingDown size={11} style={{color:"#DC2626"}}/><span style={{fontSize:11,fontWeight:600,color:"#DC2626",fontFamily:F.b}}>{allItems.filter(i=>i.priceDrop).length} price drops</span></div>
          </div>}

          {/* Categories for non-dedicated */}
          {tab!=="dedicated"&&<div style={{display:"flex",gap:4,marginBottom:14,overflow:"auto"}}>
            {categories.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${cat===c?C.gDark:"#e5e7eb"}`,cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:F.b,whiteSpace:"nowrap",backgroundColor:cat===c?C.gDark:"#fff",color:cat===c?"#fff":"#888"}}>{c}</button>)}
          </div>}

          {/* ALL ITEMS — Sectioned */}
          {tab==="all"&&<>
            <p style={{fontSize:10,fontWeight:800,color:"#ccc",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10,fontFamily:F.b}}>Within Walking Distance</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:24}}>{filtered.filter(i=>i.layer==="drop"&&parseFloat(i.dist)<=1.5).map(i=><ItemCard key={i.id} item={i}/>)}</div>

            {filtered.some(i=>i.layer==="dedicated")&&<>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <p style={{fontSize:10,fontWeight:800,color:"#ccc",textTransform:"uppercase",letterSpacing:1.5,fontFamily:F.b}}>Dedicated Drops Near You</p>
                <button onClick={()=>{setTab("dedicated");setViewSeller(null)}} style={{fontSize:10,fontWeight:600,color:C.tPrimary,background:"none",border:"none",cursor:"pointer",fontFamily:F.b,display:"flex",alignItems:"center",gap:3}}>View All <ChevronRight size={11}/></button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:24}}>{filtered.filter(i=>i.layer==="dedicated").slice(0,4).map(i=><ItemCard key={i.id} item={i}/>)}</div>
            </>}

            <p style={{fontSize:10,fontWeight:800,color:"#ccc",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10,fontFamily:F.b}}>More from This Drop</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:24}}>{filtered.filter(i=>i.layer==="drop"&&parseFloat(i.dist)>1.5).map(i=><ItemCard key={i.id} item={i}/>)}</div>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <p style={{fontSize:10,fontWeight:800,color:"#ccc",textTransform:"uppercase",letterSpacing:1.5,fontFamily:F.b}}>On the Shelf</p>
              <button onClick={()=>setTab("shelf")} style={{fontSize:10,fontWeight:600,color:C.oPrimary,background:"none",border:"none",cursor:"pointer",fontFamily:F.b,display:"flex",alignItems:"center",gap:3}}>View All <ChevronRight size={11}/></button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{filtered.filter(i=>i.layer==="shelf").slice(0,5).map(i=><ItemCard key={i.id} item={i}/>)}</div>
          </>}

          {/* Drop tab grid (includes dedicated) */}
          {tab==="drop"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{filtered.map(i=><ItemCard key={i.id} item={i}/>)}</div>}
          {tab==="shelf"&&filtered.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>{filtered.map(i=><ItemCard key={i.id} item={i}/>)}</div>}
          {(tab==="drop"||tab==="shelf")&&filtered.length===0&&<div style={{textAlign:"center",padding:"60px 20px"}}><span style={{fontSize:40}}>🔍</span><p style={{fontSize:15,fontWeight:700,color:C.gDark,marginTop:10,fontFamily:F.h}}>No items found</p></div>}

          {/* Sell with AI */}
          <div style={{marginTop:28,padding:18,borderRadius:14,backgroundColor:"#fff",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${C.ai},#6D28D9)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Sparkles size={18} style={{color:"#fff"}}/></div>
              <div><p style={{fontSize:13,fontWeight:800,color:C.gDark,fontFamily:F.h}}>Got stuff to sell?</p><p style={{fontSize:11,color:"#999",fontFamily:F.b}}>Let AI create your listings from photos. 5 free/month.</p></div>
            </div>
            <button style={{display:"flex",alignItems:"center",gap:5,padding:"9px 18px",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${C.ai},#6D28D9)`,color:"#fff",fontSize:12,fontWeight:700,fontFamily:F.b}}><Sparkles size={12}/> Sell with AI <ArrowRight size={12}/></button>
          </div>
        </div>
      </div>
    </>
  );
}
