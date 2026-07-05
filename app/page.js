"use client";
import { useState, useEffect, useRef } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSy",
  authDomain: "daily-report-27522.firebaseapp.com",
  projectId: "daily-report-27522"
});

const db = getFirestore(app);

export default function Home() {
  const [form, setForm] = useState({});
  const [list, setList] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [editId, setEditId] = useState(null);
  const refs = useRef([]);

  // Enter移動
  const next = (e,i)=>{
    if(e.key==="Enter"){
      e.preventDefault();
      refs.current[i+1]?.focus();
    }
  };

  const change = (k,v)=>{
    setForm(prev=>({ ...prev, [k]: v }));
  };

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"reports"),snap=>{
      setList(snap.docs.map(d=>({ id:d.id,...d.data() })));
    });
    return ()=>unsub();
  },[]);

  // 利用時間
  const duration = ()=>{
    if(!form.start||!form.end) return "";
    const s=new Date(`2024-01-01T${form.start}`);
    const e=new Date(`2024-01-01T${form.end}`);
    const diff=(e-s)/60000;
    return `${Math.floor(diff/60)}時間${diff%60}分`;
  };

  // 交通費
  const transport=(Number(form.distance)||0)*40;

  // 売上合計
  const total=
    (Number(form.cash)||0)+
    (Number(form.receivable)||0)+
    (Number(form.toll)||0)+
    (Number(form.advance)||0)-
    (Number(form.use)||0)+
    transport;

  // 保存
  const save=async()=>{
    const createInvoice = async () => {
  if (!searchName) {
    
lert("保存直前");

const buffer = await workbook.xlsx.writeBuffer();

    return;
  }

  const response = await fetch("/templates/請求書振替.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.getWorksheet(1);

  // 利用者氏名
  sheet.getCell("I5").value = searchName;

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `${searchName}_請求書.xlsx`
  );
};
    const data={...form,transport,total,duration:duration()};
    if(editId){
      await updateDoc(doc(db,"reports",editId),data);
      setEditId(null);
    }else{
      await addDoc(collection(db,"reports"),data);
    }
    setForm({});
  };
const createInvoice = async (fileName) => {
  const response = await fetch("/templates/請求書振替.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const sheet = workbook.getWorksheet(1);

  
sheet.getCell("I5").value =
  filteredList[0]?.name || searchName;
filteredList.forEach((r, index) => {
  
  const row = 15 + index;

 
const d = r.date.split("-");

sheet.getCell(`A${row}`).value =
  `${Number(d[1])}/${Number(d[2])}`;
sheet.getCell(`B${row}`).value = String(r.start || "");
sheet.getCell(`C${row}`).value = String(r.end || "");

  sheet.getCell(`D${row}`).value = r.content;
 const timeText =
  r.duration
    ?.replace("時間", ":")
    .replace("分", "") || "";

sheet.getCell(`L${row}`).value =
  timeText.replace(/:(\d)$/, ":0$1");
  sheet.getCell(`M${row}`).value =
  r.distance ? `${r.distance}km` : "";
  sheet.getCell(`O${row}`).value = Number(r.total || 0);
});

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `${searchName}_請求書.xlsx`
  );
};
  const edit=r=>{
    setForm(r);
    setEditId(r.id);
  };

  const remove=async id=>{
    await deleteDoc(doc(db,"reports",id));
  };
const monthTotal = list.reduce(
  (sum, r) => sum + (Number(r.total) || 0),
  0
);

const monthCount = list.length;
const filteredList = list.filter((r) => {
  const dateMatch =
    !searchDate || r.date === searchDate;

  const nameMatch =
    !searchName ||
    (r.name || "").includes(searchName);

  return dateMatch && nameMatch;
});

const billStyle = {
  background:"#FF9800",
  color:"white",
  border:"none",
  borderRadius:"6px",
  padding:"6px 10px",
  margin:"5px",
  cursor:"pointer",
  fontWeight:"bold"
};

