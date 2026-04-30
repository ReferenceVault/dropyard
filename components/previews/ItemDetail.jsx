"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Heart, Eye, Clock, MapPin, Package, Calendar,
  Check, ChevronRight, MessageCircle, Sparkles, Star, Shield,
  Share2, TrendingDown, User, Send, X, CheckCircle, AlertCircle,
  ChevronDown, Tag, Truck, Home, Info
} from "lucide-react";

const C = {
  gLightBg:"#ECFDF5",gSoft:"#D1FAE5",gAccent:"#6EE7B7",
  gPrimary:"#1F7A4D",gHover:"#17603D",gDark:"#0F3D2A",
  oLightBg:"#FFF7ED",oSoft:"#FED7AA",oAccent:"#FDBA74",
  oPrimary:"#F08A00",oHover:"#C96F00",oDark:"#7A4300",
  tPrimary:"#0F766E",tLight:"#CCFBF1",tSoft:"#99F6E4",
  ai:"#7C3AED",aiLight:"#F5F3FF",aiBorder:"#DDD6FE",
  wa:"#25D366",
};
const F={h:"'Outfit',sans-serif",b:"'Plus Jakarta Sans',sans-serif"};

/* ═══ SAMPLE ITEMS — three layer types ═══ */
const sampleItems = {
  drop: {
    id:1, title:"Solid Oak Dining Table", price:350, origPrice:900, condition:"Good", category:"Furniture",
    description:"Beautiful solid oak dining table, seats 6 comfortably. Minor scratches on the surface from regular use — barely noticeable. Comes with a protective table pad. Dimensions: 180cm x 90cm x 76cm.",
    seller:{name:"Jane D.",neighbourhood:"Bridlewood",dist:"1.2 km",items:4,joined:"Jan 2025",rating:4.8},
    img:"🪵", watchers:11, saves:14, layer:"drop", status:"live", timeLeft:"19h 49m",
    questions:[
      {q:"Are the legs removable for transport?",a:"Yes! The legs unscrew easily — you'll need a Phillips screwdriver. Takes about 10 minutes.",by:"Mike T.",ago:"2h ago",aiAnswered:false},
      {q:"What's the weight roughly?",a:"Approximately 35kg. Two people can carry it comfortably.",by:"Sarah L.",ago:"5h ago",aiAnswered:true},
    ]
  },
  shelf: {
    id:12, title:"Samsung Galaxy Tab A7 — 32GB", price:65, origPrice:80, condition:"Fair", category:"Electronics",
    description:"10.4\" Samsung tablet with case. Light scratches on screen from normal use. Battery holds charge well (6–7 hours). Includes original charger and a bonus case. Great for kids or casual browsing.",
    seller:{name:"Mike T.",neighbourhood:"Barrhaven",dist:"2 km",items:3,joined:"Mar 2025",rating:4.5},
    img:"📲", watchers:4, saves:4, layer:"shelf", daysListed:10, priceDrop:true,
    questions:[]
  },
  dedicated: {
    id:6, title:"Full Bedroom Set — Queen", price:600, origPrice:800, condition:"Good", category:"Furniture",
    description:"Complete queen bedroom set: bed frame with headboard, mattress (firm), 2 nightstands, and a 6-drawer dresser with mirror. Solid construction, well-maintained. Mattress has a protective cover — no stains.",
    seller:{name:"The Patel Family",neighbourhood:"Barrhaven South",dist:"1.5 km",items:12,joined:"Apr 2025",rating:null,dedType:"moving",dedBadge:"🚚 Moving Sale",dedDate:"Apr 5 – Apr 20",daysLeft:8},
    img:"🛏️", watchers:31, saves:31, layer:"dedicated",
    questions:[
      {q:"Can I see the mattress before claiming?",a:"Of course! You can arrange a preview during pickup hours. Just claim it first and we'll coordinate a time.",by:"Priya M.",ago:"1d ago",aiAnswered:true},
    ]
  }
};

