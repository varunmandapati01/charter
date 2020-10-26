import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { filter } from "lodash";

import Table from './components/table'
import calculateResults from './helper';
import fetch from "./data/transaction";


const Styles = styled.div`
  
  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      
      :last-child {
        border-right: 1px solid black;
      }
    }
  }
  .pagination {
    padding: 0.5rem;
  }
  .arrow-down {
    width: 0; 
    height: 0; 
    border-left:5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;
  }
  
  .arrow-right {
    width: 0; 
    height: 0; 
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 5px solid black;
  }
  .pagination {
    border: 1px solid black;
    border-radius:0;
  }
  .btn {
    background-color: lightgray;
    width: 100%;
    :disabled {
      opacity:1;
      color:grey;
    }
  }
  input{
    width: 50px;
  }
`;



function App() {

  const [transactionData, setTransactionData] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <div {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <div className="arrow-down"></div> : <div className="arrow-right"></div>}
          </div>
        )
      },
      {
        Header: "Customer",
        accessor: "name"
      },
      {
        Header: "Month",
        accessor: "month"
      },
      {
        Header: "# of Transactions",
        accessor: "numTransactions"
      },
      {
        Header: "Reward Points",
        accessor: "points"
      }
    ],
    []
  );
  const totalsByColumns = React.useMemo(
    () => [
      {
        Header: "Customer",
        accessor: "name"
      },
      {
        Header: "Points",
        accessor: "points"
      }
    ],
    []
  );

  const getIndividualTransactions = row => {
    let byCustMonth = filter(transactionData.pointsPerTransaction, tRow => {
      return (
        row.original.custid === tRow.custid &&
        row.original.monthNumber === tRow.month
      );
    });
    return byCustMonth;
  };

  useEffect(() => {
    fetch().then(data => {
      const results = calculateResults(data);
      setTransactionData(results);
    });
  }, []);

  const renderRowSubComponent = ({ row }) => {
    return (
      <div>
        {getIndividualTransactions(row).map(tran => {
          return (
            <div className="container">
              <div className="row">
                <div className="col-8">
                  <strong>Transaction Date:</strong> {tran.transactionDt} -{" "}
                  <strong>$</strong>
                  {tran.amt} - <strong>Points: </strong>
                  {tran.points}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return transactionData == null ? (
    <div>Loading...</div>
  ) : (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-8">
              <h2>Points Rewards System Totals by Customer Months</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <Styles>
                <Table
                  columns={columns}
                  data={transactionData.summaryByCustomer}
                  renderRowSubComponent={renderRowSubComponent}
                />
              </Styles>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-8">
              <h2>Points Rewards System Totals By Customer</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <Styles>
                {
                  <Table
                    columns={totalsByColumns}
                    data={transactionData.totalPointsByCustomer}
                  />
                }
              </Styles>
            </div>
          </div>
        </div>
      </div>
    );
}

export default App;
