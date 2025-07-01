import React from 'react';

interface DashboardContentProps {
  user: any;
  logoutError: string;
}

export default function DashboardContent({ user, logoutError }: DashboardContentProps) {
  return (
    <main className="dashboard-main">
      
      {/* Quick Actions */}
      <div className="grid-container">
        <div className="card">
          <h3>View Transactions</h3>
          <p>Review customer transactions</p>
        </div>
        <div className="card">
          <h3>Customer Support</h3>
          <p>Assist customers with queries</p>
        </div>
        <div className="card">
          <h3>Reports & Analytics</h3>
          <p>Generate business reports</p>
        </div>
      </div>

      {/* Logout Error */}
      {logoutError && (
        <div className="error-message">
          {logoutError}
        </div>
      )}
    </main>
  );
}