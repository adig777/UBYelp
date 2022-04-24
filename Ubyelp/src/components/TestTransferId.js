import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function TestTransferId() {
    const {state} = useLocation();
    const { account_id } = state;

    //Required in previous page: navigate('/test', { 'state': {'id':id}});
    return (
        <div className="Test">
            id: {account_id}
        </div>
    );
}