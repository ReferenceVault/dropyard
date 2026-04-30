"use client";
import { useState } from "react";
import {
  Heart, Clock, MapPin, Package, ChevronRight, ChevronDown,
  Compass, ShoppingBag, MessageSquare, History as HistoryIcon,
  Sparkles, Star, Check, Tag, Truck, Home, DollarSign,
  TrendingDown, Award, ShoppingCart, Repeat
} from "lucide-react";

const C = {
  gLightBg:"#ECFDF5",gSoft:"#D1FAE5",gAccent:"#6EE7B7",
  gPrimary:"#1F7A4D",gHover:"#17603D",gDark:"#0F3D2A",
  oLightBg:"#FFF7ED",oSoft:"#FED7AA",oAccent:"#FDBA74",
  oPrimary:"#F08A00",oHover:"#C96F00",oDark:"#7A4300",
  tPrimary:"#0F766E",tLight:"#CCFBF1",
  ai:"#7C3AED",aiLight:"#F5F3FF",
};
const F={h:"'Outfit',sans-serif",b:"'Plus Jakarta Sans',sans-serif"};

const transactions = [
  // APRIL 2026
  {id:"t1",item:"Solid Oak Dining Table",price:350,origPrice:900,img:"🪵",cat:"Furniture",seller:"Jane D.",neighbourhood:"Bridlewood",dist:"1.2 km",pickupDate:"Apr 13, 2026",layer:"drop",rated:false,rating:null},
  {id:"t2",item:"Kids' Bicycle — 16\"",price:30,origPrice:null,img:"🚲",cat:"Sports",seller:"Tom R.",neighbourhood:"Barrhaven",dist:"0.3 km",pickupDate:"Apr 13, 2026",layer:"drop",rated:false,rating:null},
  {id:"t3",item:"Yoga Mat + Bands",price:15,origPrice:null,img:"🧘",cat:"Sports",seller:"Chloe D.",neighbourhood:"Barrhaven",dist:"0.6 km",pickupDate:"Apr 8, 2026",layer:"shelf",rated:true,rating:5},
  {id:"t4",item:"Full Bedroom Set — Queen",price:550,origPrice:800,img:"🛏️",cat:"Furniture",seller:"The Patel Family",neighbourhood:"Barrhaven South",dist:"1.5 km",pickupDate:"Apr 6, 2026",layer:"dedicated",dedType:"moving",rated:true,rating:5},
  // MARCH 2026
  {id:"t5",item:"IKEA KALLAX Shelf",price:35,origPrice:null,img:"📚",cat:"Furniture",seller:"Mike T.",neighbourhood:"Barrhaven",dist:"2 km",pickupDate:"Mar 29, 2026",layer:"drop",rated:true,rating:4},
  {id:"t6",item:"Winter Boots — Size 10",price:25,origPrice:60,img:"🥾",cat:"Clothing",seller:"Raj P.",neighbourhood:"Barrhaven",dist:"0.9 km",pickupDate:"Mar 22, 2026",layer:"drop",rated:true,rating:5},
  {id:"t7",item:"Cuisinart Coffee Maker",price:20,origPrice:25,img:"☕",cat:"Kitchen",seller:"Sarah L.",neighbourhood:"Barrhaven",dist:"1.2 km",pickupDate:"Mar 15, 2026",layer:"drop",rated:true,rating:4},
  // FEBRUARY 2026
  {id:"t8",item:"Standing Desk — Adjustable",price:140,origPrice:175,img:"🖥️",cat:"Furniture",seller:"David N.",neighbourhood:"Barrhaven",dist:"2.4 km",pickupDate:"Feb 22, 2026",layer:"shelf",rated:true,rating:5},
  {id:"t9",item:"Box of Kitchen Utensils",price:10,origPrice:null,img:"🍴",cat:"Kitchen",seller:"Omar H.",neighbourhood:"Barrhaven",dist:"1.1 km",pickupDate:"Feb 15, 2026",layer:"drop",rated:true,rating:3},
  {id:"t10",item:"Vintage Record Player",price:90,origPrice:null,img:"🎵",cat:"Electronics",seller:"Estate of M. Williams",neighbourhood:"Half Moon Bay",dist:"3.2 km",pickupDate:"Feb 8, 2026",layer:"dedicated",dedType:"estate",rated:true,rating:5},
  // JANUARY 2026
  {id:"t11",item:"Samsung Galaxy Tab A7",price:65,origPrice:80,img:"📲",cat:"Electronics",seller:"Mike T.",neighbourhood:"Barrhaven",dist:"2 km",pickupDate:"Jan 25, 2026",layer:"shelf",rated:true,rating:4},
  // ── 2025 ──
  // DECEMBER 2025
  {id:"t12",item:"Christmas Tree — 7ft Artificial",price:40,origPrice:120,img:"🎄",cat:"Décor",seller:"Linda M.",neighbourhood:"Barrhaven",dist:"0.8 km",pickupDate:"Dec 14, 2025",layer:"drop",rated:true,rating:5},
  {id:"t13",item:"Nintendo Switch + 3 Games",price:180,origPrice:300,img:"🎮",cat:"Electronics",seller:"Kevin W.",neighbourhood:"Stonebridge",dist:"1.9 km",pickupDate:"Dec 7, 2025",layer:"drop",rated:true,rating:5},
  // NOVEMBER 2025
  {id:"t14",item:"Snow Blower — Electric",price:95,origPrice:200,img:"❄️",cat:"Tools",seller:"Paul F.",neighbourhood:"Half Moon Bay",dist:"3.1 km",pickupDate:"Nov 22, 2025",layer:"drop",rated:true,rating:4},
  {id:"t15",item:"Kids' Snowsuit — Size 4",price:15,origPrice:50,img:"🧣",cat:"Clothing",seller:"Anna W.",neighbourhood:"Barrhaven",dist:"2.1 km",pickupDate:"Nov 15, 2025",layer:"shelf",rated:true,rating:5},
  // OCTOBER 2025
  {id:"t16",item:"Patio Chair Set (4 chairs)",price:60,origPrice:160,img:"🪑",cat:"Furniture",seller:"Chris B.",neighbourhood:"Stonebridge",dist:"0.7 km",pickupDate:"Oct 18, 2025",layer:"dedicated",dedType:"garage",rated:true,rating:4},
  // SEPTEMBER 2025
  {id:"t17",item:"Bookshelf — 5-Tier Oak",price:45,origPrice:null,img:"📖",cat:"Furniture",seller:"Priya M.",neighbourhood:"Barrhaven",dist:"0.5 km",pickupDate:"Sep 27, 2025",layer:"drop",rated:true,rating:5},
  {id:"t18",item:"Instant Pot — 6 Quart",price:30,origPrice:70,img:"🍲",cat:"Kitchen",seller:"Chloe D.",neighbourhood:"Barrhaven",dist:"0.6 km",pickupDate:"Sep 13, 2025",layer:"drop",rated:true,rating:4},
];

