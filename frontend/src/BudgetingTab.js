import React from 'react';
import './App.scss';

function BudgetingTab({ loggedInRole }) {
  return (
    <div className="budgeting-container">
      <h1>Budget Management</h1>
      <div className="budgeting-content">
        <p>Welcome to the budgeting section. This feature is currently under development.</p>
        <p>Your role: <strong>{loggedInRole}</strong></p>
      </div>
    </div>
  );
}

export default BudgetingTab;