/* ═══ CLAIM MODAL ═══ */
function ClaimModal({item, onClose, onConfirm}){
  const [step,setStep]=useState("confirm"); // confirm, pickup, done
  const [slot,setSlot]=useState(null);
  const [whatsapp,setWhatsapp]=useState(true);
  const isDed=item.layer==="dedicated";
  const seller=item.seller;

  const slots = isDed ? [
    {id:1,day:"Saturday, Apr 13",times:["10am–12pm","12pm–2pm","2pm–4pm"]},
    {id:2,day:"Sunday, Apr 14",times:["10am–12pm","12pm–2pm"]},
    {id:3,day:"Monday, Apr 15",times:["5pm–7pm"]},
  ] : [
    {id:1,day:"Saturday, Apr 13",times:["10am–12pm","12pm–3pm","3pm–6pm"]},
    {id:2,day:"Sunday, Apr 14",times:["10am–1pm","1pm–4pm"]},
  ];

  return(
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}>
      <div style={{width:480,maxHeight:"90vh",overflow:"auto",borderRadius:20,backgroundColor:"#fff",boxShadow:"0 24px 80px rgba(0,0,0,0.15)"}}>
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h3 style={{fontSize:16,fontWeight:800,color:C.gDark,fontFamily:F.h}}>
            {step==="confirm"?"Claim This Item":step==="pickup"?"Choose Pickup Time":"You're All Set!"}
          </h3>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",backgroundColor:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16} style={{color:"#999"}}/></button>
        </div>

        {/* Item summary */}
        <div style={{padding:"16px 20px",display:"flex",gap:12,alignItems:"center",borderBottom:"1px solid #f5f5f5"}}>
          <div style={{width:56,height:56,borderRadius:12,backgroundColor:"#fafafa",border:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{item.img}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>{item.title}</p>
            <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}>
              <span style={{fontSize:18,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${item.price}</span>
              {item.origPrice&&<span style={{fontSize:12,color:"#ccc",textDecoration:"line-through"}}>${item.origPrice}</span>}
            </div>
          </div>
        </div>

        {/* STEP 1: Confirm */}
        {step==="confirm"&&<div style={{padding:"16px 20px"}}>
          <div style={{padding:14,borderRadius:12,backgroundColor:C.gLightBg,border:`1px solid ${C.gSoft}`,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <Info size={16} style={{color:C.gPrimary,marginTop:2,flexShrink:0}}/>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.b}}>How claiming works</p>
                <p style={{fontSize:11,color:"#777",lineHeight:1.6,marginTop:4,fontFamily:F.b}}>
                  Claiming reserves this item for you. You'll choose a pickup time and receive the seller's location. If you can't make it, cancel at least 2 hours before so someone else can claim.
                </p>
              </div>
            </div>
          </div>

          {/* Offer at listed price */}
          <div style={{padding:14,borderRadius:12,border:"1px solid #f0f0f0",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <p style={{fontSize:13,fontWeight:700,color:C.gDark,fontFamily:F.b}}>Claim at listed price</p>
              <p style={{fontSize:11,color:"#999",fontFamily:F.b}}>Instant confirmation — no negotiation</p>
            </div>
            <span style={{fontSize:20,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${item.price}</span>
          </div>

          {/* Make an offer */}
          <div style={{padding:14,borderRadius:12,border:"1px solid #f0f0f0",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <p style={{fontSize:13,fontWeight:700,color:C.gDark,fontFamily:F.b}}>Or make an offer</p>
                <p style={{fontSize:11,color:"#999",fontFamily:F.b}}>The seller (or their AI agent) will respond</p>
              </div>
              <Sparkles size={14} style={{color:C.ai}}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:4,padding:"8px 14px",borderRadius:10,border:"1px solid #e5e7eb",backgroundColor:"#fafafa",flex:1}}>
                <span style={{fontSize:14,fontWeight:700,color:"#999"}}>$</span>
                <input placeholder="Your offer" style={{border:"none",outline:"none",flex:1,fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h,backgroundColor:"transparent"}}/>
              </div>
              <button style={{padding:"10px 20px",borderRadius:10,border:"none",cursor:"pointer",backgroundColor:C.oPrimary,color:"#fff",fontSize:12,fontWeight:700,fontFamily:F.b}}>Send Offer</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,padding:"6px 10px",borderRadius:8,backgroundColor:C.aiLight}}>
              <Sparkles size={10} style={{color:C.ai}}/>
              <p style={{fontSize:10,color:C.ai,fontFamily:F.b}}>This seller uses an AI agent — you'll get a response within seconds</p>
            </div>
          </div>

          <button onClick={()=>setStep("pickup")} style={{width:"100%",padding:"14px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff",boxShadow:`0 4px 16px ${C.gPrimary}30`}}>
            Claim at ${item.price} <ArrowLeft size={14} style={{transform:"rotate(180deg)",display:"inline",verticalAlign:"middle",marginLeft:6}}/>
          </button>
        </div>}

        {/* STEP 2: Pickup */}
        {step==="pickup"&&<div style={{padding:"16px 20px"}}>
          <p style={{fontSize:13,fontWeight:700,color:C.gDark,marginBottom:12,fontFamily:F.h}}>When can you pick up?</p>
          {slots.map(day=>(
            <div key={day.id} style={{marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:700,color:"#999",marginBottom:6,fontFamily:F.b}}>{day.day}</p>
              <div style={{display:"flex",gap:6}}>
                {day.times.map(t=>(
                  <button key={t} onClick={()=>setSlot(`${day.day} ${t}`)}
                    style={{flex:1,padding:"10px 0",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:F.b,
                      backgroundColor:slot===`${day.day} ${t}`?C.gPrimary:"#fff",
                      color:slot===`${day.day} ${t}`?"#fff":"#666",
                      border:`1.5px solid ${slot===`${day.day} ${t}`?C.gPrimary:"#e5e7eb"}`}}>
                    {slot===`${day.day} ${t}`&&<Check size={11} style={{marginRight:4,verticalAlign:"middle"}}/>}{t}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* WhatsApp toggle */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:12,borderRadius:12,backgroundColor:"#F0FFF4",border:`1px solid ${C.wa}20`,marginTop:4,marginBottom:16}}>
            <div style={{width:28,height:28,borderRadius:8,backgroundColor:C.wa,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><MessageCircle size={14} style={{color:"#fff"}}/></div>
            <div style={{flex:1}}>
              <p style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.b}}>WhatsApp reminders</p>
              <p style={{fontSize:10,color:"#777",fontFamily:F.b}}>Get pickup time and address on WhatsApp</p>
            </div>
            <button onClick={()=>setWhatsapp(!whatsapp)} style={{width:44,height:26,borderRadius:20,padding:2,border:"none",cursor:"pointer",backgroundColor:whatsapp?C.wa:"#D1D5DB",transition:"all 0.2s"}}>
              <div style={{width:22,height:22,borderRadius:"50%",backgroundColor:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)",transform:whatsapp?"translateX(18px)":"translateX(0)",transition:"transform 0.2s"}}/>
            </button>
          </div>

          <button onClick={()=>setStep("done")} disabled={!slot}
            style={{width:"100%",padding:"14px 0",borderRadius:12,border:"none",cursor:slot?"pointer":"not-allowed",fontSize:14,fontWeight:700,fontFamily:F.b,
              backgroundColor:slot?C.gPrimary:"#e5e7eb",color:slot?"#fff":"#bbb",boxShadow:slot?`0 4px 16px ${C.gPrimary}30`:"none"}}>
            Confirm Pickup Time
          </button>
        </div>}

        {/* STEP 3: Done */}
        {step==="done"&&<div style={{padding:"24px 20px",textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:"50%",backgroundColor:C.gLightBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <CheckCircle size={32} style={{color:C.gPrimary}}/>
          </div>
          <h3 style={{fontSize:18,fontWeight:900,color:C.gDark,marginBottom:6,fontFamily:F.h}}>Item Claimed!</h3>
          <p style={{fontSize:13,color:"#777",lineHeight:1.6,marginBottom:20,fontFamily:F.b}}>
            <b>{item.title}</b> is reserved for you at <b>${item.price}</b>.<br/>
            Pickup: <b>{slot}</b>
          </p>
          <div style={{padding:14,borderRadius:12,backgroundColor:"#F0FFF4",border:`1px solid ${C.wa}20`,marginBottom:16,textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:8,backgroundColor:C.wa,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><MessageCircle size={14} style={{color:"#fff"}}/></div>
              <div>
                <p style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.b}}>WhatsApp confirmation sent</p>
                <p style={{fontSize:10,color:"#777",fontFamily:F.b}}>Pickup address and details are in your WhatsApp</p>
              </div>
            </div>
          </div>
          <div style={{padding:14,borderRadius:12,backgroundColor:C.aiLight,border:`1px solid ${C.aiBorder}`,marginBottom:20,textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Sparkles size={14} style={{color:C.ai}}/>
              <p style={{fontSize:11,color:C.ai,fontFamily:F.b}}>The seller's AI agent confirmed your claim and will send a reminder 1 hour before pickup.</p>
            </div>
          </div>
          <button onClick={onClose} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff"}}>
            Done
          </button>
        </div>}
      </div>
    </div>
  );
}

/* ═══ ASK QUESTION MODAL ═══ */
function AskModal({item, onClose}){
  const [q,setQ]=useState("");
  const [sent,setSent]=useState(false);
  return(
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}>
      <div style={{width:440,borderRadius:20,backgroundColor:"#fff",boxShadow:"0 24px 80px rgba(0,0,0,0.15)",overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h3 style={{fontSize:16,fontWeight:800,color:C.gDark,fontFamily:F.h}}>Ask About This Item</h3>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:"none",cursor:"pointer",backgroundColor:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16} style={{color:"#999"}}/></button>
        </div>
        <div style={{padding:"16px 20px"}}>
          <div style={{display:"flex",gap:10,alignItems:"center",padding:12,borderRadius:12,border:"1px solid #f0f0f0",marginBottom:14}}>
            <div style={{width:40,height:40,borderRadius:10,backgroundColor:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.img}</div>
            <div><p style={{fontSize:13,fontWeight:700,color:C.gDark,fontFamily:F.h}}>{item.title}</p><p style={{fontSize:14,fontWeight:800,color:C.gPrimary,fontFamily:F.h}}>${item.price}</p></div>
          </div>

          {!sent ? <>
            <p style={{fontSize:13,fontWeight:700,color:C.gDark,marginBottom:8,fontFamily:F.b}}>Your Question</p>
            <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="E.g., What's the condition? Any scratches? Does it come with accessories?"
              style={{width:"100%",height:100,padding:14,borderRadius:12,border:"1px solid #e5e7eb",fontSize:13,fontFamily:F.b,color:C.gDark,resize:"none",outline:"none",backgroundColor:"#fafafa",boxSizing:"border-box"}}/>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8,padding:"8px 10px",borderRadius:8,backgroundColor:C.aiLight,marginBottom:14}}>
              <Sparkles size={11} style={{color:C.ai,flexShrink:0}}/>
              <p style={{fontSize:10,color:C.ai,lineHeight:1.4,fontFamily:F.b}}>This seller uses an AI agent — your question will be answered instantly. All Q&As are visible to other buyers.</p>
            </div>
            <button onClick={()=>setSent(true)} disabled={!q.trim()}
              style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",cursor:q.trim()?"pointer":"not-allowed",fontSize:13,fontWeight:700,fontFamily:F.b,
                backgroundColor:q.trim()?C.gPrimary:"#e5e7eb",color:q.trim()?"#fff":"#bbb",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Send size={14}/> Submit Question
            </button>
          </> : <>
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{width:48,height:48,borderRadius:"50%",backgroundColor:C.aiLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><Sparkles size={22} style={{color:C.ai}}/></div>
              <p style={{fontSize:14,fontWeight:700,color:C.gDark,marginBottom:4,fontFamily:F.h}}>AI agent is responding...</p>
              <p style={{fontSize:12,color:"#999",fontFamily:F.b}}>You'll see the answer in the Q&A section below the listing.</p>
              <div style={{marginTop:16,padding:12,borderRadius:12,backgroundColor:"#F0FFF4",border:`1px solid ${C.wa}20`,textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                <MessageCircle size={14} style={{color:C.wa}}/>
                <p style={{fontSize:11,color:"#555",fontFamily:F.b}}>You'll also be notified on WhatsApp when the answer is ready.</p>
              </div>
            </div>
            <button onClick={onClose} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff"}}>Got It</button>
          </>}
        </div>
      </div>
    </div>
  );
}

/* ═══ ITEM DETAIL VIEW ═══ */
function ItemDetail({item, onBack}){
  const [saved,setSaved]=useState(false);
  const [showClaim,setShowClaim]=useState(false);
  const [showAsk,setShowAsk]=useState(false);
  const [claimed,setClaimed]=useState(false);
  const isDrop=item.layer==="drop";
  const isDed=item.layer==="dedicated";
  const isShelf=item.layer==="shelf";
  const seller=item.seller;
  const discount=item.origPrice?Math.round((1-item.price/item.origPrice)*100):0;
  const dedInfo=seller.dedType==="moving"?{c:C.tPrimary,bg:C.tLight}:seller.dedType==="estate"?{c:"#7C3AED",bg:"#F5F3FF"}:seller.dedType==="garage"?{c:C.oPrimary,bg:C.oLightBg}:null;
  const accentColor=isDed&&dedInfo?dedInfo.c:isDrop?C.gPrimary:C.oPrimary;

  return(
    <div style={{maxWidth:720,margin:"0 auto",padding:"24px 20px 60px"}}>
      {/* Back */}
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 0",border:"none",cursor:"pointer",backgroundColor:"transparent",fontSize:13,fontWeight:600,color:"#999",fontFamily:F.b,marginBottom:12}}>
        <ArrowLeft size={16}/> Back
      </button>

      {/* Image area */}
      <div style={{height:340,borderRadius:20,backgroundColor:isDed&&dedInfo?dedInfo.bg:isDrop?C.gLightBg:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",border:"1px solid #f0f0f0",marginBottom:20}}>
        <span style={{fontSize:96}}>{item.img}</span>
        {/* Top left badges */}
        <div style={{position:"absolute",top:16,left:16,display:"flex",flexDirection:"column",gap:6}}>
          {discount>0&&<span style={{display:"inline-flex",padding:"5px 12px",borderRadius:10,backgroundColor:"#DC2626",color:"#fff",fontSize:12,fontWeight:800,fontFamily:F.h}}>-{discount}%</span>}
          {isDrop&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,backgroundColor:C.gDark,color:"#fff"}}><div style={{width:6,height:6,borderRadius:"50%",backgroundColor:"#22C55E",boxShadow:"0 0 6px #22C55E",animation:"pulse 2s infinite"}}/><span style={{fontSize:10,fontWeight:800,letterSpacing:0.7,fontFamily:F.b}}>LIVE DROP</span></div>}
          {isDed&&dedInfo&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,backgroundColor:dedInfo.c,color:"#fff"}}><span style={{fontSize:10}}>{seller.dedBadge?.split(" ")[0]}</span><span style={{fontSize:10,fontWeight:800,letterSpacing:0.7,fontFamily:F.b}}>{seller.dedType?.toUpperCase()} SALE</span></div>}
          {isShelf&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,backgroundColor:C.oPrimary,color:"#fff"}}><Package size={11}/><span style={{fontSize:10,fontWeight:800,letterSpacing:0.7,fontFamily:F.b}}>ON THE SHELF</span></div>}
          {item.priceDrop&&<div style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:10,backgroundColor:"#DC2626",color:"#fff"}}><TrendingDown size={11}/><span style={{fontSize:10,fontWeight:800,fontFamily:F.b}}>PRICE DROP</span></div>}
        </div>
        {/* Top right */}
        <div style={{position:"absolute",top:16,right:16,display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:10,backgroundColor:"rgba(255,255,255,0.9)",backdropFilter:"blur(4px)",border:"1px solid rgba(0,0,0,0.06)"}}>
          <Eye size={12} style={{color:"#999"}}/><span style={{fontSize:11,fontWeight:700,color:"#666",fontFamily:F.b}}>{item.watchers} watching</span>
        </div>
      </div>

      {/* Title + price + actions */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
        <h1 style={{fontSize:24,fontWeight:900,color:C.gDark,fontFamily:F.h,lineHeight:1.2,flex:1}}>{item.title}</h1>
        <div style={{display:"flex",gap:8,flexShrink:0,marginLeft:12}}>
          <button onClick={()=>setSaved(!saved)} style={{width:40,height:40,borderRadius:12,border:"1px solid #e5e7eb",backgroundColor:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Heart size={18} fill={saved?"#EF4444":"none"} style={{color:saved?"#EF4444":"#ccc"}}/>
          </button>
          <button style={{width:40,height:40,borderRadius:12,border:"1px solid #e5e7eb",backgroundColor:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Share2 size={16} style={{color:"#ccc"}}/>
          </button>
        </div>
      </div>

      {/* Price */}
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:16}}>
        <span style={{fontSize:32,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${item.price}</span>
        {item.origPrice&&<span style={{fontSize:16,color:"#ccc",textDecoration:"line-through",fontFamily:F.b}}>${item.origPrice}</span>}
        {item.origPrice&&<span style={{fontSize:12,fontWeight:700,padding:"3px 8px",borderRadius:8,backgroundColor:"#FEE2E2",color:"#DC2626",fontFamily:F.b}}>Save ${item.origPrice-item.price}</span>}
      </div>

      {/* Seller info card */}
      <div style={{padding:16,borderRadius:16,border:`1.5px solid ${accentColor}20`,backgroundColor:isDed&&dedInfo?dedInfo.bg+"80":"#fff",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,backgroundColor:accentColor+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:accentColor,fontFamily:F.h,flexShrink:0}}>
            {seller.name.charAt(0)}{seller.name.split(" ").pop()?.charAt(0)}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>{seller.name}</p>
              {isDed&&seller.dedBadge&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:6,backgroundColor:accentColor,color:"#fff",fontFamily:F.b}}>{seller.dedBadge}</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:2}}>
              <span style={{display:"flex",alignItems:"center",gap:3,fontSize:11,color:"#999",fontFamily:F.b}}><MapPin size={10}/>{seller.neighbourhood} · {seller.dist}</span>
              <span style={{fontSize:11,color:"#999",fontFamily:F.b}}>{seller.items} items listed</span>
              {seller.rating&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:11,color:C.oPrimary,fontFamily:F.b}}><Star size={10} fill={C.oPrimary}/>{seller.rating}</span>}
            </div>
          </div>
        </div>
        {isDed&&seller.dedDate&&(
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10,padding:"8px 12px",borderRadius:10,backgroundColor:"#fff",border:`1px solid ${accentColor}15`}}>
            <Calendar size={13} style={{color:accentColor}}/>
            <span style={{fontSize:12,fontWeight:700,color:accentColor,fontFamily:F.b}}>Available {seller.dedDate}</span>
            {seller.daysLeft<=5&&<span style={{fontSize:10,fontWeight:700,color:"#DC2626",fontFamily:F.b}}>({seller.daysLeft} days left)</span>}
          </div>
        )}
      </div>

      {/* Item details grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
        {[
          {l:"Condition",v:item.condition,icon:Shield},
          {l:"Distance",v:seller.dist,icon:MapPin},
          {l:isDrop?"Claiming Ends":isDed?"Available Until":"Listed",v:isDrop?`in ${item.timeLeft}`:isDed?seller.dedDate?.split("–")[1]?.trim():`${item.daysListed}d ago`,icon:isDrop?Clock:isDed?Calendar:Package},
        ].map((d,i)=>(
          <div key={i} style={{padding:14,borderRadius:12,border:"1px solid #f0f0f0",textAlign:"center",backgroundColor:"#fff"}}>
            <d.icon size={16} style={{color:accentColor,margin:"0 auto 6px",display:"block"}}/>
            <p style={{fontSize:10,color:"#999",marginBottom:2,fontFamily:F.b}}>{d.l}</p>
            <p style={{fontSize:14,fontWeight:800,color:C.gDark,fontFamily:F.h}}>{d.v}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{marginBottom:16}}>
        <p style={{fontSize:14,fontWeight:700,color:C.gDark,marginBottom:6,fontFamily:F.h}}>About This Item</p>
        <p style={{fontSize:13,color:"#666",lineHeight:1.7,fontFamily:F.b}}>{item.description}</p>
        <div style={{display:"flex",gap:6,marginTop:8}}>
          <span style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:6,backgroundColor:C.gLightBg,color:C.gPrimary,fontFamily:F.b}}>{item.category}</span>
          <span style={{fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:6,backgroundColor:"#f3f4f6",color:"#777",fontFamily:F.b}}>{item.condition}</span>
          {item.saves>10&&<span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,fontWeight:600,padding:"3px 10px",borderRadius:6,backgroundColor:"#FEF2F2",color:"#DC2626",fontFamily:F.b}}><Heart size={9}/>{item.saves} saves</span>}
        </div>
      </div>

      {/* More from this seller — Dedicated Drops only */}
      {isDed&&seller.dedBadge&&(
        <div style={{marginBottom:16,padding:16,borderRadius:16,background:`linear-gradient(135deg,${accentColor}08,${accentColor}04)`,border:`1.5px solid ${accentColor}20`,cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${accentColor}12`}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,backgroundColor:accentColor+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:accentColor,fontFamily:F.h,flexShrink:0}}>
                {seller.name.charAt(0)}{seller.name.split(" ").pop()?.charAt(0)}
              </div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <p style={{fontSize:13,fontWeight:700,color:C.gDark,fontFamily:F.h}}>More from {seller.name}</p>
                  <span style={{fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:6,backgroundColor:accentColor,color:"#fff",fontFamily:F.b}}>{seller.dedBadge}</span>
                </div>
                <p style={{fontSize:11,color:"#999",marginTop:2,fontFamily:F.b}}>{seller.items-1} more items available · {seller.dedDate}</p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4,padding:"8px 16px",borderRadius:10,backgroundColor:accentColor,color:"#fff",fontSize:12,fontWeight:700,fontFamily:F.b,flexShrink:0}}>
              View All <ChevronRight size={14}/>
            </div>
          </div>
        </div>
      )}

      {/* Q&A */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>Questions & Answers</p>
          <span style={{fontSize:11,color:"#bbb",fontFamily:F.b}}>{item.questions.length} question{item.questions.length!==1?"s":""}</span>
        </div>
        {item.questions.map((qa,i)=>(
          <div key={i} style={{padding:14,borderRadius:14,border:"1px solid #f0f0f0",marginBottom:8,backgroundColor:"#fff"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
              <div style={{width:24,height:24,borderRadius:"50%",backgroundColor:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><User size={11} style={{color:"#bbb"}}/></div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,fontWeight:600,color:"#777",fontFamily:F.b}}>{qa.by}</span><span style={{fontSize:9,color:"#ccc",fontFamily:F.b}}>{qa.ago}</span></div>
                <p style={{fontSize:13,color:C.gDark,marginTop:2,fontFamily:F.b}}>{qa.q}</p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"flex-start",gap:8,paddingLeft:8,borderLeft:`2px solid ${qa.aiAnswered?C.ai+"30":C.gSoft}`}}>
              {qa.aiAnswered?
                <div style={{width:24,height:24,borderRadius:"50%",background:`linear-gradient(135deg,${C.ai},#6D28D9)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={10} style={{color:"#fff"}}/></div>
                :<div style={{width:24,height:24,borderRadius:"50%",backgroundColor:C.gLightBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><User size={11} style={{color:C.gPrimary}}/></div>
              }
              <div>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:11,fontWeight:600,color:qa.aiAnswered?C.ai:C.gPrimary,fontFamily:F.b}}>{qa.aiAnswered?"AI Agent":"Seller"}</span>
                  {qa.aiAnswered&&<span style={{fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:4,backgroundColor:C.aiLight,color:C.ai,fontFamily:F.b}}>AUTO</span>}
                </div>
                <p style={{fontSize:12,color:"#555",lineHeight:1.6,marginTop:2,fontFamily:F.b}}>{qa.a}</p>
              </div>
            </div>
          </div>
        ))}
        <button onClick={()=>setShowAsk(true)} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"1px solid #e5e7eb",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F.b,backgroundColor:"#fff",color:"#666",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          <MessageCircle size={14}/> Ask a Question
        </button>
      </div>

      {/* CTA — sticky bottom */}
      {!claimed ? (
        <div style={{position:"sticky",bottom:0,padding:"16px 0",backgroundColor:"#F7F7F5"}}>
          <button onClick={()=>setShowClaim(true)} style={{width:"100%",padding:"16px 0",borderRadius:14,border:"none",cursor:"pointer",fontSize:15,fontWeight:700,fontFamily:F.b,backgroundColor:accentColor,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 6px 24px ${accentColor}30`}}>
            {isDrop?"Claim Now — $":"Claim This Item — $"}{item.price} <ChevronRight size={16}/>
          </button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:10,padding:"6px 14px",borderRadius:10,
            backgroundColor:isDrop?"#FEF2F2":isDed?dedInfo?.c+"12":"#FFF7ED",
            border:`1px solid ${isDrop?"#FECACA":isDed?dedInfo?.c+"25":C.oSoft}`,
            boxShadow:isDrop?"0 0 12px rgba(239,68,68,0.15)":isDed?`0 0 12px ${dedInfo?.c}15`:"0 0 12px rgba(240,138,0,0.12)"}}>
            {isDrop?<Clock size={12} style={{color:"#DC2626"}}/>:isDed?<Calendar size={12} style={{color:dedInfo?.c}}/>:<Package size={12} style={{color:C.oPrimary}}/>}
            <p style={{fontSize:11,fontWeight:700,fontFamily:F.b,
              color:isDrop?"#DC2626":isDed?dedInfo?.c:C.oPrimary}}>
              {isDrop?`⏱ Claiming closes in ${item.timeLeft}`:isDed?`📅 Available until ${seller.dedDate?.split("–")[1]?.trim()}${seller.daysLeft<=5?` — only ${seller.daysLeft} days left!`:""}`:"✦ Available now — claim anytime"}
            </p>
          </div>
        </div>
      ) : (
        <div style={{position:"sticky",bottom:0,padding:"16px 0",backgroundColor:"#F7F7F5"}}>
          <div style={{padding:16,borderRadius:14,backgroundColor:C.gLightBg,border:`1px solid ${C.gSoft}`,display:"flex",alignItems:"center",gap:12}}>
            <CheckCircle size={24} style={{color:C.gPrimary,flexShrink:0}}/>
            <div>
              <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>You claimed this item!</p>
              <p style={{fontSize:11,color:"#777",fontFamily:F.b}}>Pickup confirmed. Check WhatsApp for address.</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showClaim&&<ClaimModal item={item} onClose={()=>setShowClaim(false)} onConfirm={()=>{setClaimed(true);setShowClaim(false)}}/>}
      {showAsk&&<AskModal item={item} onClose={()=>setShowAsk(false)}/>}
    </div>
  );
}

/* ═══ MAIN — Tab between item types ═══ */
export default function ItemDetailDemo(){
  const [activeType,setActiveType]=useState("drop");
  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{minHeight:"100vh",backgroundColor:"#F7F7F5",fontFamily:F.b}}>
        {/* Demo switcher */}
        <div style={{position:"sticky",top:0,zIndex:40,padding:"12px 24px",backgroundColor:"#fff",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:600,color:"#bbb",fontFamily:F.b,marginRight:8}}>Preview item type:</span>
          {[
            {id:"drop",label:"Live Drop Item",color:C.gPrimary,bg:C.gLightBg},
            {id:"shelf",label:"Shelf Item",color:C.oPrimary,bg:C.oLightBg},
            {id:"dedicated",label:"Dedicated Drop Item",color:C.tPrimary,bg:C.tLight},
          ].map(t=>(
            <button key={t.id} onClick={()=>setActiveType(t.id)}
              style={{padding:"7px 16px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:F.b,
                backgroundColor:activeType===t.id?t.color:"#fff",color:activeType===t.id?"#fff":t.color,
                border:`1.5px solid ${activeType===t.id?t.color:t.color+"30"}`}}>
              {t.label}
            </button>
          ))}
        </div>
        <ItemDetail item={sampleItems[activeType]} onBack={()=>{}}/>
      </div>
    </>
  );
}
