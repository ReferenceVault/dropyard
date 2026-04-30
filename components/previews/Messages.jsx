"use client";
import { useState } from "react";
import {
  Search, Heart, Clock, MapPin, Package, ChevronRight, ChevronDown,
  Check, Compass, ShoppingBag, MessageSquare, History,
  ArrowRight, Sparkles, ArrowLeft, Send, MessageCircle,
  Calendar, CheckCircle, X, Tag, RefreshCw, User, Archive,
  ChevronUp
} from "lucide-react";

const C = {
  gLightBg:"#ECFDF5",gSoft:"#D1FAE5",gAccent:"#6EE7B7",
  gPrimary:"#1F7A4D",gHover:"#17603D",gDark:"#0F3D2A",
  oLightBg:"#FFF7ED",oSoft:"#FED7AA",oAccent:"#FDBA74",
  oPrimary:"#F08A00",oHover:"#C96F00",oDark:"#7A4300",
  tPrimary:"#0F766E",tLight:"#CCFBF1",
  ai:"#7C3AED",aiLight:"#F5F3FF",aiBorder:"#DDD6FE",
  wa:"#25D366",
};
const F={h:"'Outfit',sans-serif",b:"'Plus Jakarta Sans',sans-serif"};

const conversations = [
  // ── ACTIVE ──
  {id:"c1",type:"claim",status:"pickup-today",unread:true,group:"active",
    item:{title:"Kids' Bicycle — 16\"",price:30,img:"🚲",layer:"drop"},
    seller:{name:"Tom R.",neighbourhood:"Barrhaven",usesAI:true},
    pickup:{day:"Today",time:"10:00 AM",address:"8 Larkin Crescent"},
    lastMessage:"Reminder: Your pickup is in 2 hours!",lastTime:"35 min ago",
    messages:[
      {from:"you",text:"Claiming at $30.",time:"Thu, 3:00 PM",type:"claim"},
      {from:"ai",text:"Claimed! The bicycle is yours at $30. When works for pickup?",time:"Thu, 3:00 PM",type:"text"},
      {from:"you",text:"Saturday morning — 10am?",time:"Thu, 3:05 PM",type:"text"},
      {from:"ai",text:"Saturday 10am is perfect. Pickup at 8 Larkin Crescent. Details sent to WhatsApp!",time:"Thu, 3:05 PM",type:"text"},
      {from:"system",text:"WhatsApp confirmation sent.",time:"Thu, 3:06 PM",type:"whatsapp"},
      {from:"ai",text:"⏰ Reminder: Your pickup is in 2 hours! 8 Larkin Crescent. See you at 10am!",time:"Today, 8:00 AM",type:"reminder"},
    ]},
  {id:"c2",type:"offer",status:"counter",unread:true,group:"active",
    item:{title:"Cuisinart Coffee Maker",price:25,img:"☕",layer:"drop"},
    seller:{name:"Sarah L.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"The seller's minimum is $20. Would that work?",lastTime:"18 min ago",
    messages:[
      {from:"you",text:"Would you take $15 for the coffee maker?",time:"Today, 11:30 AM",type:"offer",amount:15},
      {from:"ai",text:"Hi! Thanks for your interest. The lowest the seller can go is $20 — it's in excellent condition with the reusable filter included. Would that work? 😊",time:"Today, 11:30 AM",type:"counter",amount:20},
    ]},
  {id:"c3",type:"offer",status:"accepted",unread:false,group:"active",
    item:{title:"Full Bedroom Set — Queen",price:550,img:"🛏️",layer:"dedicated",dedType:"moving"},
    seller:{name:"The Patel Family",neighbourhood:"Barrhaven South",usesAI:true},
    lastMessage:"Offer accepted! $550. Choose a pickup time.",lastTime:"1d ago",
    messages:[
      {from:"you",text:"Would you accept $550 for the bedroom set?",time:"Yesterday, 10:00 AM",type:"offer",amount:550},
      {from:"ai",text:"The Patel Family accepted your offer! $550 for the Full Bedroom Set. When would you like to pick it up? Available: Sat 10am–4pm, Sun 10am–2pm, weekdays 5pm–7pm.",time:"Yesterday, 10:01 AM",type:"text"},
    ]},
  // ── THIS WEEK ──
  {id:"c4",type:"claim",status:"pickup-confirmed",unread:false,group:"this-week",
    item:{title:"Solid Oak Dining Table",price:350,img:"🪵",layer:"drop"},
    seller:{name:"Jane D.",neighbourhood:"Bridlewood",usesAI:true},
    pickup:{day:"Saturday, Apr 13",time:"2:00 PM",address:"42 Bridlewood Dr"},
    lastMessage:"Pickup confirmed for Saturday 2pm.",lastTime:"2h ago",
    messages:[
      {from:"you",text:"I'd like to claim this at $350.",time:"Yesterday, 4:12 PM",type:"claim"},
      {from:"ai",text:"Claim accepted! The table is reserved at $350. Let's pick a time.",time:"Yesterday, 4:12 PM",type:"text"},
      {from:"you",text:"Saturday 2pm.",time:"Yesterday, 4:15 PM",type:"text"},
      {from:"ai",text:"All set! Pickup Saturday at 2:00 PM. 42 Bridlewood Dr. Reminder coming 1 hour before. 🏡",time:"Yesterday, 4:15 PM",type:"text"},
      {from:"system",text:"WhatsApp confirmation sent with pickup address.",time:"Yesterday, 4:16 PM",type:"whatsapp"},
    ]},
  {id:"c5",type:"question",status:"answered",unread:true,group:"this-week",
    item:{title:"Standing Desk — Adjustable",price:140,img:"🖥️",layer:"shelf"},
    seller:{name:"David N.",neighbourhood:"Barrhaven",usesAI:false},
    lastMessage:"The desk goes from 72cm sitting to 120cm standing.",lastTime:"1h ago",
    messages:[
      {from:"you",text:"What's the height range? Is the motor noisy?",time:"Today, 10:45 AM",type:"question"},
      {from:"system",text:"This seller responds personally — replies may take longer.",time:"Today, 10:45 AM",type:"notice"},
      {from:"seller",text:"Hey! Good questions. The desk goes from 72cm (sitting) to 120cm (full standing). The motor is pretty quiet — you can barely hear it. Happy to show you if you want to see it before claiming.",time:"Today, 11:50 AM",type:"text"},
    ]},
  {id:"c6",type:"offer",status:"declined",unread:false,group:"this-week",
    item:{title:"DeWalt 20V Drill Set",price:65,img:"🔧",layer:"drop"},
    seller:{name:"James K.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"The seller can't go below $52 for the drill set.",lastTime:"3h ago",
    messages:[
      {from:"you",text:"Offering $30 for the drill set.",time:"Today, 9:15 AM",type:"offer",amount:30},
      {from:"ai",text:"Thanks for the offer! Unfortunately, the seller can't go below $52 for the DeWalt drill set. It's in excellent condition with 2 batteries and a full bit set. Would you like to make a higher offer?",time:"Today, 9:15 AM",type:"text"},
    ]},
  // ── LAST WEEK ──
  {id:"c7",type:"claim",status:"completed",unread:false,group:"last-week",
    item:{title:"Yoga Mat + Bands",price:15,img:"🧘",layer:"shelf"},
    seller:{name:"Chloe D.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"Picked up! Thanks for buying from your neighbour.",lastTime:"5d ago",
    messages:[]},
  {id:"c8",type:"question",status:"answered",unread:false,group:"last-week",
    item:{title:"Antique China Cabinet",price:280,img:"🏺",layer:"dedicated",dedType:"estate"},
    seller:{name:"Estate of M. Williams",neighbourhood:"Half Moon Bay",usesAI:false},
    lastMessage:"It's solid mahogany — glass panels are all original.",lastTime:"6d ago",
    messages:[
      {from:"you",text:"Is this real mahogany or veneer? Are the glass panels original?",time:"Last Mon, 2:00 PM",type:"question"},
      {from:"system",text:"This seller responds personally — replies may take longer.",time:"Last Mon, 2:00 PM",type:"notice"},
      {from:"seller",text:"Hi there. It's solid mahogany — you can tell by the weight! Glass panels are all original, no chips or cracks. We had it appraised at $450 in 2019.",time:"Last Tue, 9:30 AM",type:"text"},
    ]},
  // ── ARCHIVED (auto-archived: completed 7d+, declined 14d+, answered w/ no follow-up 14d+) ──
  {id:"a1",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Mar 2026",
    item:{title:"IKEA KALLAX Shelf",price:35,img:"📚",layer:"drop"},
    seller:{name:"Mike T.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"Picked up! Hope you enjoy the shelf.",lastTime:"2w ago",messages:[]},
  {id:"a2",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Mar 2026",
    item:{title:"Winter Boots — Size 10",price:25,img:"🥾",layer:"drop"},
    seller:{name:"Raj P.",neighbourhood:"Barrhaven",usesAI:false},
    lastMessage:"All done. Enjoy!",lastTime:"3w ago",messages:[]},
  {id:"a3",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Mar 2026",
    item:{title:"Cuisinart Coffee Maker",price:20,img:"☕",layer:"drop"},
    seller:{name:"Sarah L.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"Picked up! Great buyer.",lastTime:"4w ago",messages:[]},
  {id:"a4",type:"offer",status:"declined",unread:false,group:"archived",archiveDate:"Feb 2026",
    item:{title:"Dyson Fan — Tower",price:90,img:"🌀",layer:"drop"},
    seller:{name:"Lisa C.",neighbourhood:"Stonebridge",usesAI:false},
    lastMessage:"Sorry, can't go lower than $75.",lastTime:"6w ago",messages:[]},
  {id:"a5",type:"question",status:"answered",unread:false,group:"archived",archiveDate:"Feb 2026",
    item:{title:"Vintage Record Player",price:90,img:"🎵",layer:"dedicated",dedType:"estate"},
    seller:{name:"Estate of M. Williams",neighbourhood:"Half Moon Bay",usesAI:false},
    lastMessage:"Yes, it plays 33 and 45 RPM. Needle is new.",lastTime:"7w ago",messages:[]},
  {id:"a6",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Jan 2026",
    item:{title:"Samsung Galaxy Tab A7",price:65,img:"📲",layer:"shelf"},
    seller:{name:"Mike T.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"Picked up! Enjoy the tablet.",lastTime:"3mo ago",messages:[]},
  {id:"a7",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Dec 2025",
    item:{title:"Christmas Tree — 7ft",price:40,img:"🎄",layer:"drop"},
    seller:{name:"Linda M.",neighbourhood:"Barrhaven",usesAI:true},
    lastMessage:"Picked up! Happy holidays!",lastTime:"4mo ago",messages:[]},
  {id:"a8",type:"claim",status:"completed",unread:false,group:"archived",archiveDate:"Nov 2025",
    item:{title:"Snow Blower — Electric",price:95,img:"❄️",layer:"drop"},
    seller:{name:"Paul F.",neighbourhood:"Half Moon Bay",usesAI:false},
    lastMessage:"Done! Enjoy the winter.",lastTime:"5mo ago",messages:[]},
];

const statusConfig = {
  "pickup-confirmed":{label:"Pickup Confirmed",color:C.gPrimary,bg:C.gLightBg,icon:CheckCircle},
  "pickup-today":{label:"Pickup Today",color:"#DC2626",bg:"#FEF2F2",icon:Clock,pulse:true},
  "counter":{label:"Counter Offer",color:C.oPrimary,bg:C.oLightBg,icon:RefreshCw},
  "declined":{label:"Declined",color:"#6B7280",bg:"#F3F4F6",icon:X},
  "accepted":{label:"Offer Accepted",color:C.gPrimary,bg:C.gLightBg,icon:Check},
  "answered":{label:"Answered",color:C.ai,bg:C.aiLight,icon:MessageSquare},
  "pending":{label:"Pending",color:C.oPrimary,bg:C.oLightBg,icon:Clock},
  "completed":{label:"Completed",color:"#9CA3AF",bg:"#F3F4F6",icon:Check},
};

const groupLabels={"active":"Active","this-week":"This Week","last-week":"Last Week"};

/* ═══ CONVERSATION ROW ═══ */
function ConvoRow({convo,active,onClick,compact}){
  const sc=statusConfig[convo.status]||statusConfig.pending;
  return(
    <button onClick={onClick} style={{
      width:"100%",display:"flex",alignItems:"center",gap:compact?8:10,padding:compact?"8px 10px":"10px 12px",
      borderRadius:compact?10:12,border:`1.5px solid ${active?sc.color+"30":convo.unread?"#FEF08A":"transparent"}`,
      cursor:"pointer",textAlign:"left",
      backgroundColor:active?sc.bg:convo.unread?"#FEFCE8":"#fff",
      transition:"all 0.15s",marginBottom:compact?3:4,
    }}
    onMouseEnter={e=>{if(!active)e.currentTarget.style.backgroundColor=convo.unread?"#FEFCE8":"#fafafa"}}
    onMouseLeave={e=>{if(!active)e.currentTarget.style.backgroundColor=convo.unread?"#FEFCE8":"#fff"}}>
      <div style={{width:compact?34:40,height:compact?34:40,borderRadius:compact?8:10,backgroundColor:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:compact?16:20,flexShrink:0,border:"1px solid #f0f0f0",position:"relative"}}>
        {convo.item.img}
        {convo.unread&&<div style={{position:"absolute",top:-3,right:-3,width:9,height:9,borderRadius:"50%",backgroundColor:C.oPrimary,border:"2px solid #fff"}}/>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:1}}>
          <p style={{fontSize:compact?11:12,fontWeight:convo.unread?800:600,color:C.gDark,fontFamily:F.h,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"68%"}}>{convo.item.title}</p>
          <span style={{fontSize:compact?8:9,color:"#ccc",fontFamily:F.b,flexShrink:0}}>{convo.lastTime}</span>
        </div>
        <p style={{fontSize:compact?9:10,color:convo.unread?"#555":"#aaa",fontFamily:F.b,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginBottom:2}}>{convo.lastMessage}</p>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:4,backgroundColor:sc.bg}}>
            <sc.icon size={8} style={{color:sc.color}}/>
            <span style={{fontSize:7,fontWeight:700,color:sc.color,fontFamily:F.b,letterSpacing:0.3}}>{sc.label.toUpperCase()}</span>
            {sc.pulse&&<div style={{width:4,height:4,borderRadius:"50%",backgroundColor:sc.color,animation:"pulse 1.5s infinite"}}/>}
          </div>
          {convo.seller.usesAI?<div style={{display:"flex",alignItems:"center",gap:2}}><Sparkles size={7} style={{color:C.ai}}/><span style={{fontSize:7,fontWeight:600,color:C.ai,fontFamily:F.b}}>AI</span></div>
          :<span style={{fontSize:7,fontWeight:600,color:"#bbb",fontFamily:F.b}}>Manual</span>}
        </div>
      </div>
    </button>
  );
}

/* ═══ THREAD VIEW ═══ */
function ThreadView({convo,onBack}){
  const [reply,setReply]=useState("");
  const sc=statusConfig[convo.status]||statusConfig.pending;
  const usesAI=convo.seller.usesAI;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{padding:"12px 20px",borderBottom:"1px solid #f0f0f0",backgroundColor:"#fff",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{width:30,height:30,borderRadius:8,border:"1px solid #e5e7eb",backgroundColor:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ArrowLeft size={14} style={{color:"#999"}}/></button>
          <div style={{width:36,height:36,borderRadius:10,backgroundColor:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,border:"1px solid #f0f0f0"}}>{convo.item.img}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>{convo.item.title}</p>
              <span style={{fontSize:15,fontWeight:900,color:C.gPrimary,fontFamily:F.h}}>${convo.item.price}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:1}}>
              <span style={{fontSize:10,color:"#999",fontFamily:F.b}}>{convo.seller.name} · {convo.seller.neighbourhood}</span>
              <div style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:4,backgroundColor:sc.bg}}>
                <sc.icon size={8} style={{color:sc.color}}/><span style={{fontSize:7,fontWeight:700,color:sc.color,fontFamily:F.b}}>{sc.label.toUpperCase()}</span>
              </div>
              {usesAI?<div style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:4,backgroundColor:C.aiLight}}><Sparkles size={7} style={{color:C.ai}}/><span style={{fontSize:7,fontWeight:700,color:C.ai,fontFamily:F.b}}>AI AGENT</span></div>
              :<div style={{display:"flex",alignItems:"center",gap:3,padding:"1px 6px",borderRadius:4,backgroundColor:"#F3F4F6"}}><User size={7} style={{color:"#999"}}/><span style={{fontSize:7,fontWeight:700,color:"#999",fontFamily:F.b}}>MANUAL</span></div>}
            </div>
          </div>
          <button style={{padding:"5px 12px",borderRadius:7,border:"1px solid #e5e7eb",backgroundColor:"#fff",cursor:"pointer",fontSize:10,fontWeight:600,color:"#777",fontFamily:F.b,display:"flex",alignItems:"center",gap:3}}>View Item <ChevronRight size={11}/></button>
        </div>
        {/* Pickup banner */}
        {convo.pickup&&convo.status!=="completed"&&(
          <div style={{marginTop:10,padding:"10px 14px",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"space-between",
            backgroundColor:convo.status==="pickup-today"?"#FEF2F2":C.gLightBg,border:`1px solid ${convo.status==="pickup-today"?"#FECACA":C.gSoft}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {convo.status==="pickup-today"?<Clock size={14} style={{color:"#DC2626"}}/>:<MapPin size={14} style={{color:C.gPrimary}}/>}
              <div>
                <p style={{fontSize:12,fontWeight:700,color:convo.status==="pickup-today"?"#DC2626":C.gDark,fontFamily:F.b}}>{convo.status==="pickup-today"?"Pickup Today!":"Pickup Scheduled"}</p>
                <p style={{fontSize:11,color:"#777",fontFamily:F.b}}>{convo.pickup.day} at {convo.pickup.time} · {convo.pickup.address}</p>
              </div>
            </div>
            <button style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.b,backgroundColor:convo.status==="pickup-today"?"#DC2626":C.gPrimary,color:"#fff"}}>{convo.status==="pickup-today"?"Get Directions":"Change Time"}</button>
          </div>
        )}
        {convo.status==="counter"&&(
          <div style={{marginTop:10,padding:"10px 14px",borderRadius:10,backgroundColor:C.oLightBg,border:`1px solid ${C.oSoft}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><RefreshCw size={14} style={{color:C.oPrimary}}/><div><p style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.b}}>Counter offer: ${convo.messages.find(m=>m.type==="counter")?.amount}</p><p style={{fontSize:10,color:"#999",fontFamily:F.b}}>The seller's AI agent suggested a different price</p></div></div>
            <div style={{display:"flex",gap:6}}><button style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e5e7eb",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.b,backgroundColor:"#fff",color:"#777"}}>Decline</button><button style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff"}}>Accept ${convo.messages.find(m=>m.type==="counter")?.amount}</button></div>
          </div>
        )}
        {convo.status==="accepted"&&!convo.pickup&&(
          <div style={{marginTop:10,padding:"10px 14px",borderRadius:10,backgroundColor:C.gLightBg,border:`1px solid ${C.gSoft}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}><CheckCircle size={14} style={{color:C.gPrimary}}/><p style={{fontSize:12,fontWeight:700,color:C.gDark,fontFamily:F.b}}>Offer accepted! Choose a pickup time.</p></div>
            <button style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:F.b,backgroundColor:C.gPrimary,color:"#fff"}}>Schedule Pickup</button>
          </div>
        )}
        {/* Archived notice */}
        {convo.group==="archived"&&(
          <div style={{marginTop:10,padding:"8px 14px",borderRadius:10,backgroundColor:"#F3F4F6",border:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:8}}>
            <Archive size={13} style={{color:"#999"}}/>
            <span style={{fontSize:11,color:"#777",fontFamily:F.b}}>This conversation was auto-archived · {convo.archiveDate}</span>
          </div>
        )}
      </div>
      {/* Messages */}
      <div style={{flex:1,overflow:"auto",padding:"16px 20px"}}>
        {convo.messages.map((msg,i)=>{
          if(msg.type==="whatsapp")return(<div key={i} style={{display:"flex",justifyContent:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:20,backgroundColor:"#F0FFF4",border:`1px solid ${C.wa}20`}}><MessageCircle size={10} style={{color:C.wa}}/><span style={{fontSize:10,fontWeight:600,color:"#555",fontFamily:F.b}}>{msg.text}</span></div></div>);
          if(msg.type==="reminder")return(<div key={i} style={{display:"flex",justifyContent:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:10,backgroundColor:"#FEF2F2",border:"1px solid #FECACA"}}><Clock size={11} style={{color:"#DC2626"}}/><span style={{fontSize:11,fontWeight:700,color:"#DC2626",fontFamily:F.b}}>{msg.text}</span></div></div>);
          if(msg.type==="notice")return(<div key={i} style={{display:"flex",justifyContent:"center",marginBottom:14}}><div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:20,backgroundColor:"#F3F4F6",border:"1px solid #e5e7eb"}}><User size={10} style={{color:"#999"}}/><span style={{fontSize:10,fontWeight:600,color:"#777",fontFamily:F.b}}>{msg.text}</span></div></div>);
          const isYou=msg.from==="you",isAi=msg.from==="ai",isSeller=msg.from==="seller";
          return(
            <div key={i} style={{display:"flex",justifyContent:isYou?"flex-end":"flex-start",marginBottom:14}}>
              <div style={{display:"flex",gap:8,maxWidth:"78%",flexDirection:isYou?"row-reverse":"row",alignItems:"flex-end"}}>
                {!isYou&&<div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:isAi?`linear-gradient(135deg,${C.ai},#6D28D9)`:C.gLightBg}}>{isAi?<Sparkles size={10} style={{color:"#fff"}}/>:<span style={{fontSize:10,fontWeight:700,color:C.gPrimary,fontFamily:F.h}}>{convo.seller.name.charAt(0)}</span>}</div>}
                <div>
                  {msg.type==="claim"&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:3,justifyContent:"flex-end"}}><Tag size={8} style={{color:C.gPrimary}}/><span style={{fontSize:8,fontWeight:700,color:C.gPrimary,fontFamily:F.b}}>CLAIM</span></div>}
                  {msg.type==="offer"&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:3,justifyContent:"flex-end"}}><Tag size={8} style={{color:C.oPrimary}}/><span style={{fontSize:8,fontWeight:700,color:C.oPrimary,fontFamily:F.b}}>OFFER — ${msg.amount}</span></div>}
                  {msg.type==="counter"&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:3}}><RefreshCw size={8} style={{color:C.oPrimary}}/><span style={{fontSize:8,fontWeight:700,color:C.oPrimary,fontFamily:F.b}}>COUNTER — ${msg.amount}</span></div>}
                  <div style={{padding:"10px 14px",borderRadius:16,borderBottomRightRadius:isYou?4:16,borderBottomLeftRadius:isYou?16:4,
                    backgroundColor:isYou?C.gPrimary:isAi?C.aiLight:isSeller?"#fff":"#f3f4f6",
                    border:isYou?"none":isAi?`1px solid ${C.aiBorder}`:isSeller?`1px solid ${C.gSoft}`:"1px solid #e5e7eb"}}>
                    {isAi&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:4}}><Sparkles size={8} style={{color:C.ai}}/><span style={{fontSize:7,fontWeight:800,color:C.ai,fontFamily:F.b}}>AI AGENT</span><span style={{fontSize:7,fontWeight:700,color:C.ai,padding:"0 4px",borderRadius:3,backgroundColor:C.ai+"12",fontFamily:F.b}}>AUTO</span></div>}
                    {isSeller&&<div style={{display:"flex",alignItems:"center",gap:3,marginBottom:4}}><User size={8} style={{color:C.gPrimary}}/><span style={{fontSize:7,fontWeight:800,color:C.gPrimary,fontFamily:F.b}}>{convo.seller.name.toUpperCase()}</span></div>}
                    <p style={{fontSize:12,color:isYou?"#fff":C.gDark,lineHeight:1.6,fontFamily:F.b}}>{msg.text}</p>
                  </div>
                  <p style={{fontSize:8,color:"#ccc",marginTop:2,textAlign:isYou?"right":"left",fontFamily:F.b}}>{msg.time}</p>
                </div>
              </div>
            </div>
          );
        })}
        {convo.status==="completed"&&(
          <div style={{textAlign:"center",padding:"20px 0"}}><div style={{width:44,height:44,borderRadius:"50%",backgroundColor:C.gLightBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}><CheckCircle size={22} style={{color:C.gPrimary}}/></div><p style={{fontSize:14,fontWeight:700,color:C.gDark,fontFamily:F.h}}>Item picked up!</p><p style={{fontSize:11,color:"#999",marginTop:3,fontFamily:F.b}}>Thanks for buying from your neighbour. 🌟</p></div>
        )}
      </div>
      {/* Reply */}
      {convo.status!=="completed"&&(
        <div style={{padding:"10px 20px",borderTop:"1px solid #f0f0f0",backgroundColor:"#fff",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"9px 14px",borderRadius:12,border:"1px solid #e5e7eb",backgroundColor:"#fafafa"}}>
              <input value={reply} onChange={e=>setReply(e.target.value)} placeholder={convo.status==="counter"?"Accept, decline, or reply...":"Type a message..."}
                style={{border:"none",outline:"none",flex:1,fontSize:12,color:C.gDark,fontFamily:F.b,backgroundColor:"transparent"}}/>
            </div>
            <button style={{width:40,height:40,borderRadius:12,border:"none",cursor:"pointer",backgroundColor:C.gPrimary,display:"flex",alignItems:"center",justifyContent:"center"}}><Send size={14} style={{color:"#fff"}}/></button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:5,justifyContent:"center"}}>
            {usesAI?<><Sparkles size={8} style={{color:C.ai}}/><span style={{fontSize:9,color:C.ai,fontFamily:F.b}}>AI agent typically responds in seconds</span></>
            :<><User size={8} style={{color:"#999"}}/><span style={{fontSize:9,color:"#999",fontFamily:F.b}}>This seller responds personally — may take a few hours</span></>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function MessagesTab(){
  const [filter,setFilter]=useState("all");
  const [activeConvo,setActiveConvo]=useState(null);
  const [collapsed,setCollapsed]=useState({});
  const [showArchive,setShowArchive]=useState(false);
  const [archiveSearch,setArchiveSearch]=useState("");

  const toggle=(g)=>setCollapsed(p=>({...p,[g]:!p[g]}));

  const activeGroups=["active","this-week","last-week"];
  const archivedConvos=conversations.filter(c=>c.group==="archived");
  const filteredArchive=archiveSearch
    ?archivedConvos.filter(c=>c.item.title.toLowerCase().includes(archiveSearch.toLowerCase())||c.seller.name.toLowerCase().includes(archiveSearch.toLowerCase()))
    :archivedConvos;

  // Group archived by archiveDate
  const archiveMonths=[...new Set(archivedConvos.map(c=>c.archiveDate))];

  const filterConvos=(list)=>{
    if(filter==="all")return list;
    if(filter==="claims")return list.filter(c=>c.type==="claim"&&c.status!=="completed");
    if(filter==="offers")return list.filter(c=>c.type==="offer");
    if(filter==="questions")return list.filter(c=>c.type==="question");
    return list.filter(c=>c.status==="completed");
  };

  const unreadCount=conversations.filter(c=>c.unread).length;
  const selected=activeConvo?conversations.find(c=>c.id===activeConvo):null;

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{height:"100vh",display:"flex",flexDirection:"column",backgroundColor:"#F7F7F5",fontFamily:F.b}}>

        {/* Top nav */}
        <nav style={{borderBottom:"1px solid #f0f0f0",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",flexShrink:0}}>
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
        <div style={{borderBottom:"1px solid #f0f0f0",backgroundColor:"#fff",flexShrink:0}}>
          <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex"}}>
              {[{id:"discover",label:"Discover",icon:Compass},{id:"saved",label:"Saved",icon:Heart,badge:"3"},{id:"claims",label:"Claims",icon:ShoppingBag,badge:"1"},{id:"messages",label:"Messages",icon:MessageSquare,badge:unreadCount>0?String(unreadCount):null,active:true},{id:"history",label:"History",icon:History}].map(item=>(
                <button key={item.id} style={{display:"flex",alignItems:"center",gap:6,padding:"12px 16px",border:"none",cursor:"pointer",backgroundColor:"transparent",borderBottom:`2px solid ${item.active?C.gPrimary:"transparent"}`}}>
                  <item.icon size={15} style={{color:item.active?C.gPrimary:"#bbb"}}/><span style={{fontSize:13,fontWeight:item.active?700:500,color:item.active?C.gPrimary:"#888",fontFamily:F.b}}>{item.label}</span>
                  {item.badge&&<span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:20,backgroundColor:item.active?C.gPrimary:"#f3f4f6",color:item.active?"#fff":"#bbb"}}>{item.badge}</span>}
                </button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={13} style={{color:C.gPrimary}}/><span style={{fontSize:12,fontWeight:600,color:C.gPrimary,fontFamily:F.b}}>Barrhaven</span></div>
          </div>
        </div>

        {/* Split pane */}
        <div style={{flex:1,display:"flex",overflow:"hidden",maxWidth:1280,margin:"0 auto",width:"100%"}}>

          {/* LEFT: List */}
          <div style={{width:370,borderRight:"1px solid #f0f0f0",backgroundColor:"#fff",display:"flex",flexDirection:"column",flexShrink:0}}>
            {/* Header + search + filters */}
            <div style={{padding:"14px 14px 10px",borderBottom:"1px solid #f5f5f5"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <h2 style={{fontSize:17,fontWeight:900,color:C.gDark,fontFamily:F.h}}>Messages</h2>
                {unreadCount>0&&<span style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,backgroundColor:C.oPrimary,color:"#fff",fontFamily:F.b}}>{unreadCount} new</span>}
              </div>
              {/* Search */}
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 10px",borderRadius:8,border:"1px solid #e5e7eb",backgroundColor:"#fafafa",marginBottom:8}}>
                <Search size={12} style={{color:"#d1d5db"}}/>
                <input placeholder="Search conversations..." style={{border:"none",outline:"none",flex:1,fontSize:11,color:C.gDark,fontFamily:F.b,backgroundColor:"transparent"}}/>
              </div>
              <div style={{display:"flex",gap:3}}>
                {[{id:"all",label:"All"},{id:"claims",label:"Claims"},{id:"offers",label:"Offers"},{id:"questions",label:"Q&A"},{id:"completed",label:"Done"}].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)}
                    style={{padding:"4px 9px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:600,fontFamily:F.b,
                      backgroundColor:filter===f.id?C.gDark:"#f3f4f6",color:filter===f.id?"#fff":"#999"}}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* Conversation groups */}
            <div style={{flex:1,overflow:"auto",padding:"6px 8px"}}>
              {activeGroups.map(g=>{
                const items=filterConvos(conversations.filter(c=>c.group===g));
                if(items.length===0)return null;
                const isCollapsed2=collapsed[g]&&g!=="active";
                return(
                  <div key={g} style={{marginBottom:6}}>
                    <button onClick={()=>g!=="active"&&toggle(g)}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"5px 8px",border:"none",cursor:g==="active"?"default":"pointer",backgroundColor:"transparent",marginBottom:3}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        {g==="active"&&<div style={{width:6,height:6,borderRadius:"50%",backgroundColor:C.gPrimary}}/>}
                        <span style={{fontSize:10,fontWeight:800,color:g==="active"?C.gPrimary:"#ccc",textTransform:"uppercase",letterSpacing:1.2,fontFamily:F.b}}>{groupLabels[g]}</span>
                        <span style={{fontSize:9,fontWeight:600,color:"#ddd",fontFamily:F.b}}>{items.length}</span>
                      </div>
                      {g!=="active"&&<ChevronDown size={12} style={{color:"#ccc",transform:isCollapsed2?"rotate(-90deg)":"rotate(0)",transition:"transform 0.2s"}}/>}
                    </button>
                    {!isCollapsed2&&items.map(c=><ConvoRow key={c.id} convo={c} active={activeConvo===c.id} onClick={()=>setActiveConvo(c.id)}/>)}
                  </div>
                );
              })}

              {/* ═══ ARCHIVED SECTION ═══ */}
              {archivedConvos.length>0&&(
                <div style={{marginTop:6,borderTop:"1px solid #f0f0f0",paddingTop:8}}>
                  <button onClick={()=>setShowArchive(!showArchive)}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",
                      backgroundColor:showArchive?"#F3F4F6":"#fafafa",border:"1px solid #e5e7eb",transition:"all 0.15s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Archive size={14} style={{color:"#999"}}/>
                      <div style={{textAlign:"left"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#777",fontFamily:F.h}}>Archived</span>
                        <p style={{fontSize:9,color:"#bbb",fontFamily:F.b}}>{archivedConvos.length} conversations</p>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:10,color:"#ccc",fontFamily:F.b}}>
                        {archivedConvos.filter(c=>c.status==="completed").length} completed · {archivedConvos.filter(c=>c.status==="declined").length} declined
                      </span>
                      <ChevronDown size={14} style={{color:"#ccc",transform:showArchive?"rotate(0)":"rotate(-90deg)",transition:"transform 0.2s"}}/>
                    </div>
                  </button>

                  {showArchive&&(
                    <div style={{marginTop:6}}>
                      {/* Archive search */}
                      <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,border:"1px solid #e5e7eb",backgroundColor:"#fff",marginBottom:6}}>
                        <Search size={11} style={{color:"#d1d5db"}}/>
                        <input value={archiveSearch} onChange={e=>setArchiveSearch(e.target.value)} placeholder="Search archived..." style={{border:"none",outline:"none",flex:1,fontSize:10,color:C.gDark,fontFamily:F.b,backgroundColor:"transparent"}}/>
                        {archiveSearch&&<button onClick={()=>setArchiveSearch("")} style={{border:"none",background:"none",cursor:"pointer",padding:0}}><X size={12} style={{color:"#ccc"}}/></button>}
                      </div>

                      {/* Grouped by archive month */}
                      {archiveSearch?
                        filteredArchive.map(c=><ConvoRow key={c.id} convo={c} active={activeConvo===c.id} onClick={()=>setActiveConvo(c.id)} compact/>)
                      :archiveMonths.map(month=>{
                        const monthItems=archivedConvos.filter(c=>c.archiveDate===month);
                        const mKey=`arch-${month}`;
                        const mCollapsed=collapsed[mKey];
                        return(
                          <div key={month} style={{marginBottom:4}}>
                            <button onClick={()=>toggle(mKey)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"4px 8px",border:"none",cursor:"pointer",backgroundColor:"transparent",marginBottom:2}}>
                              <span style={{fontSize:9,fontWeight:700,color:"#ccc",textTransform:"uppercase",letterSpacing:1,fontFamily:F.b}}>{month}</span>
                              <div style={{display:"flex",alignItems:"center",gap:4}}>
                                <span style={{fontSize:8,color:"#ddd",fontFamily:F.b}}>{monthItems.length}</span>
                                <ChevronDown size={10} style={{color:"#ddd",transform:mCollapsed?"rotate(-90deg)":"rotate(0)",transition:"transform 0.2s"}}/>
                              </div>
                            </button>
                            {!mCollapsed&&monthItems.map(c=><ConvoRow key={c.id} convo={c} active={activeConvo===c.id} onClick={()=>setActiveConvo(c.id)} compact/>)}
                          </div>
                        );
                      })}
                      {filteredArchive.length===0&&archiveSearch&&(
                        <div style={{textAlign:"center",padding:"16px 0"}}><span style={{fontSize:10,color:"#ccc",fontFamily:F.b}}>No archived conversations match "{archiveSearch}"</span></div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Thread */}
          <div style={{flex:1,display:"flex",flexDirection:"column",backgroundColor:"#fff"}}>
            {selected?<ThreadView convo={selected} onBack={()=>setActiveConvo(null)}/>:(
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,padding:40}}>
                <div style={{width:56,height:56,borderRadius:16,backgroundColor:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center"}}><MessageSquare size={24} style={{color:"#d1d5db"}}/></div>
                <p style={{fontSize:15,fontWeight:700,color:C.gDark,fontFamily:F.h}}>Select a conversation</p>
                <p style={{fontSize:12,color:"#999",fontFamily:F.b,textAlign:"center",maxWidth:260}}>Click any item to see claims, offers, questions, and pickup details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