function getMonth(dateStr){
  const d=new Date(dateStr);
  return d.toLocaleDateString("en-US",{month:"long",year:"numeric"});
}
function getYear(dateStr){
  return new Date(dateStr).getFullYear();
}
function getMonthOnly(dateStr){
  return new Date(dateStr).toLocaleDateString("en-US",{month:"long"});
}

/* ═══ STAR RATING ═══ */
function StarRating({rating,onRate,interactive}){
  const [hover,setHover]=useState(0);
  return(
    <div style={{display:"flex",gap:2}}>
      {[1,2,3,4,5].map(s=>(
        <button key={s}
          onClick={()=>interactive&&onRate&&onRate(s)}
          onMouseEnter={()=>interactive&&setHover(s)}
          onMouseLeave={()=>interactive&&setHover(0)}
          style={{border:"none",background:"none",cursor:interactive?"pointer":"default",padding:0}}>
          <Star size={interactive?18:14} fill={(hover||rating)>=s?"#FBBF24":"none"} style={{color:(hover||rating)>=s?"#FBBF24":"#D1D5DB"}}/>
        </button>
      ))}
    </div>
  );
}

/* ═══ TRANSACTION ROW ═══ */
function TransactionRow({tx,onRate}){
  const [showReview,setShowReview]=useState(false);
  const [reviewRating,setReviewRating]=useState(0);
  const [reviewText,setReviewText]=useState("");
  const saved=tx.origPrice?tx.origPrice-tx.price:0;
  const dedInfo=tx.dedType==="moving"?{l:"Moving Sale",c:C.tPrimary,ic:"🚚"}:tx.dedType==="estate"?{l:"Estate Sale",c:"#7C3AED",ic:"🏠"}:tx.dedType==="garage"?{l:"Garage Sale",c:C.oPrimary,ic:"🏷️"}:null;

  return(
    <div style={{padding:"14px 16px",borderRadius:14,border:"1px solid #f0f0f0",backgroundColor:"#fff",marginBottom:8,transition:"all 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.04)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        {/* Item icon */}
        <div style={{width:52,height:52,borderRadius:12,backgroundColor:dedInfo?dedInfo.c+"08":tx.layer==="drop"?C.gLightBg:tx.layer==="shelf"?C.oLightBg:"#fafafa",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,border:`1px solid ${dedInfo?dedInfo.c+"15":tx.layer==="drop"?C.gSoft:"#f0f0f0"}`}}>
          {tx.img}
        </div>

        {/* Details */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>{tx.item}</p>
            {/* Layer badge */}
            {dedInfo?<span style={{fontSize:7,fontWeight:700,padding:"2px 6px",borderRadius:4,backgroundColor:dedInfo.c,color:"#fff",fontFamily:F.b}}>{dedInfo.ic} {dedInfo.l.toUpperCase()}</span>
            :tx.layer==="drop"?<span style={{fontSize:7,fontWeight:700,padding:"2px 6px",borderRadius:4,backgroundColor:C.gDark,color:"#fff",fontFamily:F.b}}>DROP</span>
            :<span style={{fontSize:7,fontWeight:700,padding:"2px 6px",borderRadius:4,backgroundColor:C.oPrimary,color:"#fff",fontFamily:F.b}}>SHELF</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
            <span style={{fontSize:11,color:"#999",fontFamily:F.b}}>{tx.seller}</span>
            <span style={{fontSize:11,color:"#ddd"}}>·</span>
            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:11,color:"#999",fontFamily:F.b}}><MapPin size={10}/>{tx.neighbourhood}</span>
            <span style={{fontSize:11,color:"#ddd"}}>·</span>
            <span style={{display:"flex",alignItems:"center",gap:3,fontSize:11,color:"#999",fontFamily:F.b}}><Clock size={10}/>{tx.pickupDate}</span>
          </div>
          {/* Rating */}
          {tx.rated&&<div style={{marginTop:5}}><StarRating rating={tx.rating}/></div>}
        </div>

        {/* Price + saved */}
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:4,justifyContent:"flex-end"}}>
            <span style={{fontSize:20,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${tx.price}</span>
            {tx.origPrice&&<span style={{fontSize:12,color:"#ccc",textDecoration:"line-through",fontFamily:F.b}}>${tx.origPrice}</span>}
          </div>
          {saved>0&&(
            <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"flex-end",marginTop:3}}>
              <TrendingDown size={10} style={{color:C.gPrimary}}/>
              <span style={{fontSize:10,fontWeight:700,color:C.gPrimary,fontFamily:F.b}}>Saved ${saved}</span>
            </div>
          )}
          {/* Review prompt */}
          {!tx.rated&&!showReview&&(
            <button onClick={()=>setShowReview(true)} style={{marginTop:6,padding:"5px 12px",borderRadius:8,border:`1px solid ${C.oPrimary}30`,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.b,backgroundColor:C.oLightBg,color:C.oPrimary,display:"flex",alignItems:"center",gap:4}}>
              <Star size={10}/> Leave a Review
            </button>
          )}
        </div>
      </div>

      {/* Review form (expanded) */}
      {showReview&&!tx.rated&&(
        <div style={{marginTop:12,padding:14,borderRadius:12,backgroundColor:"#fafafa",border:"1px solid #f0f0f0"}}>
          <p style={{fontSize:12,fontWeight:700,color:C.gDark,marginBottom:8,fontFamily:F.b}}>How was your experience with {tx.seller}?</p>
          <StarRating rating={reviewRating} onRate={setReviewRating} interactive/>
          {reviewRating>0&&(
            <>
              <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="Optional — tell your neighbours about the experience..."
                style={{width:"100%",height:60,padding:10,borderRadius:10,border:"1px solid #e5e7eb",fontSize:12,fontFamily:F.b,color:C.gDark,resize:"none",outline:"none",marginTop:8,backgroundColor:"#fff",boxSizing:"border-box"}}/>
              <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
                <button onClick={()=>setShowReview(false)} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #e5e7eb",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:F.b,backgroundColor:"#fff",color:"#777"}}>Cancel</button>
                <button onClick={()=>{tx.rated=true;tx.rating=reviewRating;setShowReview(false)}}
                  style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff"}}>Submit Review</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function HistoryTab(){
  const totalItems=transactions.length;
  const totalSpent=transactions.reduce((a,t)=>a+t.price,0);
  const totalSaved=transactions.reduce((a,t)=>a+(t.origPrice?t.origPrice-t.price:0),0);
  const catCounts={};
  transactions.forEach(t=>{catCounts[t.cat]=(catCounts[t.cat]||0)+1});
  const topCat=Object.entries(catCounts).sort((a,b)=>b[1]-a[1])[0];
  const unratedCount=transactions.filter(t=>!t.rated).length;

  // Group by year, then by month within each year
  const currentYear=2026;
  const yearMap={};
  transactions.forEach(t=>{
    const y=getYear(t.pickupDate);
    const m=getMonthOnly(t.pickupDate);
    if(!yearMap[y])yearMap[y]={};
    if(!yearMap[y][m])yearMap[y][m]=[];
    yearMap[y][m].push(t);
  });
  const years=Object.keys(yearMap).sort((a,b)=>b-a).map(Number);

  const [collapsed,setCollapsed]=useState(()=>{
    // Previous years start collapsed, current year expanded
    const init={};
    years.forEach(y=>{if(y!==currentYear)init[`year-${y}`]=true});
    return init;
  });
  const toggle=(key)=>setCollapsed(p=>({...p,[key]:!p[key]}));

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{minHeight:"100vh",backgroundColor:"#F7F7F5",fontFamily:F.b}}>

        {/* Top nav */}
        <nav style={{borderBottom:"1px solid #f0f0f0",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:22}}>🏡</span><span style={{fontSize:19,fontWeight:900,fontFamily:F.h}}><span style={{color:C.oPrimary}}>Drop</span><span style={{color:C.gPrimary}}>Yard</span></span></div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:50,backgroundColor:C.gLightBg,border:`1px solid ${C.gSoft}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",backgroundColor:"#22C55E",animation:"pulse 2s infinite"}}/><span style={{fontSize:11,fontWeight:800,color:C.oPrimary,fontFamily:F.b}}>Drop is live!</span><span style={{fontSize:11,fontWeight:800,color:C.gDark,fontFamily:F.h,backgroundColor:"#fff",padding:"2px 8px",borderRadius:5}}>19h 49m</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb"}}>
                <button style={{padding:"6px 14px",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F.b,backgroundColor:"#fff",color:"#bbb"}}>Seller</button>
                <button style={{padding:"6px 14px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:F.b,backgroundColor:C.oLightBg,color:C.oPrimary}}>Buyer</button>
              </div>
              <div style={{width:34,height:34,borderRadius:"50%",backgroundColor:C.oAccent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:C.oDark,fontFamily:F.h}}>AA</div>
            </div>
          </div>
        </nav>

        {/* Buyer nav */}
        <div style={{borderBottom:"1px solid #f0f0f0",backgroundColor:"#fff"}}>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex"}}>
              {[{id:"discover",label:"Discover",icon:Compass},{id:"saved",label:"Saved",icon:Heart,badge:"3"},{id:"claims",label:"Claims",icon:ShoppingBag,badge:"1"},{id:"messages",label:"Messages",icon:MessageSquare},{id:"history",label:"History",icon:HistoryIcon,active:true}].map(item=>(
                <button key={item.id} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",border:"none",cursor:"pointer",backgroundColor:"transparent",borderBottom:`2px solid ${item.active?C.gPrimary:"transparent"}`}}>
                  <item.icon size={15} style={{color:item.active?C.gPrimary:"#bbb"}}/><span style={{fontSize:13,fontWeight:item.active?700:500,color:item.active?C.gPrimary:"#888",fontFamily:F.b}}>{item.label}</span>
                  {item.badge&&<span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20,backgroundColor:"#f3f4f6",color:"#bbb"}}>{item.badge}</span>}
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={13} style={{color:C.gPrimary}}/><span style={{fontSize:12,fontWeight:600,color:C.gPrimary,fontFamily:F.b}}>Barrhaven</span></div>
          </div>
        </div>

        {/* Content */}
        <div style={{maxWidth:900,margin:"0 auto",padding:"24px 24px 60px"}}>
          <h1 style={{fontSize:22,fontWeight:900,color:C.gDark,marginBottom:20,fontFamily:F.h}}>Purchase History</h1>

          {/* ═══ STATS STRIP ═══ */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
            {[
              {label:"Items Bought",value:totalItems,icon:ShoppingCart,color:C.gPrimary,bg:C.gLightBg},
              {label:"Total Spent",value:`$${totalSpent.toLocaleString()}`,icon:DollarSign,color:C.oPrimary,bg:C.oLightBg},
              {label:"Total Saved",value:`$${totalSaved.toLocaleString()}`,icon:TrendingDown,color:C.gPrimary,bg:C.gLightBg,sub:"vs original prices"},
              {label:"Top Category",value:topCat?topCat[0]:"—",icon:Award,color:C.ai,bg:C.aiLight,sub:topCat?`${topCat[1]} items`:null},
            ].map((s,i)=>(
              <div key={i} style={{padding:16,borderRadius:14,border:"1px solid #f0f0f0",backgroundColor:"#fff"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{width:36,height:36,borderRadius:10,backgroundColor:s.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><s.icon size={16} style={{color:s.color}}/></div>
                  {s.sub&&<span style={{fontSize:9,color:"#ccc",fontFamily:F.b}}>{s.sub}</span>}
                </div>
                <p style={{fontSize:22,fontWeight:900,color:s.color,fontFamily:F.h}}>{s.value}</p>
                <p style={{fontSize:11,color:"#999",marginTop:2,fontFamily:F.b}}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Unrated prompt */}
          {unratedCount>0&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderRadius:12,backgroundColor:C.oLightBg,border:`1px solid ${C.oSoft}`,marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Star size={16} style={{color:C.oPrimary}}/>
                <p style={{fontSize:13,fontWeight:700,color:C.gDark,fontFamily:F.b}}>You have {unratedCount} unrated {unratedCount===1?"purchase":"purchases"}</p>
                <p style={{fontSize:11,color:"#999",fontFamily:F.b}}>Reviews help your neighbours build trust.</p>
              </div>
              <ChevronDown size={14} style={{color:C.oPrimary}}/>
            </div>
          )}

          {/* ═══ YEAR → MONTH TIMELINE ═══ */}
          {years.map(year=>{
            const yearTxs=transactions.filter(t=>getYear(t.pickupDate)===year);
            const yearSpent=yearTxs.reduce((a,t)=>a+t.price,0);
            const yearSaved=yearTxs.reduce((a,t)=>a+(t.origPrice?t.origPrice-t.price:0),0);
            const yearCollapsed=collapsed[`year-${year}`];
            const isCurrent=year===currentYear;
            const monthsInYear=Object.keys(yearMap[year]);

            return(
              <div key={year} style={{marginBottom:isCurrent?8:16}}>
                {/* Year header */}
                <button onClick={()=>toggle(`year-${year}`)}
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:isCurrent?"6px 0":"14px 18px",
                    borderRadius:isCurrent?0:14,border:"none",cursor:"pointer",
                    backgroundColor:isCurrent?"transparent":yearCollapsed?"#fff":"#fafafa",
                    border:isCurrent?"none":`1.5px solid ${yearCollapsed?"#e5e7eb":"#e5e7eb"}`,
                    marginBottom:yearCollapsed?0:isCurrent?8:12,transition:"all 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    {!isCurrent&&<span style={{fontSize:20}}>📅</span>}
                    <div style={{textAlign:"left"}}>
                      <span style={{fontSize:isCurrent?12:18,fontWeight:900,color:isCurrent?"#bbb":C.gDark,fontFamily:F.h,letterSpacing:isCurrent?1.5:0,textTransform:isCurrent?"uppercase":"none"}}>
                        {year}
                      </span>
                      {!isCurrent&&<p style={{fontSize:11,color:"#999",marginTop:2,fontFamily:F.b}}>{yearTxs.length} items purchased</p>}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {!isCurrent&&<div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:16,fontWeight:900,color:C.gDark,fontFamily:F.h}}>${yearSpent}</span>
                        <p style={{fontSize:10,color:"#bbb",fontFamily:F.b}}>spent</p>
                      </div>
                      {yearSaved>0&&<div style={{textAlign:"right"}}>
                        <span style={{fontSize:14,fontWeight:800,color:C.gPrimary,fontFamily:F.h}}>${yearSaved}</span>
                        <p style={{fontSize:10,color:C.gPrimary,fontFamily:F.b}}>saved</p>
                      </div>}
                    </div>}
                    <ChevronDown size={16} style={{color:isCurrent?"#ddd":"#bbb",transform:yearCollapsed?"rotate(-90deg)":"rotate(0)",transition:"transform 0.2s"}}/>
                  </div>
                </button>

                {/* Months within this year */}
                {!yearCollapsed&&monthsInYear.map(month=>{
                  const monthKey=`${year}-${month}`;
                  const items=yearMap[year][month];
                  const monthSpent=items.reduce((a,t)=>a+t.price,0);
                  const monthSaved=items.reduce((a,t)=>a+(t.origPrice?t.origPrice-t.price:0),0);
                  const mCollapsed=collapsed[monthKey];

                  return(
                    <div key={monthKey} style={{marginBottom:10,marginLeft:isCurrent?0:0}}>
                      <button onClick={()=>toggle(monthKey)}
                        style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",
                          backgroundColor:mCollapsed?"#fff":"#fafafa",border:"1px solid #f0f0f0",marginBottom:mCollapsed?0:8,transition:"all 0.15s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:14,fontWeight:800,color:C.gDark,fontFamily:F.h}}>{month}</span>
                          <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:6,backgroundColor:"#f3f4f6",color:"#999",fontFamily:F.b}}>{items.length} {items.length===1?"item":"items"}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <span style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.h}}>${monthSpent}</span>
                          {monthSaved>0&&<span style={{fontSize:10,fontWeight:600,color:C.gPrimary,fontFamily:F.b}}>saved ${monthSaved}</span>}
                          <ChevronDown size={14} style={{color:"#ccc",transform:mCollapsed?"rotate(-90deg)":"rotate(0)",transition:"transform 0.2s"}}/>
                        </div>
                      </button>
                      {!mCollapsed&&<div>{items.map(tx=><TransactionRow key={tx.id} tx={tx}/>)}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* ═══ BOTTOM: Community impact ═══ */}
          <div style={{marginTop:20,padding:20,borderRadius:16,background:`linear-gradient(135deg,${C.gDark},${C.gHover})`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:16,fontWeight:800,color:"#fff",fontFamily:F.h}}>Your Community Impact</p>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4,lineHeight:1.6,fontFamily:F.b}}>
                  You've kept <b style={{color:C.gAccent}}>{totalItems} items</b> out of landfill and saved <b style={{color:C.oAccent}}>${totalSaved}</b> by buying from your neighbours.<br/>Every purchase strengthens your community.
                </p>
              </div>
              <div style={{display:"flex",gap:12,flexShrink:0}}>
                {[
                  {v:totalItems,l:"Items rescued",e:"♻️"},
                  {v:`${Math.round(totalItems*2.5)}kg`,l:"CO₂ avoided",e:"🌱"},
                ].map((s,i)=>(
                  <div key={i} style={{textAlign:"center",padding:"10px 16px",borderRadius:12,backgroundColor:"rgba(255,255,255,0.08)"}}>
                    <span style={{fontSize:20}}>{s.e}</span>
                    <p style={{fontSize:18,fontWeight:900,color:"#fff",fontFamily:F.h,marginTop:4}}>{s.v}</p>
                    <p style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontFamily:F.b}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
