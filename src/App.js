import React from "react";

import { DailyReport } from "./DailyReport";
import { RealtimeReport } from "./RealtimeReport";
import "./App.css";

function App() {
  const [tab, setTab] = React.useState(1);
  return (
    <div className="main">
      <h1>HIGHWAY MONITORING DASHBOARD</h1>
      <div className="tab">
        <button
          className={`tablinks ${tab === 1 ? " active" : ""}`}
          onClick={() => {
            setTab(1);
          }}
        >
          Daily data
        </button>
        <button
          className={`tablinks ${tab === 2 ? " active" : ""}`}
          onClick={() => {
            setTab(2);
          }}
        >
          Realtime data
        </button>
      </div>
      <div className="rowItem" style={{ paddingBottom: "8px" }}>
        {tab === 1 ? <DailyReport /> : <RealtimeReport />}
      </div>
    </div>
  );
}

export default App;
