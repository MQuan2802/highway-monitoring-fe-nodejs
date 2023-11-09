import React from "react";
import Select from 'react-select';

import { SummaryItem, SummaryPie } from "./components";

import "./App.css";


export const DailyReport = () => {
  const [data, setData] = React.useState();
  
  const handleSelectChange = (selectedOption) => {
      fetch(`http://localhost:8080/api/dailyInsights?requestDate=${selectedOption.value}`)
        .then(async (response) => {
          if (response.ok) {
            const jsonRes = await response.json();
            setData(jsonRes);
            setSelectedDate({label:jsonRes.currentStatisticDate, value:jsonRes.currentStatisticDate})
            let dateMap = [];
            jsonRes.availableDates?.forEach(date => {
              dateMap.push({label:date,value:date})         
            });
            console.log(dateMap);
            setAvailableDates(dateMap);
          }
        })
        .catch(() => alert("Unexpected error when fetching data .."));
  };

  const [selectedDate, setSelectedDate] = React.useState({label:"Fetching...",value:""});
  const [availableDates, setAvailableDates] = React.useState([]);


  React.useEffect(() => {
    fetch("http://localhost:8080/api/dailyInsights")
      .then(async (response) => {
        if (response.ok) {
          const jsonRes = await response.json();
          setData(jsonRes);
          setSelectedDate({label:jsonRes.currentStatisticDate, value:jsonRes.currentStatisticDate})
          let dateMap = [];
          jsonRes.availableDates?.forEach(date => {
            dateMap.push({label:date,value:date})         
          });
          console.log(dateMap);
          setAvailableDates(dateMap);
        }
      })
      .catch(() => alert("Unexpected error when fetching data .."));
  }, []);

  return (
    <div>
      <div style={{width: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <div style={{width: '200px', fontSize: '15px', paddingBottom: '8px'}}>
          <Select
            options={availableDates}
            value={selectedDate}
            onChange={handleSelectChange}
          />
        </div>
      </div>
      <div className="rowItem">
        <SummaryPie
          label="Type of Vehicle"
          chartData={[
            { label: "truck", value: data?.truck ?? 0 },
            { label: "bus", value: data?.bus ?? 0 },
            { label: "car", value: data?.car ?? 0 },
          ]}
        />
        <SummaryItem label="Total Vehicle" description="In a day"value={data?.total_in ?? 0} />
        <SummaryItem label="Average Speed" description="KM/H" value={data?.average_speed ?? 0} />
      </div>
      <div className="rowItem">
        <SummaryPie
          label="Commercial/Non-commercial"
          chartData={[
            { label: "commercial", value: data?.commercial ?? 0 },
            { label: "non-commercial", value: data?.non_commerical ?? 0 },
          ]}
        />
        <SummaryItem
          label="Total Car Entry"
          description="In morning rush hour"
          value={data?.morning_rush_hour_entry ?? 0}
        />
        <SummaryItem
          label="Total Car ENTRY"
          description="In evening rush hour"
          value={data?.evening_rush_hour_entry ?? 0}
        />
      </div>
    </div>
  );
}
