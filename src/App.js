import React from "react";
import { SummaryItem, SummaryPie } from "./components";
import "./App.css";
import Select from 'react-select';



// Step 2 - Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Step 3 - Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Step 4 - Include the chart type
import Column2D from "fusioncharts/fusioncharts.charts";


const TEN_SECONDS = 10000;

function App() {
  const [data, setData] = React.useState();
  const [realtimeData, setRealtimeData] = React.useState();
  const [rtData, setRtData] = React.useState();
  
  function fetchRealtimeData() {
    return new Promise(function (resolve, reject) {
      fetch('http://localhost:8080/api/realtimeInsights')
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(function (data) {
          resolve(data); // Resolve with the fetched data
        })
        .catch(function (error) {
          reject(error); // Reject with the error
        });
    });
  }


  // const fetchRealtimeData = () => {
  //   fetch("http://localhost:8080/api/realtimeInsights")
  //     .then(async (response) => {
  //       if (response.ok) {
  //         const jsonRes = await response.json();
  //         setRealtimeData(jsonRes);
  //       }
  //     })
  //     .catch(() => alert("Unexpected error when fetching data .."));
  // };

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

  // const defaultValue = data.currentStatisticDate;
  React.useEffect(() => {
    fetchRealtimeData().then(data => setRtData(data));    
  }, []);

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

  React.useEffect(() => {
    console.log("hello");
  }, []);

  FusionCharts.ready(function() {
    var d = new Date();
    var monthArr = [
       "Jan",
       "Feb",
       "Mar",
       "Apr",
       "May",
       "June",
       "Jul",
       "Aug",
       "Sep",
       "Oct",
       "Nov",
       "Dec"
    ];
 
    var outDate2 =
       monthArr[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
       new FusionCharts({
        type: "realtimeline",
  
        renderAt: "chart-container2",
        width: "522",
        height: "400",
        dataFormat: "json",
        dataSource: {
           chart: {
              caption: "Vehicle Exit",
              subCaption: outDate2,
              numberPrefix: "",
              numdisplaysets: "10",
              labeldisplay: "rotate",
              showRealTimeValue: "0",
              theme: "umber",
              plotToolText: "$label<br>Price: <b>$dataValue</b>",
              setAdaptiveYMin: "1"
           },
           categories: [
              {
                 category: [
                    {
                       label: 
                          d.getHours() +
                          ":" +
                          d.getMinutes() +
                          ":" +
                          d.getSeconds()
                    }
                 ]
              }
           ],
           dataset: [
              {
                  data: [
                    {
                       value: rtData?.exit_count ?? 0,
                    }
                  ]
              }
           ]
        },
        events: {
           initialized: function(evt, arg) {
              // Get reference to the chart
              var chartRef = evt.sender;
  
              function updateData() {
                var t = new Date(),
                date =
                  t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

              // Fetch updated real-time data asynchronously
              fetchRealtimeData().then(function (updatedData) {
                var val = updatedData?.exit_count ?? 0;
                // rtData = updatedData;
                let startTime = updatedData?.window_start ? new Date(updatedData.window_start).toLocaleTimeString() : null;
                let endTime = updatedData?.window_end ? new Date(updatedData.window_end).toLocaleTimeString() : null;
                console.log("update chart data"+updateData);
                var strData = "&label=" + endTime + "&value=" + val;
                
                // Feed the updated data to the chart
                chartRef.feedData(strData);
              });
            }

            chartRef.intervalUpdateId = setInterval(updateData, TEN_SECONDS);
           },
  
           disposed: function(evt, args) {
              clearInterval(evt.sender.intervalUpdateId);
           }
        }
     }).render();

    new FusionCharts({
       type: "realtimeline",
 
       renderAt: "chart-container",
       width: "522",
       height: "400",
       dataFormat: "json",
       dataSource: {
          chart: {
             caption: "Vehicle Entry",
             subCaption: outDate2,
             numberPrefix: "",
             numdisplaysets: "10",
             labeldisplay: "rotate",
             showRealTimeValue: "0",
             theme: "candy",
             plotToolText: "$label<br>Price: <b>$dataValue</b>",
             setAdaptiveYMin: "1"
          },
          categories: [
             {
                category: [
                
                   {
                      label:
                         d.getHours() +
                         ":" +
                         d.getMinutes() +
                         ":" +
                         d.getSeconds()
                   }
                ]
             }
          ],
          dataset: [
             {
                data: [
                 
                   {
                      value: rtData?.entry_count ?? 0
                   }
                ]
             }
          ]
       },
       events: {
          initialized: function(evt, arg) {
             // Get reference to the chart
             var chartRef = evt.sender;
 
             function updateData() {
              var t = new Date(),
              date =
                t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

            // var val = rtData?.entry_count ?? 0;
            // var strData = "&label=" + date + "&value=" + val;
            // chartRef.feedData(strData);
            // Fetch updated real-time data asynchronously
            fetchRealtimeData().then(function (updatedData) {
              var val = updatedData.entry_count ?? 0;
              var strData = "&label=" + date + "&value=" + val;

              // Feed the updated data to the chart
              chartRef.feedData(strData);
            });
          }
 
             chartRef.intervalUpdateId = setInterval(updateData, TEN_SECONDS);
          },
 
          disposed: function(evt, args) {
             clearInterval(evt.sender.intervalUpdateId);
          }
       }
    }).render();
  });

  return (
    <div className="main">
      <Select
        options={availableDates}
        value={selectedDate}
        onChange={handleSelectChange}
      />
      <div className="rowItem">
        <SummaryPie
          label="Type of Vehicle"
          chartData={[
            { label: "truck", value: data?.truck ?? 0 },
            { label: "bus", value: data?.bus ?? 0 },
            { label: "car", value: data?.car ?? 0 },
          ]}
        />
        <>
            <div id="chart-container" />
        </>
        <SummaryItem label="Total Vehicle" value={data?.total_in ?? 0} />
        <SummaryItem label="Average Speed" value={data?.average_speed ?? 0} />
      </div>
      <div className="rowItem">
        <SummaryPie
          label="Commercial/Non-commercial"
          chartData={[
            { label: "commercial", value: data?.commercial ?? 0 },
            { label: "non-commercial", value: data?.non_commerical ?? 0 },
          ]}
        />
          <>
            <div id="chart-container2" />
        </>
        <SummaryItem
          label="Total Car Entry"
          description="in rush hour"
          value={data?.morning_rush_hour_entry ?? 0}
        />
        <SummaryItem
          label="Total Car Exit"
          description="in rush hour"
          value={data?.evening_rush_hour_entry ?? 0}
        />
      </div>
      <div className="rowItem">
        {/* <SummaryItem
          label="Total Car Entry"
          description="in last minute"
          value={realtimeData?.exit_count ?? 0}
        /> */}
        {/* <SummaryItem
          label="Total Car Exit"
          description="in last minute"
          value={realtimeData?.entry_count ?? 0}
        /> */}
        
      
      </div>
      <div className="rowItem">
       
      </div>
    </div>
  );
}

export default App;
