import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from '../components/HeaderContainerComponent';
import Board from './Board';

const RoutesComponent = () => {
    return (
        <Router>
                <Header/>
                <Routes>
                    <Route path="/board"
                        element={<Board/>}></Route>
                </Routes>
            <Navigate from="/" to="/board"/>
        </Router>
    );
};

export default RoutesComponent;
