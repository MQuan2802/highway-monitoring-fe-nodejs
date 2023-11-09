import React from "react";
import moment from 'moment';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

import {DailyReport} from './DailyReport'

import "./App.css";


// Step 2 - Include the react-fusioncharts component
// import ReactFC from "react-fusioncharts";

// Step 3 - Include the fusioncharts library
// import FusionCharts from "fusioncharts";

// Step 4 - Include the chart type
// import Column2D from "fusioncharts/fusioncharts.charts";


const TEN_SECONDS = 10000;

function App() {
  const [rtData, setRtData] = React.useState();
  ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
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

  // const defaultValue = data.currentStatisticDate;
  React.useEffect(() => {
    fetchRealtimeData().then(data => setRtData(data));    
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
        width: "600",
        height: "400",
        dataFormat: "json",
        dataSource: {
           chart: {
              baseFontSize: "15",
              caption: "Vehicle Exit",
              subCaption: outDate2,
              numberPrefix: "",
              numdisplaysets: "10",
              labeldisplay: "rotate",
              showRealTimeValue: "2",
              plotToolText: "$label<br>Count: <b>$dataValue</b>",
              setAdaptiveYMin: "1",
              theme: "fusion"
           },
           categories: [
              {
                 category: [
                    {
                       label: 
                       rtData?.window_end ? moment(rtData.window_end).local(true).format("HH:mm:ss") : null

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
                // Fetch updated real-time data asynchronously
                fetchRealtimeData().then(function (updatedData) {
                  var val = updatedData?.exit_count ?? 0;
                  let endTime = updatedData?.window_end ? moment(updatedData.window_end).local(true).format("HH:mm:ss") : null;
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
       width: "600",
       height: "400",
       dataFormat: "json",
       dataSource: {
          chart: {
            baseFontSize: "15",
             caption: "Vehicle Entry",
             subCaption: outDate2,
             numberPrefix: "",
             numdisplaysets: "10",
             labeldisplay: "rotate",
             showRealTimeValue: "1",
             plotToolText: "$label<br>Count: <b>$dataValue</b>",
             setAdaptiveYMin: "1",
             theme: "fusion",
             baseFontWeight: "300",
             baseFontColor:"#0066cc"
          },
          categories: [
             {
                category: [
                
                   {
                      label:
                      rtData?.window_end ? moment(rtData.window_end).local(true).format("HH:mm:ss") : null
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
              fetchRealtimeData().then(function (updatedData) {
                var val = updatedData?.entry_count ?? 0;
                let endTime = updatedData?.window_end ? moment(updatedData.window_end).local(true).format("HH:mm:ss") : null;
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
  });

  return (
    <div className="main" >
      <h1>
        HIGHWAY MONITORING DASHBOARD
      </h1>
      <div className="rowItem" style={{paddingBottom: '8px'}}>
        <div id="chart-container" />
        <div id="chart-container2" />
      </div>
      <DailyReport />

     
    </div>
  );
}

export default App;
