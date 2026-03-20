/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import CreatePackage from './pages/CreatePackage';
import Revenue from './pages/Revenue';
import Settlement from './pages/Settlement';
import Reporting from './pages/Reporting';
import Chat from './pages/Chat';
import CreateContract from './pages/CreateContract';
import ReviewContract from './pages/ReviewContract';
import SignDocument from './pages/SignDocument';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Public Routes */}
            <Route path="/" element={
              <Layout>
                <Home />
              </Layout>
            } />
            <Route path="/projects" element={
              <Layout>
                <Projects />
              </Layout>
            } />
            <Route path="/projects/create" element={
              <Layout>
                <CreatePackage />
              </Layout>
            } />
            <Route path="/projects/:id" element={
              <Layout>
                <ProjectDetails />
              </Layout>
            } />
            <Route path="/projects/:id/contracts/create" element={
              <Layout>
                <CreateContract />
              </Layout>
            } />
            <Route path="/projects/:projectId/contracts/review/:contractId" element={
              <ReviewContract />
            } />
            <Route path="/contracts/create" element={
              <Layout>
                <CreateContract />
              </Layout>
            } />
            <Route path="/contracts/sign/:id" element={
              <Layout>
                <SignDocument />
              </Layout>
            } />
            <Route path="/revenue" element={
              <Layout>
                <Revenue />
              </Layout>
            } />
            <Route path="/settlement" element={
              <Layout>
                <Settlement />
              </Layout>
            } />
            <Route path="/reporting" element={
              <Layout>
                <Reporting />
              </Layout>
            } />
            <Route path="/chat" element={
              <Layout>
                <Chat />
              </Layout>
            } />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