const reportStyle = {
  background:"#2196F3",
  color:"white",
  border:"none",
  borderRadius:"6px",
  padding:"6px 10px",
  margin:"5px",
  cursor:"pointer",
  fontWeight:"bold"
};
  // CSV
  const downloadCSV=()=>{
    const headers=[
      "日付","利用者","迎先","担当",
     "利用時間", "開始","終了",
      "内容","備考",
      "現金売上","売掛","立替","有料道路","現金使用","現金使用内容",
      "距離","交通費","売上合計"
    ];

   const rows = filteredList.map(r => [
      r.date,r.name,r.place,r.staff,
      r.duration,r.start,r.end,
      r.content,`"${(r.note || "").replace(/"/g, '""')}"`,
      r.cash,r.receivable,r.advance,r.toll,r.use,`"${(r.useNote || "").replace(/"/g, '""')}"`,
      r.distance,r.transport,r.total
    ]);

    const csv=[headers,...rows].map(r=>r.join(",")).join("\n");
    const bom=new Uint8Array([0xEF,0xBB,0xBF]);
    const blob=new Blob([bom,csv]);

    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="report.csv";
    a.click();
  };

  return (
    <div style={{padding:20}}>
    
      <h2>日報 完成版</h2>

<div style={{ marginBottom: "10px" }}>
  <input
    type="date"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
  />

  <input
    placeholder="利用者検索"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    style={{ marginLeft: "10px" }}
  />
</div>

<p>登録件数：{monthCount}件</p>
<p>売上合計：{monthTotal.toLocaleString()}円</p>
`
      <input ref={e=>refs.current[0]=e} onKeyDown={e=>next(e,0)} type="date"
        value={form.date||""} onChange={e=>change("date",e.target.value)} />

      <input ref={e=>refs.current[1]=e} onKeyDown={e=>next(e,1)}
        placeholder="利用者" value={form.name||""}
        onChange={e=>change("name",e.target.value)} />

      <input ref={e=>refs.current[2]=e} onKeyDown={e=>next(e,2)}
        placeholder="迎先" value={form.place||""}
        onChange={e=>change("place",e.target.value)} />

      <input ref={e=>refs.current[3]=e} onKeyDown={e=>next(e,3)}
        placeholder="担当" value={form.staff||""}
        onChange={e=>change("staff",e.target.value)} />

      <input ref={e=>refs.current[4]=e} onKeyDown={e=>next(e,4)} type="time"
        value={form.start||""} onChange={e=>change("start",e.target.value)} />

      <input ref={e=>refs.current[5]=e} onKeyDown={e=>next(e,5)} type="time"
        value={form.end||""} onChange={e=>change("end",e.target.value)} />

      <input ref={e=>refs.current[6]=e} onKeyDown={e=>next(e,6)}
        placeholder="内容" value={form.content||""}
        onChange={e=>change("content",e.target.value)} />

      
<textarea
  ref={e=>refs.current[7]=e}
  placeholder="備考"
  value={form.note||""}
  onChange={e=>change("note",e.target.value)}
  style={{width:"200px",height:"60px"}}
/>

      <input ref={e=>refs.current[8]=e} onKeyDown={e=>next(e,8)}
        placeholder="現金売上" value={form.cash||""}
        onChange={e=>change("cash",e.target.value)} />

      <input ref={e=>refs.current[9]=e} onKeyDown={e=>next(e,9)}
        placeholder="売掛" value={form.receivable||""}
        onChange={e=>change("receivable",e.target.value)} />

      <input ref={e=>refs.current[10]=e} onKeyDown={e=>next(e,10)}
        placeholder="立替" value={form.advance||""}
        onChange={e=>change("advance",e.target.value)} />

      <input ref={e=>refs.current[11]=e} onKeyDown={e=>next(e,11)}
        placeholder="有料道路" value={form.toll||""}
        onChange={e=>change("toll",e.target.value)} />

      <input ref={e=>refs.current[12]=e} onKeyDown={e=>next(e,12)}
        placeholder="現金使用" value={form.use||""}
        onChange={e=>change("use",e.target.value)} />

      <input ref={e=>refs.current[14]=e}
       onKeyDown={e=>next(e,14)}
       placeholder="現金使用内容"
       value={form.useNote||""}
       onChange={e=>change("useNote",e.target.value)}/>
      <input ref={e=>refs.current[15]=e} onKeyDown={e=>next(e,13)}
        placeholder="距離" value={form.distance||""}
        onChange={e=>change("nce",e.target.value)} />

      <p>利用時間：{duration()}</p>
      <p>交通費：{transport}</p>
      <p>売上合計：{total}</p>

     <button
  style={{
    background:"#4CAF50",
    color:"white",
    border:"none",
    borderRadius:"6px",
    padding:"6px 10px",
    margin:"5px"
  }}
  onClick={save}
>
  {editId ? "更新" : "保存"}
</button>

<button
  style={{
    background:"#1976D2",
    color:"white",
    border:"none",
    borderRadius:"6px",
    padding:"6px 10px",
    margin:"5px"
  }}
  onClick={downloadCSV}
>
  CSV
</button>

<br /><br />

<h3>帳票</h3>

<button
  style={billStyle}
 onClick={createInvoice}
>
  口座振替
</button>

<button
  style={billStyle}
  onClick={() => window.open("/templates/請求書振込.xlsx", "_blank")}
>
  振込
</button>

<button
  style={billStyle}
  onClick={() => window.open("/templates/請求書現金.xlsx", "_blank")}
>
  現金請求
</button>

<button
  style={billStyle}
  onClick={() => window.open("/templates/請求書他会社.xlsx", "_blank")}
>
  他会社対応
</button>

<br /><br />

<button
  style={reportStyle}
  onClick={() => window.open("/templates/報告書.docx", "_blank")}
>
  報告書
</button>

<button
  style={reportStyle}
  onClick={() => window.open("/templates/FAX送信表 報告書入り.docx", "_blank")}
>
  FAX送付表
</button>
      <hr/>
<table style={{
  width:"100%",
  borderCollapse:"collapse",
  marginTop:"20px",
  fontSize:"14px"
}}>
  <thead style={{background:"#2f6b6f",color:"white"}}>
    <tr>
      <th>日付</th>
      <th>利用者</th>
      <th>迎先</th>
      <th>担当</th>
      <th>利用時間</th>
      <th>時間</th>
      <th>内容</th>
      <th>備考</th>
      <th>現金使用内容</th>
      <th>売上</th>
      <th>操作</th>
    </tr>
  </thead>

 <tbody>
  {filteredList.map(r=>(
   
<tr
  key={r.id}
  style={{ background: r.id % 2 === 0 ? "#f9f9f9" : "white" }}
>

     <td style={{border:"1px solid #ccc",padding:"6px"}}>{r.date}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.name}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.place}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.staff}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.duration}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.start}～{r.end}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.content}</td>
<td style={{
  border:"1px solid #ccc",
  padding:"6px",
  whiteSpace:"pre-wrap"
}}>
  {r.note}
</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.useNote}</td>
<td style={{border:"1px solid #ccc",padding:"6px"}}>{r.total}</td>
      <td>
        <button
  style={{
    background:"#4CAF50",
    color:"white",
    border:"none",
    padding:"5px 10px",
    borderRadius:"5px",
    cursor:"pointer"
  }}
  onClick={()=>edit(r)}
>
  編集
</button>
        <br/><br/>
        <button style={{color:"red"}}
          onClick={()=>{
            if(confirm("本当に削除しますか？")){
              remove(r.id);
            }
          }}>
          削除
        </button>
      </td>
    </tr>
  ))}
</tbody>
``
</table>
</div>
);
}

